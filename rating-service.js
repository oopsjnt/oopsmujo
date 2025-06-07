// Serviço de Avaliação para o aplicativo Oops Transportes Caramujo
const RatingService = {
    // Salvar uma nova avaliação
    saveRating: function(db, ratingData) {
        return new Promise((resolve, reject) => {
            // Validar dados da avaliação
            if (!ratingData.fromUserId || !ratingData.toUserId || !ratingData.rating) {
                reject(new Error('Dados de avaliação incompletos'));
                return;
            }
            
            // Verificar se a avaliação é válida (1-5)
            if (ratingData.rating < 1 || ratingData.rating > 5) {
                reject(new Error('Avaliação deve ser entre 1 e 5 estrelas'));
                return;
            }
            
            // Adicionar timestamp
            const ratingWithTimestamp = {
                ...ratingData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Salvar avaliação no Firestore
            db.collection('ratings').add(ratingWithTimestamp)
                .then(docRef => {
                    // Atualizar a média de avaliações do usuário avaliado
                    this.updateUserRatingAverage(db, ratingData.toUserId)
                        .then(() => {
                            resolve(docRef.id);
                        })
                        .catch(error => {
                            console.error("Erro ao atualizar média de avaliações:", error);
                            // Mesmo se falhar a atualização da média, a avaliação foi salva
                            resolve(docRef.id);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    
    // Atualizar a média de avaliações de um usuário
    updateUserRatingAverage: function(db, userId) {
        return new Promise((resolve, reject) => {
            // Buscar todas as avaliações do usuário
            db.collection('ratings')
                .where('toUserId', '==', userId)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        // Se não houver avaliações, definir média como 0
                        this.setUserRatingAverage(db, userId, 0, 0)
                            .then(() => resolve())
                            .catch(error => reject(error));
                        return;
                    }
                    
                    // Calcular média
                    let totalRating = 0;
                    const ratingsCount = querySnapshot.size;
                    
                    querySnapshot.forEach(doc => {
                        const ratingData = doc.data();
                        totalRating += ratingData.rating;
                    });
                    
                    const average = totalRating / ratingsCount;
                    
                    // Atualizar média no documento do usuário
                    this.setUserRatingAverage(db, userId, average, ratingsCount)
                        .then(() => resolve())
                        .catch(error => reject(error));
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    
    // Definir a média de avaliações no documento do usuário
    setUserRatingAverage: function(db, userId, average, count) {
        return db.collection('users').doc(userId).update({
            ratingAverage: average,
            ratingCount: count
        });
    },
    
    // Obter avaliações recebidas por um usuário
    getUserRatings: function(db, userId) {
        return new Promise((resolve, reject) => {
            db.collection('ratings')
                .where('toUserId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get()
                .then(async querySnapshot => {
                    if (querySnapshot.empty) {
                        resolve([]);
                        return;
                    }
                    
                    const ratings = [];
                    const userPromises = [];
                    const userCache = {};
                    
                    // Primeiro, coletamos todos os IDs de usuários que deram avaliações
                    querySnapshot.forEach(doc => {
                        const ratingData = doc.data();
                        const fromUserId = ratingData.fromUserId;
                        
                        if (!userCache[fromUserId]) {
                            userPromises.push(
                                db.collection('users').doc(fromUserId).get()
                                    .then(userDoc => {
                                        if (userDoc.exists) {
                                            userCache[fromUserId] = userDoc.data();
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Erro ao buscar usuário:", error);
                                    })
                            );
                        }
                    });
                    
                    // Aguardamos todas as promessas de busca de usuários
                    await Promise.all(userPromises);
                    
                    // Agora montamos o array de avaliações com os dados dos usuários
                    querySnapshot.forEach(doc => {
                        const ratingData = doc.data();
                        const fromUserId = ratingData.fromUserId;
                        const fromUser = userCache[fromUserId] || { name: 'Usuário desconhecido' };
                        
                        ratings.push({
                            id: doc.id,
                            rating: ratingData.rating,
                            comment: ratingData.comment || '',
                            fromUserName: fromUser.name,
                            fromUserType: fromUser.type,
                            createdAt: ratingData.createdAt ? ratingData.createdAt.toDate() : new Date()
                        });
                    });
                    
                    resolve(ratings);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    
    // Verificar se um usuário já avaliou outro após uma corrida específica
    checkIfAlreadyRated: function(db, fromUserId, toUserId, rideId) {
        return new Promise((resolve, reject) => {
            db.collection('ratings')
                .where('fromUserId', '==', fromUserId)
                .where('toUserId', '==', toUserId)
                .where('rideId', '==', rideId)
                .get()
                .then(querySnapshot => {
                    resolve(!querySnapshot.empty);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

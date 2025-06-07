// Serviço de Administração para o aplicativo Oops Transportes Caramujo
const AdminService = {
    // Obter estatísticas gerais para o dashboard
    getDashboardStats: function(db) {
        return new Promise(async (resolve, reject) => {
            try {
                // Inicializar objeto de estatísticas
                const stats = {
                    users: {
                        total: 0,
                        passengers: 0,
                        drivers: 0
                    },
                    rides: {
                        total: 0,
                        pending: 0,
                        active: 0,
                        completed: 0,
                        canceled: 0
                    },
                    ratings: {
                        total: 0,
                        average: 0
                    },
                    suggestions: {
                        total: 0,
                        new: 0
                    }
                };
                
                // Obter contagem de usuários
                const usersSnapshot = await db.collection('users').get();
                stats.users.total = usersSnapshot.size;
                
                // Contar por tipo de usuário
                usersSnapshot.forEach(doc => {
                    const userData = doc.data();
                    if (userData.type === 'passenger') {
                        stats.users.passengers++;
                    } else if (userData.type === 'driver') {
                        stats.users.drivers++;
                    }
                });
                
                // Obter contagem de corridas
                const ridesSnapshot = await db.collection('rides').get();
                stats.rides.total = ridesSnapshot.size;
                
                // Contar por status de corrida
                ridesSnapshot.forEach(doc => {
                    const rideData = doc.data();
                    if (rideData.status === 'pending') {
                        stats.rides.pending++;
                    } else if (rideData.status === 'active') {
                        stats.rides.active++;
                    } else if (rideData.status === 'completed') {
                        stats.rides.completed++;
                    } else if (rideData.status === 'canceled') {
                        stats.rides.canceled++;
                    }
                });
                
                // Obter contagem e média de avaliações
                const ratingsSnapshot = await db.collection('ratings').get();
                stats.ratings.total = ratingsSnapshot.size;
                
                if (ratingsSnapshot.size > 0) {
                    let totalRating = 0;
                    ratingsSnapshot.forEach(doc => {
                        const ratingData = doc.data();
                        totalRating += ratingData.rating;
                    });
                    stats.ratings.average = totalRating / ratingsSnapshot.size;
                }
                
                // Obter contagem de sugestões
                const suggestionsSnapshot = await db.collection('suggestions').get();
                stats.suggestions.total = suggestionsSnapshot.size;
                
                // Contar sugestões novas (últimos 7 dias)
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                
                suggestionsSnapshot.forEach(doc => {
                    const suggestionData = doc.data();
                    if (suggestionData.createdAt && suggestionData.createdAt.toDate() > oneWeekAgo) {
                        stats.suggestions.new++;
                    }
                });
                
                resolve(stats);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Obter dados para o gráfico de corridas por dia (últimos 7 dias)
    getRidesChartData: function(db) {
        return new Promise(async (resolve, reject) => {
            try {
                // Inicializar dados do gráfico
                const chartData = {
                    labels: [],
                    data: []
                };
                
                // Gerar labels para os últimos 7 dias
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
                    chartData.labels.push(formattedDate);
                    chartData.data.push(0);
                }
                
                // Obter corridas dos últimos 7 dias
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);
                
                const ridesSnapshot = await db.collection('rides')
                    .where('createdAt', '>=', sevenDaysAgo)
                    .get();
                
                // Contar corridas por dia
                ridesSnapshot.forEach(doc => {
                    const rideData = doc.data();
                    if (rideData.createdAt) {
                        const rideDate = rideData.createdAt.toDate();
                        const today = new Date();
                        const diffDays = Math.floor((today - rideDate) / (1000 * 60 * 60 * 24));
                        
                        if (diffDays >= 0 && diffDays < 7) {
                            chartData.data[6 - diffDays]++;
                        }
                    }
                });
                
                resolve(chartData);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Obter lista de usuários com filtros
    getUsers: function(db, filter = 'all', searchTerm = '') {
        return new Promise(async (resolve, reject) => {
            try {
                let query = db.collection('users');
                
                // Aplicar filtro por tipo
                if (filter === 'passenger') {
                    query = query.where('type', '==', 'passenger');
                } else if (filter === 'driver') {
                    query = query.where('type', '==', 'driver');
                }
                
                const usersSnapshot = await query.get();
                let users = [];
                
                usersSnapshot.forEach(doc => {
                    const userData = doc.data();
                    users.push({
                        id: doc.id,
                        name: userData.name || 'Sem nome',
                        email: userData.email || 'Sem email',
                        phone: userData.phone || 'Sem telefone',
                        type: userData.type || 'unknown',
                        ratingAverage: userData.ratingAverage || 0,
                        ratingCount: userData.ratingCount || 0,
                        profilePictureUrl: userData.profilePictureUrl || null,
                        createdAt: userData.createdAt ? userData.createdAt.toDate() : new Date(),
                        isBlocked: userData.isBlocked || false
                    });
                });
                
                // Aplicar filtro por termo de busca
                if (searchTerm) {
                    const searchTermLower = searchTerm.toLowerCase();
                    users = users.filter(user => 
                        user.name.toLowerCase().includes(searchTermLower) || 
                        user.email.toLowerCase().includes(searchTermLower)
                    );
                }
                
                // Ordenar por nome
                users.sort((a, b) => a.name.localeCompare(b.name));
                
                resolve(users);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Obter detalhes de um usuário específico
    getUserDetails: function(db, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                // Obter documento do usuário
                const userDoc = await db.collection('users').doc(userId).get();
                
                if (!userDoc.exists) {
                    reject(new Error('Usuário não encontrado'));
                    return;
                }
                
                const userData = userDoc.data();
                
                // Contar corridas do usuário
                let ridesQuery;
                if (userData.type === 'passenger') {
                    ridesQuery = db.collection('rides').where('passengerId', '==', userId);
                } else {
                    ridesQuery = db.collection('rides').where('driverId', '==', userId);
                }
                
                const ridesSnapshot = await ridesQuery.get();
                
                // Montar objeto de detalhes
                const userDetails = {
                    id: userDoc.id,
                    name: userData.name || 'Sem nome',
                    email: userData.email || 'Sem email',
                    phone: userData.phone || 'Sem telefone',
                    type: userData.type || 'unknown',
                    ratingAverage: userData.ratingAverage || 0,
                    ratingCount: userData.ratingCount || 0,
                    profilePictureUrl: userData.profilePictureUrl || null,
                    createdAt: userData.createdAt ? userData.createdAt.toDate() : new Date(),
                    isBlocked: userData.isBlocked || false,
                    ridesCount: ridesSnapshot.size
                };
                
                resolve(userDetails);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Bloquear/desbloquear um usuário
    toggleUserBlock: function(db, userId, block) {
        return db.collection('users').doc(userId).update({
            isBlocked: block
        });
    },
    
    // Obter lista de corridas com filtros
    getRides: function(db, filter = 'all', searchTerm = '') {
        return new Promise(async (resolve, reject) => {
            try {
                let query = db.collection('rides');
                
                // Aplicar filtro por status
                if (filter !== 'all') {
                    query = query.where('status', '==', filter);
                }
                
                // Ordenar por data de criação (mais recentes primeiro)
                query = query.orderBy('createdAt', 'desc');
                
                const ridesSnapshot = await query.get();
                let rides = [];
                
                // Coletar IDs de usuários para buscar em lote
                const userIds = new Set();
                ridesSnapshot.forEach(doc => {
                    const rideData = doc.data();
                    if (rideData.passengerId) userIds.add(rideData.passengerId);
                    if (rideData.driverId) userIds.add(rideData.driverId);
                });
                
                // Buscar usuários em lote
                const userCache = {};
                const userPromises = Array.from(userIds).map(userId => 
                    db.collection('users').doc(userId).get()
                        .then(userDoc => {
                            if (userDoc.exists) {
                                userCache[userId] = userDoc.data();
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao buscar usuário:", error);
                        })
                );
                
                await Promise.all(userPromises);
                
                // Montar lista de corridas com dados de usuários
                ridesSnapshot.forEach(doc => {
                    const rideData = doc.data();
                    
                    const passenger = userCache[rideData.passengerId] || { name: 'Passageiro desconhecido' };
                    const driver = userCache[rideData.driverId] || { name: 'Mototaxista não atribuído' };
                    
                    rides.push({
                        id: doc.id,
                        pickup: rideData.pickup || 'Local não especificado',
                        destination: rideData.destination || 'Destino não especificado',
                        status: rideData.status || 'unknown',
                        passengerName: passenger.name,
                        driverName: driver.name,
                        createdAt: rideData.createdAt ? rideData.createdAt.toDate() : new Date(),
                        updatedAt: rideData.updatedAt ? rideData.updatedAt.toDate() : new Date()
                    });
                });
                
                // Aplicar filtro por termo de busca
                if (searchTerm) {
                    const searchTermLower = searchTerm.toLowerCase();
                    rides = rides.filter(ride => 
                        ride.pickup.toLowerCase().includes(searchTermLower) || 
                        ride.destination.toLowerCase().includes(searchTermLower) ||
                        ride.passengerName.toLowerCase().includes(searchTermLower) ||
                        ride.driverName.toLowerCase().includes(searchTermLower)
                    );
                }
                
                resolve(rides);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Obter detalhes de uma corrida específica
    getRideDetails: function(db, rideId) {
        return new Promise(async (resolve, reject) => {
            try {
                // Obter documento da corrida
                const rideDoc = await db.collection('rides').doc(rideId).get();
                
                if (!rideDoc.exists) {
                    reject(new Error('Corrida não encontrada'));
                    return;
                }
                
                const rideData = rideDoc.data();
                
                // Buscar dados do passageiro e motorista
                let passengerName = 'Passageiro desconhecido';
                let driverName = 'Mototaxista não atribuído';
                
                if (rideData.passengerId) {
                    const passengerDoc = await db.collection('users').doc(rideData.passengerId).get();
                    if (passengerDoc.exists) {
                        passengerName = passengerDoc.data().name || passengerName;
                    }
                }
                
                if (rideData.driverId) {
                    const driverDoc = await db.collection('users').doc(rideData.driverId).get();
                    if (driverDoc.exists) {
                        driverName = driverDoc.data().name || driverName;
                    }
                }
                
                // Montar objeto de detalhes
                const rideDetails = {
                    id: rideDoc.id,
                    pickup: rideData.pickup || 'Local não especificado',
                    destination: rideData.destination || 'Destino não especificado',
                    status: rideData.status || 'unknown',
                    passengerName: passengerName,
                    driverName: driverName,
                    passengerId: rideData.passengerId,
                    driverId: rideData.driverId,
                    createdAt: rideData.createdAt ? rideData.createdAt.toDate() : new Date(),
                    updatedAt: rideData.updatedAt ? rideData.updatedAt.toDate() : new Date(),
                    cancelReason: rideData.cancelReason || null
                };
                
                resolve(rideDetails);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Cancelar uma corrida (como administrador)
    cancelRide: function(db, rideId, reason) {
        return db.collection('rides').doc(rideId).update({
            status: 'canceled',
            cancelReason: reason || 'Cancelado pelo administrador',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },
    
    // Obter lista de sugestões
    getSuggestions: function(db, searchTerm = '') {
        return new Promise(async (resolve, reject) => {
            try {
                // Ordenar por data de criação (mais recentes primeiro)
                const query = db.collection('suggestions').orderBy('createdAt', 'desc');
                
                const suggestionsSnapshot = await query.get();
                let suggestions = [];
                
                // Coletar IDs de usuários para buscar em lote
                const userIds = new Set();
                suggestionsSnapshot.forEach(doc => {
                    const suggestionData = doc.data();
                    if (suggestionData.userId) userIds.add(suggestionData.userId);
                });
                
                // Buscar usuários em lote
                const userCache = {};
                const userPromises = Array.from(userIds).map(userId => 
                    db.collection('users').doc(userId).get()
                        .then(userDoc => {
                            if (userDoc.exists) {
                                userCache[userId] = userDoc.data();
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao buscar usuário:", error);
                        })
                );
                
                await Promise.all(userPromises);
                
                // Montar lista de sugestões com dados de usuários
                suggestionsSnapshot.forEach(doc => {
                    const suggestionData = doc.data();
                    
                    const user = userCache[suggestionData.userId] || { name: 'Usuário desconhecido', type: 'unknown' };
                    
                    suggestions.push({
                        id: doc.id,
                        text: suggestionData.text || 'Sem conteúdo',
                        userName: user.name,
                        userType: user.type,
                        createdAt: suggestionData.createdAt ? suggestionData.createdAt.toDate() : new Date()
                    });
                });
                
                // Aplicar filtro por termo de busca
                if (searchTerm) {
                    const searchTermLower = searchTerm.toLowerCase();
                    suggestions = suggestions.filter(suggestion => 
                        suggestion.text.toLowerCase().includes(searchTermLower) || 
                        suggestion.userName.toLowerCase().includes(searchTermLower)
                    );
                }
                
                resolve(suggestions);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Atualizar tabela de preços
    updatePriceTable: function(storage, imageFile) {
        return new Promise((resolve, reject) => {
            // Referência para o arquivo no Storage
            const storageRef = storage.ref();
            const priceTableRef = storageRef.child('price-table.jpg');
            
            // Fazer upload da imagem
            priceTableRef.put(imageFile)
                .then(snapshot => {
                    // Obter URL de download
                    return snapshot.ref.getDownloadURL();
                })
                .then(downloadURL => {
                    resolve(downloadURL);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    
    // Obter URL da tabela de preços
    getPriceTableUrl: function(storage) {
        return new Promise((resolve, reject) => {
            // Referência para o arquivo no Storage
            const storageRef = storage.ref();
            const priceTableRef = storageRef.child('price-table.jpg');
            
            // Obter URL de download
            priceTableRef.getDownloadURL()
                .then(url => {
                    resolve(url);
                })
                .catch(error => {
                    // Se o arquivo não existir, retornar null
                    resolve(null);
                });
        });
    }
};

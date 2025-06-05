// Serviço de Avaliação para o Oops Transportes Caramujo
class RatingService {
    constructor(firestore) {
        this.db = firestore;
        this.ratingsCollection = this.db.collection('ratings');
    }

    // Adiciona uma nova avaliação
    async addRating(ratingData) {
        try {
            // Validação básica dos dados
            if (!ratingData.fromUserId || !ratingData.toUserId || !ratingData.rideId || !ratingData.rating) {
                throw new Error('Dados de avaliação incompletos');
            }

            // Verifica se já existe uma avaliação para esta corrida e usuário
            const existingRatings = await this.ratingsCollection
                .where('rideId', '==', ratingData.rideId)
                .where('fromUserId', '==', ratingData.fromUserId)
                .get();

            if (!existingRatings.empty) {
                throw new Error('Você já avaliou esta corrida');
            }

            // Adiciona timestamp
            const ratingWithTimestamp = {
                ...ratingData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Salva a avaliação
            const result = await this.ratingsCollection.add(ratingWithTimestamp);
            
            // Atualiza a média de avaliações do usuário avaliado
            await this.updateUserAverageRating(ratingData.toUserId);
            
            return result.id;
        } catch (error) {
            console.error('Erro ao adicionar avaliação:', error);
            throw error;
        }
    }

    // Obtém avaliações recebidas por um usuário
    async getUserRatings(userId) {
        try {
            const ratingsSnapshot = await this.ratingsCollection
                .where('toUserId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const ratings = [];
            ratingsSnapshot.forEach(doc => {
                ratings.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return ratings;
        } catch (error) {
            console.error('Erro ao obter avaliações do usuário:', error);
            throw error;
        }
    }

    // Calcula e atualiza a média de avaliações de um usuário
    async updateUserAverageRating(userId) {
        try {
            const ratingsSnapshot = await this.ratingsCollection
                .where('toUserId', '==', userId)
                .get();

            if (ratingsSnapshot.empty) {
                // Não há avaliações para este usuário
                return;
            }

            let totalRating = 0;
            let count = 0;

            ratingsSnapshot.forEach(doc => {
                const rating = doc.data().rating;
                if (rating && typeof rating === 'number') {
                    totalRating += rating;
                    count++;
                }
            });

            const averageRating = count > 0 ? totalRating / count : 0;

            // Atualiza o documento do usuário com a média de avaliações
            await this.db.collection('users').doc(userId).update({
                averageRating: averageRating,
                ratingCount: count
            });

            return { averageRating, count };
        } catch (error) {
            console.error('Erro ao atualizar média de avaliações:', error);
            throw error;
        }
    }

    // Obtém a média de avaliações de um usuário
    async getUserAverageRating(userId) {
        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            
            if (!userDoc.exists) {
                throw new Error('Usuário não encontrado');
            }
            
            const userData = userDoc.data();
            return {
                averageRating: userData.averageRating || 0,
                ratingCount: userData.ratingCount || 0
            };
        } catch (error) {
            console.error('Erro ao obter média de avaliações:', error);
            throw error;
        }
    }

    // Formata a exibição das estrelas de avaliação
    formatRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Estrelas cheias
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        
        // Meia estrela
        if (halfStar) {
            starsHTML += '★';
        }
        
        // Estrelas vazias
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    }
}

// Exporta o serviço
let ratingService;

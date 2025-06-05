// Serviço de Administração para o Oops Transportes Caramujo
class AdminService {
    constructor(firestore, storage) {
        this.db = firestore;
        this.storage = storage;
        this.usersCollection = this.db.collection('users');
        this.ridesCollection = this.db.collection('rides');
        this.suggestionsCollection = this.db.collection('suggestions');
        this.settingsCollection = this.db.collection('settings');
    }

    // Verifica se o usuário é administrador
    async isAdmin(userId) {
        try {
            const userDoc = await this.usersCollection.doc(userId).get();
            if (!userDoc.exists) {
                return false;
            }
            const userData = userDoc.data();
            return userData.isAdmin === true;
        } catch (error) {
            console.error('Erro ao verificar permissões de administrador:', error);
            return false;
        }
    }

    // Obtém estatísticas para o dashboard
    async getDashboardStats() {
        try {
            // Total de usuários
            const usersSnapshot = await this.usersCollection.get();
            const totalUsers = usersSnapshot.size;
            
            // Mototaxistas ativos
            const driversSnapshot = await this.usersCollection
                .where('accountType', '==', 'driver')
                .where('status', '==', 'available')
                .get();
            const activeDrivers = driversSnapshot.size;
            
            // Corridas hoje
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = firebase.firestore.Timestamp.fromDate(today);
            
            const ridesTodaySnapshot = await this.ridesCollection
                .where('createdAt', '>=', todayTimestamp)
                .get();
            const ridesToday = ridesTodaySnapshot.size;
            
            // Total de corridas
            const totalRidesSnapshot = await this.ridesCollection.get();
            const totalRides = totalRidesSnapshot.size;
            
            return {
                totalUsers,
                activeDrivers,
                ridesToday,
                totalRides
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas do dashboard:', error);
            throw error;
        }
    }

    // Obtém dados para o gráfico de corridas por dia (últimos 7 dias)
    async getRidesChartData() {
        try {
            const result = [];
            const today = new Date();
            
            // Para cada um dos últimos 7 dias
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                date.setHours(0, 0, 0, 0);
                
                const nextDate = new Date(date);
                nextDate.setDate(date.getDate() + 1);
                
                const startTimestamp = firebase.firestore.Timestamp.fromDate(date);
                const endTimestamp = firebase.firestore.Timestamp.fromDate(nextDate);
                
                const ridesSnapshot = await this.ridesCollection
                    .where('createdAt', '>=', startTimestamp)
                    .where('createdAt', '<', endTimestamp)
                    .get();
                
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                result.push({
                    day: dayName,
                    count: ridesSnapshot.size
                });
            }
            
            return result;
        } catch (error) {
            console.error('Erro ao obter dados do gráfico de corridas:', error);
            throw error;
        }
    }

    // Obtém dados para o gráfico de avaliações médias
    async getRatingsChartData() {
        try {
            // Avaliação média de passageiros
            const passengersSnapshot = await this.usersCollection
                .where('accountType', '==', 'user')
                .get();
            
            let passengerRatingSum = 0;
            let passengerRatingCount = 0;
            
            passengersSnapshot.forEach(doc => {
                const userData = doc.data();
                if (userData.averageRating && userData.ratingCount) {
                    passengerRatingSum += userData.averageRating * userData.ratingCount;
                    passengerRatingCount += userData.ratingCount;
                }
            });
            
            const passengerAverageRating = passengerRatingCount > 0 ? 
                passengerRatingSum / passengerRatingCount : 0;
            
            // Avaliação média de mototaxistas
            const driversSnapshot = await this.usersCollection
                .where('accountType', '==', 'driver')
                .get();
            
            let driverRatingSum = 0;
            let driverRatingCount = 0;
            
            driversSnapshot.forEach(doc => {
                const userData = doc.data();
                if (userData.averageRating && userData.ratingCount) {
                    driverRatingSum += userData.averageRating * userData.ratingCount;
                    driverRatingCount += userData.ratingCount;
                }
            });
            
            const driverAverageRating = driverRatingCount > 0 ? 
                driverRatingSum / driverRatingCount : 0;
            
            return {
                passengerAverageRating: parseFloat(passengerAverageRating.toFixed(1)),
                driverAverageRating: parseFloat(driverAverageRating.toFixed(1)),
                passengerRatingCount,
                driverRatingCount
            };
        } catch (error) {
            console.error('Erro ao obter dados do gráfico de avaliações:', error);
            throw error;
        }
    }

    // Obtém atividades recentes (corridas, avaliações, sugestões)
    async getRecentActivities(limit = 10) {
        try {
            // Obtém corridas recentes
            const ridesSnapshot = await this.ridesCollection
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            
            const recentRides = [];
            ridesSnapshot.forEach(doc => {
                const rideData = doc.data();
                recentRides.push({
                    id: doc.id,
                    type: 'ride',
                    status: rideData.status,
                    timestamp: rideData.createdAt,
                    details: `${rideData.passengerName} → ${rideData.destination}`
                });
            });
            
            // Obtém sugestões recentes
            const suggestionsSnapshot = await this.suggestionsCollection
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            
            const recentSuggestions = [];
            suggestionsSnapshot.forEach(doc => {
                const suggestionData = doc.data();
                recentSuggestions.push({
                    id: doc.id,
                    type: 'suggestion',
                    status: suggestionData.status,
                    timestamp: suggestionData.createdAt,
                    details: suggestionData.title
                });
            });
            
            // Combina e ordena por timestamp
            const allActivities = [...recentRides, ...recentSuggestions]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, limit);
            
            return allActivities;
        } catch (error) {
            console.error('Erro ao obter atividades recentes:', error);
            throw error;
        }
    }

    // Lista todos os usuários com filtros
    async listUsers(filter = 'all', searchTerm = '') {
        try {
            let query = this.usersCollection;
            
            // Aplica filtro
            if (filter === 'user') {
                query = query.where('accountType', '==', 'user');
            } else if (filter === 'driver') {
                query = query.where('accountType', '==', 'driver');
            } else if (filter === 'blocked') {
                query = query.where('blocked', '==', true);
            }
            
            const usersSnapshot = await query.get();
            
            const users = [];
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                
                // Aplica busca por termo se fornecido
                if (searchTerm && !userData.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                    !userData.email.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return;
                }
                
                users.push({
                    id: doc.id,
                    ...userData
                });
            });
            
            return users;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    // Bloqueia ou desbloqueia um usuário
    async toggleUserBlock(userId, blocked) {
        try {
            await this.usersCollection.doc(userId).update({
                blocked: blocked
            });
            return true;
        } catch (error) {
            console.error('Erro ao alterar status de bloqueio do usuário:', error);
            throw error;
        }
    }

    // Lista todas as corridas com filtros
    async listRides(filter = 'all', searchTerm = '') {
        try {
            let query = this.ridesCollection.orderBy('createdAt', 'desc');
            
            // Aplica filtro
            if (filter !== 'all') {
                query = this.ridesCollection.where('status', '==', filter).orderBy('createdAt', 'desc');
            }
            
            const ridesSnapshot = await query.get();
            
            const rides = [];
            ridesSnapshot.forEach(doc => {
                const rideData = doc.data();
                
                // Aplica busca por termo se fornecido
                if (searchTerm && 
                    !rideData.passengerName?.toLowerCase().includes(searchTerm.toLowerCase()) && 
                    !rideData.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !rideData.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !rideData.destination?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return;
                }
                
                rides.push({
                    id: doc.id,
                    ...rideData
                });
            });
            
            return rides;
        } catch (error) {
            console.error('Erro ao listar corridas:', error);
            throw error;
        }
    }

    // Lista todas as sugestões com filtros
    async listSuggestions(filter = 'all', searchTerm = '') {
        try {
            let query = this.suggestionsCollection.orderBy('createdAt', 'desc');
            
            // Aplica filtro
            if (filter !== 'all') {
                query = this.suggestionsCollection.where('status', '==', filter).orderBy('createdAt', 'desc');
            }
            
            const suggestionsSnapshot = await query.get();
            
            const suggestions = [];
            suggestionsSnapshot.forEach(doc => {
                const suggestionData = doc.data();
                
                // Aplica busca por termo se fornecido
                if (searchTerm && 
                    !suggestionData.title?.toLowerCase().includes(searchTerm.toLowerCase()) && 
                    !suggestionData.text?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !suggestionData.userName?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return;
                }
                
                suggestions.push({
                    id: doc.id,
                    ...suggestionData
                });
            });
            
            return suggestions;
        } catch (error) {
            console.error('Erro ao listar sugestões:', error);
            throw error;
        }
    }

    // Atualiza o status de uma sugestão
    async updateSuggestionStatus(suggestionId, status) {
        try {
            await this.suggestionsCollection.doc(suggestionId).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao atualizar status da sugestão:', error);
            throw error;
        }
    }

    // Adiciona ou atualiza a tabela de preços
    async updatePriceTable(file) {
        try {
            // Referência para o arquivo no Storage
            const storageRef = this.storage.ref();
            const fileRef = storageRef.child('price-table.png');
            
            // Faz o upload do arquivo
            await fileRef.put(file);
            
            // Obtém a URL do arquivo
            const fileUrl = await fileRef.getDownloadURL();
            
            // Atualiza a configuração no Firestore
            await this.settingsCollection.doc('priceTable').set({
                imageUrl: fileUrl,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return fileUrl;
        } catch (error) {
            console.error('Erro ao atualizar tabela de preços:', error);
            throw error;
        }
    }

    // Obtém a URL da tabela de preços
    async getPriceTableUrl() {
        try {
            const priceTableDoc = await this.settingsCollection.doc('priceTable').get();
            
            if (priceTableDoc.exists) {
                return priceTableDoc.data().imageUrl;
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao obter URL da tabela de preços:', error);
            throw error;
        }
    }

    // Atualiza as configurações do sistema
    async updateSettings(settings) {
        try {
            await this.settingsCollection.doc('appSettings').set({
                ...settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Erro ao atualizar configurações:', error);
            throw error;
        }
    }

    // Obtém as configurações do sistema
    async getSettings() {
        try {
            const settingsDoc = await this.settingsCollection.doc('appSettings').get();
            
            if (settingsDoc.exists) {
                return settingsDoc.data();
            }
            
            // Configurações padrão
            return {
                rideTimeout: 5 // 5 minutos
            };
        } catch (error) {
            console.error('Erro ao obter configurações:', error);
            throw error;
        }
    }
}

// Exporta o serviço
let adminService;

// Serviço de Avaliação para o aplicativo Oops Transportes Caramujo

// Namespace para evitar conflitos
window.RatingService = (function() {
    // Referência ao Firestore
    let db = null;
    
    // Inicializar o serviço
    const init = (firestoreInstance) => {
        db = firestoreInstance;
        return window.RatingService;
    };
    
    // Exibir formulário de avaliação
    const showRatingForm = (ratingType, rideId, targetUserId, targetUserName, targetUserPicture) => {
        return new Promise((resolve, reject) => {
            // Criar o modal de avaliação
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            const title = document.createElement('h3');
            title.textContent = `Avalie ${ratingType === 'driver' ? 'o mototaxista' : 'o passageiro'}`;
            
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info-rating';
            
            const userPicture = document.createElement('img');
            userPicture.src = targetUserPicture || 'icons/default-profile.png';
            userPicture.alt = `Foto de ${targetUserName}`;
            
            const userName = document.createElement('p');
            userName.textContent = targetUserName;
            
            userInfo.appendChild(userPicture);
            userInfo.appendChild(userName);
            
            const starsContainer = document.createElement('div');
            starsContainer.className = 'stars-container';
            
            let selectedRating = 0;
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'rating-star';
                star.textContent = '☆';
                star.dataset.value = i;
                
                star.addEventListener('click', (e) => {
                    selectedRating = parseInt(e.target.dataset.value);
                    
                    // Atualizar estrelas
                    const stars = starsContainer.querySelectorAll('.rating-star');
                    stars.forEach((s, index) => {
                        s.textContent = index < selectedRating ? '★' : '☆';
                    });
                });
                
                starsContainer.appendChild(star);
            }
            
            const commentInput = document.createElement('textarea');
            commentInput.placeholder = 'Comentário (opcional)';
            commentInput.rows = 3;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            
            const submitButton = document.createElement('button');
            submitButton.className = 'primary-button';
            submitButton.textContent = 'Enviar Avaliação';
            
            const skipButton = document.createElement('button');
            skipButton.className = 'secondary-button';
            skipButton.textContent = 'Pular';
            
            buttonContainer.appendChild(submitButton);
            buttonContainer.appendChild(skipButton);
            
            modalContent.appendChild(title);
            modalContent.appendChild(userInfo);
            modalContent.appendChild(starsContainer);
            modalContent.appendChild(commentInput);
            modalContent.appendChild(buttonContainer);
            
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            
            // Estilizar o modal
            const style = document.createElement('style');
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .modal-content {
                    background-color: var(--card-bg, white);
                    color: var(--text-color, black);
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 90%;
                    width: 400px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                
                .user-info-rating {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 15px 0;
                }
                
                .user-info-rating img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .stars-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin: 20px 0;
                    font-size: 30px;
                }
                
                .rating-star {
                    cursor: pointer;
                    color: var(--warning-color, gold);
                    transition: transform 0.1s;
                }
                
                .rating-star:hover {
                    transform: scale(1.2);
                }
                
                textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--border-color, #ccc);
                    border-radius: 4px;
                    margin-bottom: 15px;
                    background-color: var(--card-bg, white);
                    color: var(--text-color, black);
                }
                
                .button-container {
                    display: flex;
                    gap: 10px;
                }
                
                .button-container button {
                    flex: 1;
                }
            `;
            document.head.appendChild(style);
            
            // Handlers para os botões
            submitButton.addEventListener('click', () => {
                if (selectedRating === 0) {
                    alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
                    return;
                }
                
                document.body.removeChild(modalOverlay);
                document.head.removeChild(style);
                
                resolve({
                    submitted: true,
                    rating: selectedRating,
                    comment: commentInput.value.trim()
                });
            });
            
            skipButton.addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
                document.head.removeChild(style);
                
                resolve({
                    submitted: false
                });
            });
        });
    };
    
    // Salvar avaliação no Firestore
    const saveRating = (ratingData) => {
        if (!db) {
            return Promise.reject(new Error('Firestore não inicializado.'));
        }
        
        if (!ratingData || !ratingData.rideId || !ratingData.rating || !ratingData.ratedBy || !ratingData.targetUserId) {
            return Promise.reject(new Error('Dados de avaliação incompletos.'));
        }
        
        // Adicionar timestamp
        ratingData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        
        // Salvar avaliação na coleção ratings
        return db.collection('ratings').add(ratingData)
            .then((docRef) => {
                // Atualizar o documento da corrida
                const rideUpdate = {};
                if (ratingData.ratingType === 'driver') {
                    rideUpdate.driverRating = ratingData.rating;
                } else {
                    rideUpdate.passengerRating = ratingData.rating;
                }
                rideUpdate.rated = true;
                
                return db.collection('rides').doc(ratingData.rideId).update(rideUpdate)
                    .then(() => {
                        // Atualizar a média de avaliação do usuário avaliado
                        return updateUserAverageRating(ratingData.targetUserId);
                    });
            });
    };
    
    // Atualizar a média de avaliação de um usuário
    const updateUserAverageRating = (userId) => {
        return db.collection('ratings')
            .where('targetUserId', '==', userId)
            .get()
            .then((querySnapshot) => {
                let totalRating = 0;
                let count = 0;
                
                querySnapshot.forEach((doc) => {
                    const ratingData = doc.data();
                    totalRating += ratingData.rating;
                    count++;
                });
                
                const averageRating = count > 0 ? totalRating / count : 0;
                
                return db.collection('users').doc(userId).update({
                    rating: averageRating,
                    ratingCount: count
                });
            });
    };
    
    // Exibir avaliação média de um usuário
    const displayUserAverageRating = (userId, containerElement) => {
        if (!db || !containerElement) return;
        
        db.collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const rating = userData.rating || 0;
                    const ratingCount = userData.ratingCount || 0;
                    
                    containerElement.innerHTML = '';
                    
                    const averageRating = document.createElement('div');
                    averageRating.className = 'average-rating';
                    
                    const stars = document.createElement('div');
                    stars.className = 'rating-stars';
                    stars.textContent = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
                    
                    const value = document.createElement('div');
                    value.className = 'rating-value';
                    value.textContent = rating.toFixed(1);
                    
                    const count = document.createElement('div');
                    count.className = 'rating-count';
                    count.textContent = `(${ratingCount} ${ratingCount === 1 ? 'avaliação' : 'avaliações'})`;
                    
                    averageRating.appendChild(stars);
                    averageRating.appendChild(value);
                    averageRating.appendChild(count);
                    
                    containerElement.appendChild(averageRating);
                }
            })
            .catch((error) => {
                console.error('Erro ao carregar avaliação do usuário:', error);
            });
    };
    
    // Carregar histórico de avaliações de um usuário
    const loadUserRatingsHistory = (userId, containerElement) => {
        if (!db || !containerElement) return;
        
        containerElement.innerHTML = '<p class="loading-message">Carregando avaliações...</p>';
        
        db.collection('ratings')
            .where('targetUserId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get()
            .then((querySnapshot) => {
                containerElement.innerHTML = '';
                
                if (querySnapshot.empty) {
                    containerElement.innerHTML = '<p class="empty-message">Nenhuma avaliação recebida ainda.</p>';
                    return;
                }
                
                querySnapshot.forEach((doc) => {
                    const ratingData = doc.data();
                    const ratingItem = document.createElement('div');
                    ratingItem.className = 'rating-item';
                    
                    const ratingHeader = document.createElement('div');
                    ratingHeader.className = 'rating-header';
                    
                    const ratingStars = document.createElement('div');
                    ratingStars.className = 'rating-stars';
                    ratingStars.textContent = '★'.repeat(ratingData.rating) + '☆'.repeat(5 - ratingData.rating);
                    
                    const ratingDate = document.createElement('div');
                    ratingDate.className = 'rating-date';
                    if (ratingData.createdAt) {
                        const date = ratingData.createdAt.toDate();
                        ratingDate.textContent = date.toLocaleDateString('pt-BR');
                    } else {
                        ratingDate.textContent = 'Data indisponível';
                    }
                    
                    ratingHeader.appendChild(ratingStars);
                    ratingHeader.appendChild(ratingDate);
                    
                    const ratingAuthor = document.createElement('div');
                    ratingAuthor.className = 'rating-author';
                    ratingAuthor.textContent = `Por: ${ratingData.ratedByName || 'Usuário'}`;
                    
                    const ratingComment = document.createElement('div');
                    ratingComment.className = 'rating-comment';
                    ratingComment.textContent = ratingData.comment || 'Sem comentários.';
                    
                    ratingItem.appendChild(ratingHeader);
                    ratingItem.appendChild(ratingAuthor);
                    ratingItem.appendChild(ratingComment);
                    
                    containerElement.appendChild(ratingItem);
                });
            })
            .catch((error) => {
                console.error('Erro ao carregar histórico de avaliações:', error);
                containerElement.innerHTML = '<p class="error-message">Erro ao carregar avaliações.</p>';
            });
    };
    
    // API pública
    return {
        init,
        showRatingForm,
        saveRating,
        updateUserAverageRating,
        displayUserAverageRating,
        loadUserRatingsHistory
    };
})();

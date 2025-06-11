// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDcTmNZM7mgYT7PcuSFuByb2T6fw3gf0j4",
  authDomain: "oopsmujo.firebaseapp.com",
  projectId: "oopsmujo",
  storageBucket: "oopsmujo.firebasestorage.app",
  messagingSenderId: "1032028058233",
  appId: "1:1032028058233:web:6c9af952d2da504f465aa8"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referências ao Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Inicializar serviços
const geoService = window.GeoService;
const ratingService = window.RatingService.init(db);

// Variáveis globais
let currentUser = null;
let currentUserData = null;
let watchLocationId = null;
let rideCheckInterval = null;
let timeoutCheckInterval = null;

// Elementos DOM - Autenticação
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const logoutButton = document.getElementById('logout-button');

// Elementos DOM - Perfil
const userNameElement = document.getElementById('user-name');
const userProfilePicture = document.getElementById('user-profile-picture');
const profileButton = document.getElementById('profile-button');
const profileSection = document.getElementById('profile-section');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const profilePictureInput = document.getElementById('profile-picture');
const profileNameInput = document.getElementById('profile-name');
const profilePhoneInput = document.getElementById('profile-phone');
const saveProfileButton = document.getElementById('save-profile-button');

// Elementos DOM - Interface do Passageiro
const passengerInterface = document.getElementById('passenger-interface');
const pickupLocationInput = document.getElementById('pickup-location');
const destinationInput = document.getElementById('destination');
const useCurrentLocationButton = document.getElementById('use-current-location');
const locationStatus = document.getElementById('location-status');
const requestRideButton = document.getElementById('request-ride-button');
const nearbyDriversContainer = document.getElementById('nearby-drivers');
const rideStatusContainer = document.getElementById('ride-status');
const statusMessage = document.getElementById('status-message');
const cancelRideButton = document.getElementById('cancel-ride-button');
const whatsappContactContainer = document.getElementById('whatsapp-contact');

// Elementos DOM - Interface do Mototaxista
const driverInterface = document.getElementById('driver-interface');
const driverStatusSelect = document.getElementById('driver-status');
const ridesList = document.getElementById('rides-list');
const currentRideContainer = document.getElementById('current-ride');
const passengerNameElement = document.getElementById('passenger-name');
const ridePickupElement = document.getElementById('ride-pickup');
const rideDestinationElement = document.getElementById('ride-destination');
const completeRideButton = document.getElementById('complete-ride-button');
const whatsappContactDriverContainer = document.getElementById('whatsapp-contact-driver');

// Elementos DOM - Histórico
const historySection = document.getElementById('history-section');
const rideHistoryContainer = document.getElementById('ride-history');
const userRatingsHistory = document.getElementById('user-ratings-history');

// Elementos DOM - Sugestões
const suggestionsSection = document.getElementById('suggestions-section');
const suggestionTitleInput = document.getElementById('suggestion-title');
const suggestionTextInput = document.getElementById('suggestion-text');
const suggestionTypeSelect = document.getElementById('suggestion-type');
const submitSuggestionButton = document.getElementById('submit-suggestion-button');
const suggestionsList = document.getElementById('suggestions-list');

// Elementos DOM - Admin
const adminSection = document.getElementById('admin-section');
const totalUsersElement = document.getElementById('total-users');
const totalRidesElement = document.getElementById('total-rides');
const totalSuggestionsElement = document.getElementById('total-suggestions');
const totalRatingsElement = document.getElementById('total-ratings');
const usersManagement = document.getElementById('users-management');
const adminSuggestions = document.getElementById('admin-suggestions');
const adminRatings = document.getElementById('admin-ratings');

// Elementos DOM - Preços
const pricingSection = document.getElementById('pricing-section');
const pricingContent = document.getElementById('pricing-content');
const pricingAdmin = document.getElementById('pricing-admin');
const pricingImageInput = document.getElementById('pricing-image');
const uploadPricingButton = document.getElementById('upload-pricing-button');

// Elementos DOM - Pagamentos
const paymentsSection = document.getElementById('payments-section');
const paymentStatus = document.getElementById('payment-status');
const paymentHistoryList = document.getElementById('payment-history-list');

// Elementos DOM - Navegação
const navMain = document.getElementById('nav-main');
const navProfile = document.getElementById('nav-profile');
const navHistory = document.getElementById('nav-history');
const navSuggestions = document.getElementById('nav-suggestions');
const navAdmin = document.getElementById('nav-admin');
const navPricing = document.getElementById('nav-pricing');
const navPayments = document.getElementById('nav-payments');

// Elementos DOM - Termos de Uso
const acceptTermsCheckbox = document.getElementById('accept-terms');

// Elementos DOM - Tipo de Serviço
const servicePassengerRadio = document.getElementById('service-passenger');
const serviceDeliveryRadio = document.getElementById('service-delivery');

// Elementos DOM - Mototaxistas Disponíveis
const driversListContainer = document.getElementById('drivers-list');

// Eventos - Autenticação
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

loginButton.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login bem-sucedido');
        })
        .catch((error) => {
            console.error('Erro no login:', error);
            alert('Erro no login: ' + error.message);
        });
});

registerButton.addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const accountType = document.querySelector('input[name="account-type"]:checked').value;
    const acceptedTerms = acceptTermsCheckbox.checked;
    
    if (!name || !phone || !email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (!acceptedTerms) {
        alert('Você deve aceitar os termos de uso para se cadastrar.');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            return db.collection('users').doc(user.uid).set({
                name: name,
                phone: phone,
                email: email,
                accountType: accountType,
                status: accountType === 'driver' ? 'unavailable' : 'active',
                acceptedTerms: true,
                acceptedTermsAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            console.log('Cadastro bem-sucedido');
        })
        .catch((error) => {
            console.error('Erro no cadastro:', error);
            alert('Erro no cadastro: ' + error.message);
        });
});

logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log('Logout bem-sucedido');
        })
        .catch((error) => {
            console.error('Erro no logout:', error);
        });
});

// Eventos - Perfil
profileButton.addEventListener('click', () => {
    // Navegar para a aba de perfil
    document.getElementById('nav-profile').click();
});

profilePictureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicturePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

saveProfileButton.addEventListener('click', () => {
    if (!currentUser) return;
    
    const name = profileNameInput.value;
    const phone = profilePhoneInput.value;
    
    if (!name || !phone) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Atualizar dados no Firestore
    const userRef = db.collection('users').doc(currentUser.uid);
    
    // Verificar se há uma nova foto
    const file = profilePictureInput.files[0];
    
    if (file) {
        // Upload da nova foto
        const storageRef = storage.ref();
        const profilePicRef = storageRef.child(`profile_pictures/${currentUser.uid}`);
        
        profilePicRef.put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(downloadURL => {
                return userRef.update({
                    name: name,
                    phone: phone,
                    profilePictureUrl: downloadURL,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                alert('Perfil atualizado com sucesso!');
                // Atualizar interface
                userNameElement.textContent = name;
                userProfilePicture.src = profilePicturePreview.src;
                // Voltar para a tela principal
                document.getElementById('nav-main').click();
            })
            .catch(error => {
                console.error('Erro ao atualizar perfil:', error);
                alert('Erro ao atualizar perfil: ' + error.message);
            });
    } else {
        // Atualizar apenas os dados sem a foto
        userRef.update({
            name: name,
            phone: phone,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert('Perfil atualizado com sucesso!');
            // Atualizar interface
            userNameElement.textContent = name;
            // Voltar para a tela principal
            document.getElementById('nav-main').click();
        })
        .catch(error => {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil: ' + error.message);
        });
    }
});

// Eventos - Interface do Passageiro
useCurrentLocationButton.addEventListener('click', () => {
    locationStatus.textContent = 'Obtendo sua localização...';
    locationStatus.classList.remove('hidden');
    
    geoService.getCurrentPosition()
        .then(position => {
            // Salvar a posição para uso posterior
            window.currentPosition = position;
            
            return geoService.getAddressFromCoords(position.latitude, position.longitude);
        })
        .then(address => {
            pickupLocationInput.value = address.fullAddress || `${address.street} ${address.number}, ${address.neighborhood}, ${address.city}`;
            locationStatus.textContent = 'Localização obtida com sucesso!';
            locationStatus.style.color = '#28a745';
            
            // Salvar localização no perfil do usuário
            if (currentUser) {
                db.collection('users').doc(currentUser.uid).update({
                    location: {
                        latitude: window.currentPosition.latitude,
                        longitude: window.currentPosition.longitude,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }
                });
            }
            
            // Buscar mototaxistas próximos
            return geoService.findNearbyDrivers(window.currentPosition);
        })
        .then(nearbyDrivers => {
            displayNearbyDrivers(nearbyDrivers);
        })
        .catch(error => {
            console.error('Erro ao obter localização:', error);
            locationStatus.textContent = 'Erro ao obter localização: ' + error.message;
            locationStatus.style.color = '#dc3545';
        });
});

requestRideButton.addEventListener('click', () => {
    if (!currentUser) return;
    
    const pickup = pickupLocationInput.value;
    const destination = destinationInput.value;
    const serviceType = document.querySelector('input[name="service-type"]:checked').value;
    
    if (!pickup || !destination) {
        alert('Por favor, preencha os locais de partida e destino.');
        return;
    }
    
    // Verificar se o usuário já tem uma corrida ativa
    db.collection('rides')
        .where('passengerId', '==', currentUser.uid)
        .where('status', 'in', ['pending', 'accepted'])
        .get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                // Verificar se a corrida é antiga (mais de 45 minutos)
                const ride = querySnapshot.docs[0].data();
                const rideId = querySnapshot.docs[0].id;
                const now = new Date();
                const rideTime = ride.createdAt ? ride.createdAt.toDate() : new Date(0);
                const timeDiff = (now - rideTime) / (1000 * 60); // diferença em minutos
                
                if (timeDiff > 45) {
                    // Corrida antiga, cancelar automaticamente
                    return db.collection('rides').doc(rideId).update({
                        status: 'cancelled',
                        cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                        cancellationReason: 'Cancelamento automático por timeout (45 minutos)'
                    }).then(() => {
                        console.log('Corrida antiga cancelada automaticamente');
                        return Promise.resolve(false); // Continuar com a nova solicitação
                    });
                } else {
                    alert('Você já tem uma corrida ativa. Cancele-a antes de solicitar uma nova.');
                    return Promise.resolve(true); // Impedir nova solicitação
                }
            } else {
                return Promise.resolve(false); // Continuar com a solicitação
            }
        })
        .then(hasActiveRide => {
            if (hasActiveRide) return;
            
            // Obter dados do usuário para a solicitação
            return db.collection('users').doc(currentUser.uid).get();
        })
        .then(doc => {
            if (!doc) return; // Caso hasActiveRide seja true
            
            const userData = doc.data();
            
            // Criar nova solicitação de corrida
            return db.collection('rides').add({
                passengerId: currentUser.uid,
                passengerName: userData.name || 'Passageiro',
                passengerPhone: userData.phone || '',
                passengerPictureUrl: userData.profilePictureUrl || '',
                pickup: pickup,
                destination: destination,
                serviceType: serviceType,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                timeoutAt: new Date(Date.now() + 45 * 60 * 1000) // 45 minutos a partir de agora
            });
        })
        .then(docRef => {
            if (!docRef) return; // Caso hasActiveRide seja true
            
            console.log('Corrida solicitada com sucesso!');
            
            // Atualizar interface
            rideStatusContainer.classList.remove('hidden');
            statusMessage.textContent = 'Procurando mototaxistas próximos...';
            cancelRideButton.dataset.rideId = docRef.id;
            
            // Iniciar monitoramento da corrida
            startRideMonitoring(docRef.id);
        })
        .catch(error => {
            console.error('Erro ao solicitar corrida:', error);
            alert('Erro ao solicitar corrida: ' + error.message);
        });
});

cancelRideButton.addEventListener('click', () => {
    const rideId = cancelRideButton.dataset.rideId;
    
    if (!rideId) return;
    
    db.collection('rides').doc(rideId).update({
        status: 'cancelled',
        cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
        cancellationReason: 'Cancelado pelo passageiro'
    })
    .then(() => {
        console.log('Corrida cancelada com sucesso!');
        
        // Atualizar interface
        rideStatusContainer.classList.add('hidden');
        whatsappContactContainer.classList.add('hidden');
        
        // Parar monitoramento
        stopRideMonitoring();
    })
    .catch(error => {
        console.error('Erro ao cancelar corrida:', error);
        alert('Erro ao cancelar corrida: ' + error.message);
    });
});

// Eventos - Interface do Mototaxista
driverStatusSelect.addEventListener('change', () => {
    if (!currentUser) return;
    
    const status = driverStatusSelect.value;
    
    db.collection('users').doc(currentUser.uid).update({
        status: status
    })
    .then(() => {
        console.log('Status atualizado com sucesso!');
        
        if (status === 'available') {
            // Iniciar monitoramento de corridas pendentes
            startPendingRidesMonitoring();
        } else {
            // Parar monitoramento
            stopPendingRidesMonitoring();
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status: ' + error.message);
    });
});

completeRideButton.addEventListener('click', () => {
    if (!currentUser) return;
    
    // Verificar se o mototaxista tem uma corrida ativa
    db.collection('rides')
        .where('driverId', '==', currentUser.uid)
        .where('status', '==', 'accepted')
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                alert('Nenhuma corrida ativa encontrada.');
                return;
            }
            
            const rideDoc = querySnapshot.docs[0];
            const rideId = rideDoc.id;
            const rideData = rideDoc.data();
            
            // Finalizar corrida
            return db.collection('rides').doc(rideId).update({
                status: 'completed',
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                // Mostrar formulário de avaliação
                return ratingService.showRatingForm(
                    'passenger',
                    rideId,
                    rideData.passengerId,
                    rideData.passengerName,
                    rideData.passengerPictureUrl
                );
            });
        })
        .then(ratingResult => {
            if (!ratingResult || !ratingResult.submitted) return;
            
            // Salvar avaliação
            return ratingService.saveRating({
                rideId: ratingResult.rideId,
                rating: ratingResult.rating,
                comment: ratingResult.comment,
                ratingType: 'passenger',
                ratedBy: currentUser.uid,
                ratedByName: currentUserData.name,
                targetUserId: ratingResult.targetUserId
            });
        })
        .then(() => {
            console.log('Corrida finalizada com sucesso!');
            
            // Atualizar interface
            currentRideContainer.classList.add('hidden');
            whatsappContactDriverContainer.classList.add('hidden');
            
            // Reiniciar monitoramento de corridas pendentes
            if (driverStatusSelect.value === 'available') {
                startPendingRidesMonitoring();
            }
        })
        .catch(error => {
            console.error('Erro ao finalizar corrida:', error);
            alert('Erro ao finalizar corrida: ' + error.message);
        });
});

// Funções auxiliares
function displayNearbyDrivers(drivers) {
    if (!nearbyDriversContainer) return;
    
    nearbyDriversContainer.innerHTML = '';
    
    if (drivers.length === 0) {
        nearbyDriversContainer.innerHTML = '<p class="empty-message">Nenhum mototaxista disponível nas proximidades.</p>';
        return;
    }
    
    drivers.forEach(driver => {
        const driverCard = document.createElement('div');
        driverCard.className = 'driver-card';
        
        const distance = driver.distance.toFixed(1);
        const rating = driver.rating.toFixed(1);
        
        driverCard.innerHTML = `
            <div class="driver-info">
                <img src="${driver.profilePictureUrl || 'icons/default-profile.png'}" alt="Foto do mototaxista">
                <div class="driver-details">
                    <div class="driver-name">${driver.name}</div>
                    <div class="driver-rating">★ ${rating} (${driver.ratingCount || 0})</div>
                    <div class="driver-distance">${distance} km de distância</div>
                </div>
            </div>
        `;
        
        nearbyDriversContainer.appendChild(driverCard);
    });
}

function startRideMonitoring(rideId) {
    // Parar monitoramento anterior se existir
    stopRideMonitoring();
    
    // Monitorar status da corrida
    const unsubscribe = db.collection('rides').doc(rideId)
        .onSnapshot(doc => {
            if (!doc.exists) {
                console.error('Corrida não encontrada');
                return;
            }
            
            const rideData = doc.data();
            
            switch (rideData.status) {
                case 'pending':
                    statusMessage.textContent = 'Procurando mototaxistas próximos...';
                    break;
                    
                case 'accepted':
                    statusMessage.textContent = `Corrida aceita por ${rideData.driverName || 'Mototaxista'}. Aguarde no local de partida.`;
                    
                    // Mostrar contato do mototaxista
                    if (rideData.driverPhone) {
                        showWhatsAppContact(whatsappContactContainer, rideData.driverPhone, rideData.driverName || 'Mototaxista');
                    }
                    
                    // Mostrar formulário de avaliação quando a corrida for finalizada
                    const checkCompletionInterval = setInterval(() => {
                        db.collection('rides').doc(rideId).get()
                            .then(doc => {
                                if (!doc.exists) {
                                    clearInterval(checkCompletionInterval);
                                    return;
                                }
                                
                                const updatedRideData = doc.data();
                                
                                if (updatedRideData.status === 'completed') {
                                    clearInterval(checkCompletionInterval);
                                    
                                    // Mostrar formulário de avaliação
                                    ratingService.showRatingForm(
                                        'driver',
                                        rideId,
                                        updatedRideData.driverId,
                                        updatedRideData.driverName,
                                        updatedRideData.driverPictureUrl
                                    ).then(ratingResult => {
                                        if (!ratingResult || !ratingResult.submitted) return;
                                        
                                        // Salvar avaliação
                                        return ratingService.saveRating({
                                            rideId: rideId,
                                            rating: ratingResult.rating,
                                            comment: ratingResult.comment,
                                            ratingType: 'driver',
                                            ratedBy: currentUser.uid,
                                            ratedByName: currentUserData.name,
                                            targetUserId: updatedRideData.driverId
                                        });
                                    }).then(() => {
                                        // Atualizar interface
                                        rideStatusContainer.classList.add('hidden');
                                        whatsappContactContainer.classList.add('hidden');
                                    }).catch(error => {
                                        console.error('Erro ao processar avaliação:', error);
                                    });
                                }
                            });
                    }, 5000); // Verificar a cada 5 segundos
                    break;
                    
                case 'cancelled':
                    statusMessage.textContent = 'Corrida cancelada.';
                    
                    // Esconder após alguns segundos
                    setTimeout(() => {
                        rideStatusContainer.classList.add('hidden');
                    }, 5000);
                    break;
                    
                case 'completed':
                    statusMessage.textContent = 'Corrida finalizada.';
                    break;
            }
        }, error => {
            console.error('Erro ao monitorar corrida:', error);
        });
    
    // Verificar timeout da corrida
    timeoutCheckInterval = setInterval(() => {
        db.collection('rides').doc(rideId).get()
            .then(doc => {
                if (!doc.exists) {
                    clearInterval(timeoutCheckInterval);
                    return;
                }
                
                const rideData = doc.data();
                
                // Se a corrida ainda estiver pendente
                if (rideData.status === 'pending') {
                    const now = new Date();
                    const timeoutTime = rideData.timeout ? rideData.timeout.toDate() : new Date(0);
                    const timeDiff = (now - timeoutTime) / (1000 * 60); // diferença em minutos
                    
                    // Se passaram mais de 5 minutos, cancelar automaticamente
                    if (timeDiff > 5) {
                        db.collection('rides').doc(rideId).update({
                            status: 'cancelled',
                            cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                            cancellationReason: 'Cancelamento automático por timeout'
                        }).then(() => {
                            console.log('Corrida cancelada automaticamente por timeout');
                            clearInterval(timeoutCheckInterval);
                        });
                    }
                } else {
                    // Se a corrida não está mais pendente, parar verificação
                    clearInterval(timeoutCheckInterval);
                }
            });
    }, 30000); // Verificar a cada 30 segundos
}

function stopRideMonitoring() {
    if (rideCheckInterval) {
        clearInterval(rideCheckInterval);
        rideCheckInterval = null;
    }
    
    if (timeoutCheckInterval) {
        clearInterval(timeoutCheckInterval);
        timeoutCheckInterval = null;
    }
}

function startPendingRidesMonitoring() {
    // Parar monitoramento anterior se existir
    stopPendingRidesMonitoring();
    
    // Limpar lista de corridas
    if (ridesList) {
        ridesList.innerHTML = '<p class="loading-message">Carregando corridas disponíveis...</p>';
    }
    
    try {
        // Monitorar corridas pendentes
        const unsubscribe = db.collection('rides')
            .where('status', '==', 'pending')
            .onSnapshot(querySnapshot => {
                if (ridesList) {
                    ridesList.innerHTML = '';
                }
                
                if (querySnapshot.empty) {
                    if (ridesList) {
                        ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
                    }
                    return;
                }
                
                // Verificar corridas já recusadas pelo mototaxista
                db.collection('declinedRides')
                    .where('driverId', '==', currentUser.uid)
                    .get()
                    .then(declinedSnapshot => {
                        const declinedRideIds = new Set();
                        declinedSnapshot.forEach(doc => {
                            declinedRideIds.add(doc.data().rideId);
                        });
                        
                        // Filtrar corridas não recusadas
                        const availableRides = [];
                        querySnapshot.forEach(doc => {
                            if (!declinedRideIds.has(doc.id)) {
                                availableRides.push({
                                    id: doc.id,
                                    ...doc.data()
                                });
                            }
                        });
                        
                        if (availableRides.length === 0) {
                            if (ridesList) {
                                ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
                            }
                            return;
                        }
                        
                        // Ordenar por tempo (mais recentes primeiro)
                        availableRides.sort((a, b) => {
                            const timeA = a.createdAt ? a.createdAt.toDate() : new Date(0);
                            const timeB = b.createdAt ? b.createdAt.toDate() : new Date(0);
                            return timeB - timeA;
                        });
                        
                        // Exibir corridas disponíveis
                        availableRides.forEach(ride => {
                            displayRideItem(ride);
                        });
                    });
            }, error => {
                console.error('Erro ao monitorar corridas:', error);
                if (ridesList) {
                    ridesList.innerHTML = '<p class="error-message">Erro ao monitorar corridas, tente novamente.</p>';
                }
            });
    } catch (error) {
        console.error('Erro ao iniciar monitoramento de corridas:', error);
        if (ridesList) {
            ridesList.innerHTML = '<p class="error-message">Erro ao monitorar corridas, tente novamente.</p>';
        }
    }
}

function stopPendingRidesMonitoring() {
    // Implementação para parar o monitoramento
}

function displayRideItem(ride) {
    if (!ridesList) return;
    
    const rideItem = document.createElement('div');
    rideItem.className = 'ride-item';
    
    const time = ride.createdAt ? ride.createdAt.toDate().toLocaleTimeString('pt-BR') : 'Horário indisponível';
    
    rideItem.innerHTML = `
        <div class="ride-header">
            <div class="ride-passenger">${ride.passengerName || 'Passageiro'}</div>
            <div class="ride-time">${time}</div>
        </div>
        <div class="ride-locations">
            <p><strong>Partida:</strong> ${ride.pickup}</p>
            <p><strong>Destino:</strong> ${ride.destination}</p>
        </div>
        <div class="ride-buttons">
            <button class="primary-button accept-ride-button" data-ride-id="${ride.id}">Aceitar Corrida</button>
            <button class="secondary-button decline-ride-button" data-ride-id="${ride.id}">Recusar</button>
        </div>
    `;
    
    // Adicionar eventos aos botões
    const acceptButton = rideItem.querySelector('.accept-ride-button');
    const declineButton = rideItem.querySelector('.decline-ride-button');
    
    acceptButton.addEventListener('click', () => {
        acceptRide(ride.id);
    });
    
    declineButton.addEventListener('click', () => {
        declineRide(ride.id);
    });
    
    ridesList.appendChild(rideItem);
}

function acceptRide(rideId) {
    if (!currentUser || !currentUserData) return;
    
    db.collection('rides').doc(rideId).get()
        .then(doc => {
            if (!doc.exists) {
                alert('Corrida não encontrada ou já foi aceita por outro mototaxista.');
                return Promise.reject(new Error('Corrida não encontrada'));
            }
            
            const rideData = doc.data();
            
            if (rideData.status !== 'pending') {
                alert('Esta corrida já foi aceita por outro mototaxista ou foi cancelada.');
                return Promise.reject(new Error('Corrida não disponível'));
            }
            
            // Aceitar corrida
            return db.collection('rides').doc(rideId).update({
                status: 'accepted',
                driverId: currentUser.uid,
                driverName: currentUserData.name,
                driverPhone: currentUserData.phone,
                driverPictureUrl: currentUserData.profilePictureUrl || '',
                acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            console.log('Corrida aceita com sucesso!');
            
            // Parar monitoramento de corridas pendentes
            stopPendingRidesMonitoring();
            
            // Buscar dados atualizados da corrida
            return db.collection('rides').doc(rideId).get();
        })
        .then(doc => {
            if (!doc.exists) return;
            
            const rideData = doc.data();
            
            // Atualizar interface
            currentRideContainer.classList.remove('hidden');
            passengerNameElement.textContent = rideData.passengerName || 'Passageiro';
            ridePickupElement.textContent = rideData.pickup;
            rideDestinationElement.textContent = rideData.destination;
            
            // Mostrar contato do passageiro
            if (rideData.passengerPhone) {
                showWhatsAppContact(whatsappContactDriverContainer, rideData.passengerPhone, rideData.passengerName || 'Passageiro');
            }
        })
        .catch(error => {
            console.error('Erro ao aceitar corrida:', error);
            if (error.message !== 'Corrida não encontrada' && error.message !== 'Corrida não disponível') {
                alert('Erro ao aceitar corrida: ' + error.message);
            }
        });
}

function declineRide(rideId) {
    if (!currentUser) return;
    
    // Registrar recusa
    db.collection('declinedRides').add({
        rideId: rideId,
        driverId: currentUser.uid,
        declinedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log('Corrida recusada com sucesso!');
        
        // Remover da lista
        const rideItem = document.querySelector(`.ride-item .decline-ride-button[data-ride-id="${rideId}"]`).closest('.ride-item');
        if (rideItem && rideItem.parentNode) {
            rideItem.parentNode.removeChild(rideItem);
        }
        
        // Verificar se a lista ficou vazia
        if (ridesList && ridesList.children.length === 0) {
            ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao recusar corrida:', error);
        alert('Erro ao recusar corrida: ' + error.message);
    });
}

function showWhatsAppContact(container, phone, name) {
    if (!container) return;
    
    // Limpar número de telefone (remover caracteres não numéricos)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verificar se o número tem DDD
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 9 || cleanPhone.length === 8) {
        // Adicionar DDD padrão se não tiver
        formattedPhone = '11' + cleanPhone;
    }
    
    // Criar link do WhatsApp
    const whatsappLink = `https://wa.me/55${formattedPhone}`;
    
    container.innerHTML = `
        <p>Entre em contato via WhatsApp:</p>
        <a href="${whatsappLink}" target="_blank" class="whatsapp-button">
            <img src="icons/whatsapp.png" alt="WhatsApp">
            Contatar ${name}
        </a>
    `;
    
    container.classList.remove('hidden');
}

function loadRideHistory(accountType) {
    if (!rideHistoryContainer || !currentUser) return;
    
    rideHistoryContainer.innerHTML = '<p class="loading-message">Carregando histórico...</p>';
    
    let query;
    
    if (accountType === 'user') {
        query = db.collection('rides')
            .where('passengerId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(10);
    } else {
        query = db.collection('rides')
            .where('driverId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(10);
    }
    
    query.get()
        .then(querySnapshot => {
            rideHistoryContainer.innerHTML = '';
            
            if (querySnapshot.empty) {
                rideHistoryContainer.innerHTML = '<p class="empty-message">Nenhuma viagem encontrada no histórico.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const ride = doc.data();
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const date = ride.createdAt ? ride.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data indisponível';
                const time = ride.createdAt ? ride.createdAt.toDate().toLocaleTimeString('pt-BR') : '';
                
                let statusText = 'Pendente';
                let statusClass = '';
                
                if (ride.status === 'completed') {
                    statusText = 'Finalizada';
                    statusClass = 'status-completed';
                } else if (ride.status === 'cancelled') {
                    statusText = 'Cancelada';
                    statusClass = 'status-cancelled';
                } else if (ride.status === 'accepted') {
                    statusText = 'Em andamento';
                }
                
                const otherPersonName = accountType === 'user' ? (ride.driverName || 'Mototaxista') : (ride.passengerName || 'Passageiro');
                
                historyItem.innerHTML = `
                    <div class="history-header">
                        <div class="history-date">${date} às ${time}</div>
                        <div class="history-status ${statusClass}">${statusText}</div>
                    </div>
                    <div class="history-details">
                        <p><strong>${accountType === 'user' ? 'Mototaxista' : 'Passageiro'}:</strong> ${otherPersonName}</p>
                        <p><strong>Partida:</strong> ${ride.pickup}</p>
                        <p><strong>Destino:</strong> ${ride.destination}</p>
                    </div>
                `;
                
                // Adicionar avaliação se disponível
                if (ride.status === 'completed') {
                    const ratingField = accountType === 'user' ? 'driverRating' : 'passengerRating';
                    if (ride[ratingField]) {
                        const ratingDiv = document.createElement('div');
                        ratingDiv.className = 'history-rating';
                        
                        const stars = '★'.repeat(ride[ratingField]) + '☆'.repeat(5 - ride[ratingField]);
                        
                        ratingDiv.innerHTML = `
                            <span>Avaliação:</span>
                            <span class="rating-stars">${stars}</span>
                        `;
                        
                        historyItem.appendChild(ratingDiv);
                    }
                }
                
                rideHistoryContainer.appendChild(historyItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar histórico:', error);
            rideHistoryContainer.innerHTML = '<p class="error-message">Erro ao carregar histórico.</p>';
        });
}

// Observador de autenticação
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        
        // Buscar dados do usuário
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    currentUserData = doc.data();
                    
                    // Atualizar interface
                    authSection.classList.add('hidden');
                    appSection.classList.remove('hidden');
                    
                    userNameElement.textContent = currentUserData.name || 'Usuário';
                    
                    if (currentUserData.profilePictureUrl) {
                        userProfilePicture.src = currentUserData.profilePictureUrl;
                        profilePicturePreview.src = currentUserData.profilePictureUrl;
                    }
                    
                    // Preencher campos do perfil
                    profileNameInput.value = currentUserData.name || '';
                    profilePhoneInput.value = currentUserData.phone || '';
                    
                    // Exibir interface baseada no tipo de conta
                    if (currentUserData.accountType === 'user') {
                        passengerInterface.classList.remove('hidden');
                        driverInterface.classList.add('hidden');
                    } else {
                        driverInterface.classList.remove('hidden');
                        passengerInterface.classList.add('hidden');
                        
                        // Definir status inicial
                        driverStatusSelect.value = currentUserData.status || 'unavailable';
                        
                        // Verificar se há corrida ativa
                        db.collection('rides')
                            .where('driverId', '==', user.uid)
                            .where('status', '==', 'accepted')
                            .get()
                            .then(querySnapshot => {
                                if (!querySnapshot.empty) {
                                    const rideDoc = querySnapshot.docs[0];
                                    const rideData = rideDoc.data();
                                    
                                    // Atualizar interface
                                    currentRideContainer.classList.remove('hidden');
                                    passengerNameElement.textContent = rideData.passengerName || 'Passageiro';
                                    ridePickupElement.textContent = rideData.pickup;
                                    rideDestinationElement.textContent = rideData.destination;
                                    
                                    // Mostrar contato do passageiro
                                    if (rideData.passengerPhone) {
                                        showWhatsAppContact(whatsappContactDriverContainer, rideData.passengerPhone, rideData.passengerName || 'Passageiro');
                                    }
                                } else if (currentUserData.status === 'available') {
                                    // Iniciar monitoramento de corridas pendentes
                                    startPendingRidesMonitoring();
                                }
                            });
                    }
                    
                    // Verificar se há corrida ativa para passageiro
                    if (currentUserData.accountType === 'user') {
                        db.collection('rides')
                            .where('passengerId', '==', user.uid)
                            .where('status', 'in', ['pending', 'accepted'])
                            .get()
                            .then(querySnapshot => {
                                if (!querySnapshot.empty) {
                                    const rideDoc = querySnapshot.docs[0];
                                    const rideId = rideDoc.id;
                                    const rideData = rideDoc.data();
                                    
                                    // Verificar se a corrida é antiga (mais de 1 hora)
                                    const now = new Date();
                                    const rideTime = rideData.createdAt ? rideData.createdAt.toDate() : new Date(0);
                                    const timeDiff = (now - rideTime) / (1000 * 60); // diferença em minutos
                                    
                                    if (timeDiff > 60) {
                                        // Corrida antiga, cancelar automaticamente
                                        return db.collection('rides').doc(rideId).update({
                                            status: 'cancelled',
                                            cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                                            cancellationReason: 'Cancelamento automático por timeout'
                                        });
                                    } else {
                                        // Atualizar interface
                                        rideStatusContainer.classList.remove('hidden');
                                        cancelRideButton.dataset.rideId = rideId;
                                        
                                        if (rideData.status === 'pending') {
                                            statusMessage.textContent = 'Procurando mototaxistas próximos...';
                                        } else if (rideData.status === 'accepted') {
                                            statusMessage.textContent = `Corrida aceita por ${rideData.driverName || 'Mototaxista'}. Aguarde no local de partida.`;
                                            
                                            // Mostrar contato do mototaxista
                                            if (rideData.driverPhone) {
                                                showWhatsAppContact(whatsappContactContainer, rideData.driverPhone, rideData.driverName || 'Mototaxista');
                                            }
                                        }
                                        
                                        // Iniciar monitoramento
                                        startRideMonitoring(rideId);
                                    }
                                }
                            });
                    }
                    
                    // Exibir avaliação média do usuário
                    const userRatingContainer = document.getElementById('user-rating');
                    if (userRatingContainer && ratingService) {
                        ratingService.displayUserAverageRating(user.uid, userRatingContainer);
                    }
                } else {
                    console.error('Documento do usuário não encontrado');
                    alert('Erro ao carregar dados do usuário. Por favor, faça login novamente.');
                    auth.signOut();
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
                alert('Erro ao carregar dados do usuário: ' + error.message);
            });
    } else {
        currentUser = null;
        currentUserData = null;
        
        // Atualizar interface
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        
        // Limpar campos
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('register-name').value = '';
        document.getElementById('register-phone').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        
        // Parar monitoramentos
        stopRideMonitoring();
        stopPendingRidesMonitoring();
        
        // Limpar localização
        if (watchLocationId !== null) {
            geoService.stopWatching(watchLocationId);
            watchLocationId = null;
        }
    }
});

// Limpar corridas antigas ao iniciar
db.collection('rides')
    .where('status', '==', 'pending')
    .get()
    .then(querySnapshot => {
        const batch = db.batch();
        const now = new Date();
        
        querySnapshot.forEach(doc => {
            const rideData = doc.data();
            const rideTime = rideData.createdAt ? rideData.createdAt.toDate() : new Date(0);
            const timeDiff = (now - rideTime) / (1000 * 60); // diferença em minutos
            
            if (timeDiff > 60) {
                batch.update(doc.ref, {
                    status: 'cancelled',
                    cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                    cancellationReason: 'Cancelamento automático por timeout'
                });
            }
        });
        
        return batch.commit();
    })
    .catch(error => {
        console.error('Erro ao limpar corridas antigas:', error);
    });

// Eventos de Navegação
navMain.addEventListener('click', () => {
    showSection('main');
});

navProfile.addEventListener('click', () => {
    showSection('profile');
    loadUserProfile();
});

navHistory.addEventListener('click', () => {
    showSection('history');
    loadUserHistory();
});

navSuggestions.addEventListener('click', () => {
    showSection('suggestions');
    loadUserSuggestions();
});

navAdmin.addEventListener('click', () => {
    showSection('admin');
    loadAdminData();
});

navPricing.addEventListener('click', () => {
    showSection('pricing');
    loadPricingTable();
});

navPayments.addEventListener('click', () => {
    showSection('payments');
    loadPaymentHistory();
});

// Função para mostrar seções
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Remover classe active de todos os botões de navegação
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    
    // Mostrar a seção correspondente
    switch(sectionName) {
        case 'main':
            if (currentUserData && currentUserData.accountType === 'user') {
                passengerInterface.classList.remove('hidden');
            } else if (currentUserData && currentUserData.accountType === 'driver') {
                driverInterface.classList.remove('hidden');
            }
            navMain.classList.add('active');
            break;
        case 'profile':
            profileSection.classList.remove('hidden');
            navProfile.classList.add('active');
            break;
        case 'history':
            historySection.classList.remove('hidden');
            navHistory.classList.add('active');
            break;
        case 'suggestions':
            suggestionsSection.classList.remove('hidden');
            navSuggestions.classList.add('active');
            break;
        case 'admin':
            adminSection.classList.remove('hidden');
            navAdmin.classList.add('active');
            break;
        case 'pricing':
            pricingSection.classList.remove('hidden');
            navPricing.classList.add('active');
            break;
        case 'payments':
            paymentsSection.classList.remove('hidden');
            navPayments.classList.add('active');
            break;
    }
}

// Função para carregar perfil do usuário
function loadUserProfile() {
    if (!currentUser) return;
    
    db.collection('users').doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                profileNameInput.value = userData.name || '';
                profilePhoneInput.value = userData.phone || '';
                
                if (userData.profilePictureUrl) {
                    profilePicturePreview.src = userData.profilePictureUrl;
                    userProfilePicture.src = userData.profilePictureUrl;
                }
            }
        })
        .catch(error => {
            console.error('Erro ao carregar perfil:', error);
        });
}

// Função para carregar histórico do usuário
function loadUserHistory() {
    if (!currentUser) return;
    
    // Carregar histórico de corridas
    db.collection('rides')
        .where('passengerId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(querySnapshot => {
            rideHistoryContainer.innerHTML = '';
            
            if (querySnapshot.empty) {
                rideHistoryContainer.innerHTML = '<p class="empty-message">Nenhuma corrida encontrada.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const ride = doc.data();
                const rideElement = createRideHistoryElement(ride);
                rideHistoryContainer.appendChild(rideElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar histórico:', error);
            rideHistoryContainer.innerHTML = '<p class="error-message">Erro ao carregar histórico.</p>';
        });
    
    // Carregar histórico de avaliações
    ratingService.getUserRatings(currentUser.uid)
        .then(ratings => {
            userRatingsHistory.innerHTML = '';
            
            if (ratings.length === 0) {
                userRatingsHistory.innerHTML = '<p class="empty-message">Nenhuma avaliação encontrada.</p>';
                return;
            }
            
            ratings.forEach(rating => {
                const ratingElement = createRatingHistoryElement(rating);
                userRatingsHistory.appendChild(ratingElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar avaliações:', error);
            userRatingsHistory.innerHTML = '<p class="error-message">Erro ao carregar avaliações.</p>';
        });
}

// Função para carregar sugestões do usuário
function loadUserSuggestions() {
    if (!currentUser) return;
    
    db.collection('suggestions')
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
            suggestionsList.innerHTML = '';
            
            if (querySnapshot.empty) {
                suggestionsList.innerHTML = '<p class="empty-message">Nenhuma sugestão enviada.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const suggestion = doc.data();
                const suggestionElement = createSuggestionElement(suggestion);
                suggestionsList.appendChild(suggestionElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar sugestões:', error);
            suggestionsList.innerHTML = '<p class="error-message">Erro ao carregar sugestões.</p>';
        });
}

// Função para carregar dados do admin
function loadAdminData() {
    if (!currentUserData || currentUserData.accountType !== 'admin') return;
    
    // Carregar estatísticas
    Promise.all([
        db.collection('users').get(),
        db.collection('rides').get(),
        db.collection('suggestions').get(),
        db.collection('ratings').get()
    ]).then(([usersSnapshot, ridesSnapshot, suggestionsSnapshot, ratingsSnapshot]) => {
        totalUsersElement.textContent = usersSnapshot.size;
        totalRidesElement.textContent = ridesSnapshot.size;
        totalSuggestionsElement.textContent = suggestionsSnapshot.size;
        totalRatingsElement.textContent = ratingsSnapshot.size;
    }).catch(error => {
        console.error('Erro ao carregar estatísticas:', error);
    });
    
    // Carregar usuários para gestão
    loadUsersManagement();
    
    // Carregar sugestões para admin
    loadAdminSuggestions();
    
    // Carregar avaliações para admin
    loadAdminRatings();
}

// Função para carregar gestão de usuários
function loadUsersManagement() {
    db.collection('users')
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
            usersManagement.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const user = doc.data();
                const userElement = createUserManagementElement(doc.id, user);
                usersManagement.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            usersManagement.innerHTML = '<p class="error-message">Erro ao carregar usuários.</p>';
        });
}

// Função para carregar sugestões do admin
function loadAdminSuggestions() {
    db.collection('suggestions')
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
            adminSuggestions.innerHTML = '';
            
            if (querySnapshot.empty) {
                adminSuggestions.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const suggestion = doc.data();
                const suggestionElement = createAdminSuggestionElement(suggestion);
                adminSuggestions.appendChild(suggestionElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar sugestões:', error);
            adminSuggestions.innerHTML = '<p class="error-message">Erro ao carregar sugestões.</p>';
        });
}

// Função para carregar avaliações do admin
function loadAdminRatings() {
    db.collection('ratings')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get()
        .then(querySnapshot => {
            adminRatings.innerHTML = '';
            
            if (querySnapshot.empty) {
                adminRatings.innerHTML = '<p class="empty-message">Nenhuma avaliação encontrada.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const rating = doc.data();
                const ratingElement = createAdminRatingElement(rating);
                adminRatings.appendChild(ratingElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar avaliações:', error);
            adminRatings.innerHTML = '<p class="error-message">Erro ao carregar avaliações.</p>';
        });
}

// Função para carregar tabela de preços
function loadPricingTable() {
    db.collection('settings').doc('pricing').get()
        .then(doc => {
            if (doc.exists && doc.data().imageUrl) {
                pricingContent.innerHTML = `<img src="${doc.data().imageUrl}" alt="Tabela de Preços" class="pricing-image">`;
            } else {
                pricingContent.innerHTML = '<p class="empty-message">Tabela de preços não disponível.</p>';
            }
            
            // Mostrar área de admin se for administrador
            if (currentUserData && currentUserData.accountType === 'admin') {
                pricingAdmin.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar tabela de preços:', error);
            pricingContent.innerHTML = '<p class="error-message">Erro ao carregar tabela de preços.</p>';
        });
}

// Função para carregar histórico de pagamentos
function loadPaymentHistory() {
    if (!currentUser || currentUserData.accountType !== 'driver') return;
    
    // Verificar status do pagamento atual
    db.collection('payments')
        .where('driverId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                const lastPayment = querySnapshot.docs[0].data();
                const now = new Date();
                const paymentDate = lastPayment.createdAt.toDate();
                const daysDiff = (now - paymentDate) / (1000 * 60 * 60 * 24);
                
                if (daysDiff <= 7 && lastPayment.status === 'paid') {
                    paymentStatus.textContent = 'Pagamento em dia';
                    paymentStatus.style.color = '#28a745';
                } else {
                    paymentStatus.textContent = 'Pagamento pendente';
                    paymentStatus.style.color = '#dc3545';
                }
            } else {
                paymentStatus.textContent = 'Nenhum pagamento registrado';
                paymentStatus.style.color = '#ffc107';
            }
        });
    
    // Carregar histórico completo
    db.collection('payments')
        .where('driverId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
            paymentHistoryList.innerHTML = '';
            
            if (querySnapshot.empty) {
                paymentHistoryList.innerHTML = '<p class="empty-message">Nenhum pagamento encontrado.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const payment = doc.data();
                const paymentElement = createPaymentHistoryElement(payment);
                paymentHistoryList.appendChild(paymentElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar histórico de pagamentos:', error);
            paymentHistoryList.innerHTML = '<p class="error-message">Erro ao carregar histórico.</p>';
        });
}

// Evento para enviar sugestão
submitSuggestionButton.addEventListener('click', () => {
    if (!currentUser) return;
    
    const title = suggestionTitleInput.value.trim();
    const text = suggestionTextInput.value.trim();
    const type = suggestionTypeSelect.value;
    
    if (!title || !text) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    db.collection('suggestions').add({
        userId: currentUser.uid,
        userName: currentUserData.name || 'Usuário',
        title: title,
        text: text,
        type: type,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('Sugestão enviada com sucesso!');
        suggestionTitleInput.value = '';
        suggestionTextInput.value = '';
        suggestionTypeSelect.value = 'improvement';
        loadUserSuggestions();
    })
    .catch(error => {
        console.error('Erro ao enviar sugestão:', error);
        alert('Erro ao enviar sugestão: ' + error.message);
    });
});

// Evento para upload de tabela de preços
uploadPricingButton.addEventListener('click', () => {
    if (!currentUserData || currentUserData.accountType !== 'admin') return;
    
    const file = pricingImageInput.files[0];
    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }
    
    const storageRef = storage.ref();
    const pricingRef = storageRef.child('pricing/pricing-table.jpg');
    
    pricingRef.put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(downloadURL => {
            return db.collection('settings').doc('pricing').set({
                imageUrl: downloadURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: currentUser.uid
            });
        })
        .then(() => {
            alert('Tabela de preços atualizada com sucesso!');
            loadPricingTable();
        })
        .catch(error => {
            console.error('Erro ao atualizar tabela de preços:', error);
            alert('Erro ao atualizar tabela de preços: ' + error.message);
        });
});

// Função para exibir mototaxistas próximos
function displayNearbyDrivers(drivers) {
    driversListContainer.innerHTML = '';
    
    if (drivers.length === 0) {
        driversListContainer.innerHTML = '<p class="empty-message">Nenhum mototaxista disponível no momento.</p>';
        return;
    }
    
    drivers.forEach(driver => {
        const driverElement = createDriverElement(driver);
        driversListContainer.appendChild(driverElement);
    });
}

// Função para criar elemento de mototaxista
function createDriverElement(driver) {
    const driverDiv = document.createElement('div');
    driverDiv.className = 'driver-item';
    driverDiv.innerHTML = `
        <img src="${driver.profilePictureUrl || 'icons/default-profile.png'}" alt="Foto do mototaxista" class="driver-avatar">
        <div class="driver-info">
            <h4 class="driver-name">${driver.name}</h4>
            <div class="driver-rating">
                <span class="rating-stars">${'★'.repeat(Math.floor(driver.rating))}</span>
                <span>${driver.rating.toFixed(1)} (${driver.ratingCount} avaliações)</span>
            </div>
        </div>
        <div class="driver-distance">${driver.distance.toFixed(1)} km</div>
    `;
    
    return driverDiv;
}

// Função para criar elemento de histórico de corrida
function createRideHistoryElement(ride) {
    const rideDiv = document.createElement('div');
    rideDiv.className = 'ride-history-item';
    
    const date = ride.createdAt ? ride.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível';
    const status = ride.status === 'completed' ? 'Concluída' : 
                  ride.status === 'cancelled' ? 'Cancelada' : 'Pendente';
    
    rideDiv.innerHTML = `
        <div class="ride-info">
            <h4>Corrida - ${date}</h4>
            <p><strong>De:</strong> ${ride.pickup}</p>
            <p><strong>Para:</strong> ${ride.destination}</p>
            <p><strong>Tipo:</strong> ${ride.serviceType === 'passenger' ? 'Passageiro' : 'Entrega'}</p>
            <p><strong>Status:</strong> <span class="status-${ride.status}">${status}</span></p>
        </div>
    `;
    
    return rideDiv;
}

// Função para criar elemento de histórico de avaliação
function createRatingHistoryElement(rating) {
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating-history-item';
    
    const date = rating.createdAt ? rating.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível';
    
    ratingDiv.innerHTML = `
        <div class="rating-info">
            <h4>Avaliação - ${date}</h4>
            <div class="rating-stars">${'★'.repeat(rating.rating)}</div>
            <p>${rating.comment || 'Sem comentário'}</p>
        </div>
    `;
    
    return ratingDiv;
}

// Função para criar elemento de sugestão
function createSuggestionElement(suggestion) {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'suggestion-item';
    
    const date = suggestion.createdAt ? suggestion.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível';
    const status = suggestion.status === 'pending' ? 'Pendente' : 
                  suggestion.status === 'reviewed' ? 'Analisada' : 'Implementada';
    
    suggestionDiv.innerHTML = `
        <div class="suggestion-info">
            <h4>${suggestion.title}</h4>
            <p>${suggestion.text}</p>
            <p><strong>Tipo:</strong> ${suggestion.type}</p>
            <p><strong>Status:</strong> <span class="status-${suggestion.status}">${status}</span></p>
            <p><strong>Data:</strong> ${date}</p>
        </div>
    `;
    
    return suggestionDiv;
}

// Função para criar elemento de gestão de usuário
function createUserManagementElement(userId, user) {
    const userDiv = document.createElement('div');
    userDiv.className = 'user-item';
    
    const isBlocked = user.status === 'blocked';
    const accountTypeText = user.accountType === 'driver' ? 'Mototaxista' : 
                           user.accountType === 'admin' ? 'Administrador' : 'Passageiro';
    
    userDiv.innerHTML = `
        <div class="user-info">
            <h4>${user.name}</h4>
            <p>Email: ${user.email}</p>
            <p>Telefone: ${user.phone}</p>
            <p>Tipo: ${accountTypeText}</p>
            <p>Status: ${isBlocked ? 'Bloqueado' : 'Ativo'}</p>
        </div>
        <div class="user-actions">
            <button class="${isBlocked ? 'unblock-button' : 'block-button'}" onclick="toggleUserStatus('${userId}', ${isBlocked})">
                ${isBlocked ? 'Desbloquear' : 'Bloquear'}
            </button>
        </div>
    `;
    
    return userDiv;
}

// Função para criar elemento de sugestão do admin
function createAdminSuggestionElement(suggestion) {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'admin-suggestion-item';
    
    const date = suggestion.createdAt ? suggestion.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível';
    
    suggestionDiv.innerHTML = `
        <div class="suggestion-info">
            <h4>${suggestion.title}</h4>
            <p><strong>Usuário:</strong> ${suggestion.userName}</p>
            <p>${suggestion.text}</p>
            <p><strong>Tipo:</strong> ${suggestion.type}</p>
            <p><strong>Data:</strong> ${date}</p>
        </div>
    `;
    
    return suggestionDiv;
}

// Função para criar elemento de avaliação do admin
function createAdminRatingElement(rating) {
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'admin-rating-item';
    
    const date = rating.createdAt ? rating.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível';
    
    ratingDiv.innerHTML = `
        <div class="rating-info">
            <h4>Avaliação ${rating.rating}/5</h4>
            <div class="rating-stars">${'★'.repeat(rating.rating)}</div>
            <p>${rating.comment || 'Sem comentário'}</p>
            <p><strong>Data:</strong> ${date}</p>
        </div>
    `;
    
    return ratingDiv;
}

// Função para criar elemento de histórico de pagamento
function createPaymentHistoryElement(payment) {
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'payment-item';
    
    const date = payment.createdAt ? payment.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data não disponível';
    const statusText = payment.status === 'paid' ? 'Pago' : 
                      payment.status === 'pending' ? 'Pendente' : 'Vencido';
    
    paymentDiv.innerHTML = `
        <div class="payment-date">${date}</div>
        <div class="payment-amount">R$ ${payment.amount.toFixed(2)}</div>
        <div class="payment-status-badge payment-status-${payment.status}">${statusText}</div>
    `;
    
    return paymentDiv;
}

// Função para alternar status do usuário (bloquear/desbloquear)
function toggleUserStatus(userId, isCurrentlyBlocked) {
    const newStatus = isCurrentlyBlocked ? 'active' : 'blocked';
    
    db.collection('users').doc(userId).update({
        status: newStatus,
        statusUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        statusUpdatedBy: currentUser.uid
    })
    .then(() => {
        alert(`Usuário ${isCurrentlyBlocked ? 'desbloqueado' : 'bloqueado'} com sucesso!`);
        loadUsersManagement();
    })
    .catch(error => {
        console.error('Erro ao alterar status do usuário:', error);
        alert('Erro ao alterar status do usuário: ' + error.message);
    });
}

// Função para verificar e cancelar corridas expiradas automaticamente
function checkExpiredRides() {
    const now = new Date();
    
    db.collection('rides')
        .where('status', 'in', ['pending', 'accepted'])
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const ride = doc.data();
                const rideTime = ride.createdAt ? ride.createdAt.toDate() : new Date(0);
                const timeDiff = (now - rideTime) / (1000 * 60); // diferença em minutos
                
                if (timeDiff > 45) {
                    // Cancelar corrida expirada
                    db.collection('rides').doc(doc.id).update({
                        status: 'cancelled',
                        cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                        cancellationReason: 'Cancelamento automático por timeout (45 minutos)'
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erro ao verificar corridas expiradas:', error);
        });
}

// Iniciar verificação de corridas expiradas a cada 5 minutos
setInterval(checkExpiredRides, 5 * 60 * 1000);


// Monitoramento de autenticação do Firebase
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        
        // Carregar dados do usuário
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    currentUserData = doc.data();
                    
                    // Atualizar interface
                    userNameElement.textContent = currentUserData.name || 'Usuário';
                    
                    if (currentUserData.profilePictureUrl) {
                        userProfilePicture.src = currentUserData.profilePictureUrl;
                    }
                    
                    // Mostrar seção do app e esconder autenticação
                    authSection.classList.add('hidden');
                    appSection.classList.remove('hidden');
                    
                    // Configurar interface baseada no tipo de usuário
                    if (currentUserData.accountType === 'admin') {
                        navAdmin.classList.remove('hidden');
                        // Criar usuário admin se não existir
                        if (!currentUserData.isAdminSetup) {
                            setupAdminUser();
                        }
                    }
                    
                    if (currentUserData.accountType === 'driver') {
                        navPayments.classList.remove('hidden');
                    }
                    
                    // Mostrar interface apropriada
                    if (currentUserData.accountType === 'user') {
                        passengerInterface.classList.remove('hidden');
                    } else if (currentUserData.accountType === 'driver') {
                        driverInterface.classList.remove('hidden');
                    }
                    
                    // Carregar avaliação do usuário
                    ratingService.loadUserRating(user.uid);
                    
                } else {
                    console.error('Dados do usuário não encontrados');
                    auth.signOut();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar dados do usuário:', error);
                auth.signOut();
            });
    } else {
        // Usuário não autenticado
        currentUser = null;
        currentUserData = null;
        
        // Mostrar seção de autenticação e esconder app
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        
        // Limpar dados da interface
        userNameElement.textContent = 'Usuário';
        userProfilePicture.src = 'icons/default-profile.png';
        
        // Esconder botões específicos
        navAdmin.classList.add('hidden');
        navPayments.classList.add('hidden');
        
        // Parar monitoramentos
        if (rideCheckInterval) {
            clearInterval(rideCheckInterval);
            rideCheckInterval = null;
        }
        
        if (timeoutCheckInterval) {
            clearInterval(timeoutCheckInterval);
            timeoutCheckInterval = null;
        }
        
        if (watchLocationId) {
            geoService.stopWatching(watchLocationId);
            watchLocationId = null;
        }
    }
});

// Função para configurar usuário administrador
function setupAdminUser() {
    // Verificar se já existe um admin
    db.collection('users')
        .where('accountType', '==', 'admin')
        .where('isAdminSetup', '==', true)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                // Primeiro admin do sistema
                db.collection('users').doc(currentUser.uid).update({
                    accountType: 'admin',
                    isAdminSetup: true,
                    adminSetupAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    console.log('Usuário configurado como administrador principal');
                    currentUserData.accountType = 'admin';
                    currentUserData.isAdminSetup = true;
                    navAdmin.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Erro ao configurar administrador:', error);
                });
            }
        });
}

// Aplicar tema salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
}


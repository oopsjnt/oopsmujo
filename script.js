// Configuração do Firebase
// IMPORTANTE: Substitua este objeto pelo seu próprio firebaseConfig que você copiou do console do Firebase
const firebaseConfig = {
   apiKey: "AIzaSyDcTmNZM7mgYT7PcuSFuByb2T6fw3gf0j4",
  authDomain: "oopsmujo.firebaseapp.com",
  projectId: "oopsmujo",
  storageBucket: "oopsmujo.firebasestorage.app",
  messagingSenderId: "1032028058233",
  appId: "1:1032028058233:web:6c9af952d2da504f465aa8"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referências aos serviços do Firebase
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;
let rideStatusListener = null;
let pendingRidesListener = null;

// Elementos DOM - Login e Registro
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const logoutButton = document.getElementById('logout-button');

// Elementos DOM - Interface do Usuário
const userName = document.getElementById('user-name');
const passengerInterface = document.getElementById('passenger-interface');
const driverInterface = document.getElementById('driver-interface');
const requestRideButton = document.getElementById('request-ride-button');
const rideStatus = document.getElementById('ride-status');
const statusMessage = document.getElementById('status-message');
const driverStatus = document.getElementById('driver-status');
const ridesList = document.getElementById('rides-list');
const currentRide = document.getElementById('current-ride');
const completeRideButton = document.getElementById('complete-ride-button');

// Alternar entre as abas de login e cadastro
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

// Função para mostrar mensagem de erro
function showError(message) {
    alert(message);
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    alert(message);
}

// Função para limpar corridas antigas ou pendentes
function cleanupOldRides() {
    // Obter data de 24 horas atrás
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Converter para timestamp do Firestore
    const oneDayAgoTimestamp = firebase.firestore.Timestamp.fromDate(oneDayAgo);
    
    // Buscar corridas antigas pendentes
    db.collection('rides')
        .where('status', 'in', ['pending', 'accepted'])
        .where('createdAt', '<', oneDayAgoTimestamp)
        .get()
        .then((querySnapshot) => {
            // Batch para atualizar várias corridas de uma vez
            const batch = db.batch();
            
            querySnapshot.forEach((doc) => {
                // Marcar corridas antigas como canceladas
                batch.update(doc.ref, {
                    status: 'cancelled',
                    cancelReason: 'Cancelada automaticamente por inatividade',
                    cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            // Executar o batch
            return batch.commit();
        })
        .then(() => {
            console.log('Limpeza de corridas antigas concluída');
        })
        .catch((error) => {
            console.error('Erro ao limpar corridas antigas:', error);
        });
}

// Limpar corridas antigas ao iniciar o app
cleanupOldRides();

// Função para fazer login
loginButton.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            showSuccess('Login realizado com sucesso!');
            // O listener de estado de autenticação cuidará do resto
        })
        .catch((error) => {
            console.error('Erro no login:', error);
            showError('Erro no login: ' + error.message);
        });
});

// Função para cadastrar novo usuário
registerButton.addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const accountType = document.querySelector('input[name="account-type"]:checked').value;
    
    if (!name || !phone || !email || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }
    
    // Criar usuário no Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Cadastro bem-sucedido, agora vamos salvar os dados adicionais no Firestore
            const user = userCredential.user;
            
            return db.collection('users').doc(user.uid).set({
                name: name,
                phone: phone,
                email: email,
                accountType: accountType,
                status: accountType === 'driver' ? 'available' : null, // Definir status inicial para mototaxistas
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            showSuccess('Cadastro realizado com sucesso!');
            // O listener de estado de autenticação cuidará do resto
        })
        .catch((error) => {
            console.error('Erro no cadastro:', error);
            showError('Erro no cadastro: ' + error.message);
        });
});

// Função para fazer logout
logoutButton.addEventListener('click', () => {
    // Remover listeners ativos antes de fazer logout
    removeAllListeners();
    
    auth.signOut()
        .then(() => {
            showSuccess('Logout realizado com sucesso!');
            // O listener de estado de autenticação cuidará do resto
        })
        .catch((error) => {
            console.error('Erro no logout:', error);
            showError('Erro no logout: ' + error.message);
        });
});

// Função para remover todos os listeners ativos
function removeAllListeners() {
    if (rideStatusListener) {
        rideStatusListener();
        rideStatusListener = null;
    }
    
    if (pendingRidesListener) {
        pendingRidesListener();
        pendingRidesListener = null;
    }
}

// Listener para mudanças no estado de autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Usuário está logado
        currentUser = user;
        
        // Buscar dados adicionais do usuário no Firestore
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                
                // Atualizar a interface com o nome do usuário
                userName.textContent = userData.name;
                
                // Mostrar a interface apropriada com base no tipo de conta
                authSection.classList.add('hidden');
                appSection.classList.remove('hidden');
                
                if (userData.accountType === 'user') {
                    // Interface de passageiro
                    passengerInterface.classList.remove('hidden');
                    driverInterface.classList.add('hidden');
                    setupPassengerInterface(userData);
                } else {
                    // Interface de mototaxista
                    driverInterface.classList.remove('hidden');
                    passengerInterface.classList.add('hidden');
                    setupDriverInterface(userData);
                }
            } else {
                console.error('Documento do usuário não encontrado no Firestore');
                showError('Erro ao carregar dados do usuário. Por favor, faça login novamente.');
                auth.signOut();
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            showError('Erro ao carregar dados do usuário: ' + error.message);
        }
    } else {
        // Usuário não está logado
        currentUser = null;
        
        // Remover listeners ativos
        removeAllListeners();
        
        // Mostrar a interface de autenticação
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        
        // Limpar campos de formulário
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('register-name').value = '';
        document.getElementById('register-phone').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
    }
});

// Configurar a interface do passageiro
function setupPassengerInterface(userData) {
    // Esconder o status da corrida inicialmente
    rideStatus.classList.add('hidden');
    
    // Verificar se o passageiro já tem uma corrida ativa
    checkForActivePassengerRide();
    
    // Implementação básica para solicitar corrida
    requestRideButton.addEventListener('click', () => {
        const pickupLocation = document.getElementById('pickup-location').value;
        const destination = document.getElementById('destination').value;
        
        if (!pickupLocation || !destination) {
            showError('Por favor, preencha o local de partida e o destino.');
            return;
        }
        
        // Verificar se o passageiro já tem uma corrida ativa
        db.collection('rides')
            .where('passengerId', '==', currentUser.uid)
            .where('status', 'in', ['pending', 'accepted'])
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // Verificar se a corrida é antiga (mais de 1 hora)
                    const rideDoc = querySnapshot.docs[0];
                    const rideData = rideDoc.data();
                    const rideCreatedAt = rideData.createdAt.toDate();
                    const oneHourAgo = new Date();
                    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
                    
                    if (rideCreatedAt < oneHourAgo) {
                        // Corrida antiga, vamos cancelá-la automaticamente
                        return db.collection('rides').doc(rideDoc.id).update({
                            status: 'cancelled',
                            cancelReason: 'Cancelada automaticamente por inatividade',
                            cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(() => {
                            console.log('Corrida antiga cancelada automaticamente');
                            return Promise.resolve(); // Continuar com a criação da nova corrida
                        });
                    } else {
                        // Corrida recente, não permitir nova solicitação
                        showError('Você já tem uma corrida ativa. Aguarde sua conclusão antes de solicitar outra.');
                        return Promise.reject('Corrida ativa existente');
                    }
                }
                
                return Promise.resolve(); // Continuar com a criação da nova corrida
            })
            .then(() => {
                // Criar uma nova solicitação de corrida no Firestore
                return db.collection('rides').add({
                    passengerId: currentUser.uid,
                    passengerName: userData.name,
                    passengerPhone: userData.phone,
                    pickupLocation: pickupLocation,
                    destination: destination,
                    status: 'pending', // pending, accepted, completed, cancelled
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    driverId: null,
                    driverName: null
                });
            })
            .then((docRef) => {
                showSuccess('Corrida solicitada com sucesso!');
                
                // Mostrar o status da corrida
                rideStatus.classList.remove('hidden');
                statusMessage.textContent = 'Procurando mototaxistas próximos...';
                
                // Limpar os campos
                document.getElementById('pickup-location').value = '';
                document.getElementById('destination').value = '';
                
                // Configurar um listener para atualizações na corrida
                setupRideStatusListener(docRef.id);
            })
            .catch((error) => {
                if (error === 'Corrida ativa existente') return;
                console.error('Erro ao solicitar corrida:', error);
                showError('Erro ao solicitar corrida: ' + error.message);
            });
    });
}

// Verificar se o passageiro já tem uma corrida ativa
function checkForActivePassengerRide() {
    db.collection('rides')
        .where('passengerId', '==', currentUser.uid)
        .where('status', 'in', ['pending', 'accepted'])
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Verificar se a corrida é antiga (mais de 1 hora)
                const rideDoc = querySnapshot.docs[0];
                const rideData = rideDoc.data();
                const rideCreatedAt = rideData.createdAt ? rideData.createdAt.toDate() : new Date();
                const oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);
                
                if (rideCreatedAt < oneHourAgo) {
                    // Corrida antiga, vamos cancelá-la automaticamente
                    db.collection('rides').doc(rideDoc.id).update({
                        status: 'cancelled',
                        cancelReason: 'Cancelada automaticamente por inatividade',
                        cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        console.log('Corrida antiga cancelada automaticamente');
                        // Não mostrar status para corridas canceladas
                        rideStatus.classList.add('hidden');
                    }).catch((error) => {
                        console.error('Erro ao cancelar corrida antiga:', error);
                    });
                } else {
                    // Corrida recente, mostrar o status
                    rideStatus.classList.remove('hidden');
                    
                    // Configurar um listener para atualizações na corrida
                    setupRideStatusListener(rideDoc.id);
                }
            } else {
                // Não tem corrida ativa, esconder o status
                rideStatus.classList.add('hidden');
            }
        })
        .catch((error) => {
            console.error('Erro ao verificar corrida ativa do passageiro:', error);
        });
}

// Configurar listener para atualizações no status da corrida
function setupRideStatusListener(rideId) {
    // Remover listener anterior se existir
    if (rideStatusListener) {
        rideStatusListener();
    }
    
    // Configurar novo listener
    rideStatusListener = db.collection('rides').doc(rideId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const rideData = doc.data();
                
                switch(rideData.status) {
                    case 'pending':
                        statusMessage.textContent = 'Procurando mototaxistas próximos...';
                        break;
                    case 'accepted':
                        statusMessage.textContent = `Corrida aceita por ${rideData.driverName}! Aguarde no local de partida.`;
                        break;
                    case 'completed':
                        statusMessage.textContent = 'Corrida finalizada. Obrigado por usar nosso serviço!';
                        // Esconder o status após alguns segundos
                        setTimeout(() => {
                            rideStatus.classList.add('hidden');
                        }, 5000);
                        break;
                    case 'cancelled':
                        statusMessage.textContent = 'Corrida cancelada.';
                        // Esconder o status após alguns segundos
                        setTimeout(() => {
                            rideStatus.classList.add('hidden');
                        }, 5000);
                        break;
                }
            }
        }, (error) => {
            console.error('Erro ao monitorar status da corrida:', error);
        });
}

// Configurar a interface do mototaxista
function setupDriverInterface(userData) {
    // Esconder a interface de corrida atual inicialmente
    currentRide.classList.add('hidden');
    
    // Listener para mudança de status do mototaxista
    driverStatus.addEventListener('change', () => {
        const status = driverStatus.value;
        
        // Atualizar o status do mototaxista no Firestore
        db.collection('users').doc(currentUser.uid).update({
            status: status
        })
        .then(() => {
            showSuccess(`Status atualizado para: ${status === 'available' ? 'Disponível' : 'Indisponível'}`);
            
            // Se estiver indisponível, esconder a lista de corridas e remover o listener
            if (status === 'unavailable') {
                ridesList.innerHTML = '<p class="empty-message">Você está indisponível para novas corridas.</p>';
                if (pendingRidesListener) {
                    pendingRidesListener();
                    pendingRidesListener = null;
                }
            } else {
                // Se estiver disponível, configurar listener para corridas pendentes
                setupPendingRidesListener();
            }
        })
        .catch((error) => {
            console.error('Erro ao atualizar status:', error);
            showError('Erro ao atualizar status: ' + error.message);
        });
    });
    
    // Configurar o status inicial do mototaxista
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.status) {
                    driverStatus.value = data.status;
                } else {
                    // Se não tiver status definido, definir como disponível por padrão
                    db.collection('users').doc(currentUser.uid).update({
                        status: 'available'
                    });
                    driverStatus.value = 'available';
                }
                
                // Verificar se o mototaxista já tem uma corrida em andamento
                checkForActiveRide();
                
                // Se estiver disponível, configurar listener para corridas pendentes
                if (driverStatus.value === 'available') {
                    setupPendingRidesListener();
                }
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar status do mototaxista:', error);
        });
    
    // Listener para finalizar corrida atual
    completeRideButton.addEventListener('click', () => {
        // Buscar a corrida atual do mototaxista
        db.collection('rides')
            .where('driverId', '==', currentUser.uid)
            .where('status', '==', 'accepted')
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // Deve haver apenas uma corrida ativa por vez
                    const rideDoc = querySnapshot.docs[0];
                    
                    // Atualizar o status da corrida para 'completed'
                    return db.collection('rides').doc(rideDoc.id).update({
                        status: 'completed',
                        completedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    throw new Error('Nenhuma corrida ativa encontrada.');
                }
            })
            .then(() => {
                showSuccess('Corrida finalizada com sucesso!');
                
                // Esconder a interface de corrida atual
                currentRide.classList.add('hidden');
                
                // Configurar listener para corridas pendentes novamente
                if (driverStatus.value === 'available') {
                    setupPendingRidesListener();
                }
            })
            .catch((error) => {
                console.error('Erro ao finalizar corrida:', error);
                showError('Erro ao finalizar corrida: ' + error.message);
            });
    });
}

// Configurar listener para corridas pendentes
function setupPendingRidesListener() {
    try {
        // Remover listener anterior se existir
        if (pendingRidesListener) {
            pendingRidesListener();
            pendingRidesListener = null;
        }
        
        // Limpar a lista atual
        ridesList.innerHTML = '<p class="empty-message">Carregando corridas disponíveis...</p>';
        
        // Verificar se o mototaxista está disponível
        if (driverStatus.value !== 'available') {
            ridesList.innerHTML = '<p class="empty-message">Você está indisponível para novas corridas.</p>';
            return;
        }
        
        // Verificar se o mototaxista já tem uma corrida em andamento
        db.collection('rides')
            .where('driverId', '==', currentUser.uid)
            .where('status', '==', 'accepted')
            .get()
            .then((activeRideSnapshot) => {
                if (!activeRideSnapshot.empty) {
                    // O mototaxista já tem uma corrida em andamento
                    ridesList.innerHTML = '<p class="empty-message">Você está em uma corrida no momento.</p>';
                    return;
                }
                
                // Configurar novo listener para corridas com status 'pending'
                pendingRidesListener = db.collection('rides')
                    .where('status', '==', 'pending')
                    .orderBy('createdAt', 'asc') // Ordenar por data de criação (mais antigas primeiro)
                    .onSnapshot((querySnapshot) => {
                        // Limpar a lista atual
                        ridesList.innerHTML = '';
                        
                        if (querySnapshot.empty) {
                            ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
                            return;
                        }
                        
                        // Buscar corridas recusadas pelo mototaxista
                        db.collection('declinedRides')
                            .where('driverId', '==', currentUser.uid)
                            .get()
                            .then((declinedSnapshot) => {
                                // Criar um conjunto de IDs de corridas recusadas
                                const declinedRideIds = new Set();
                                declinedSnapshot.forEach((doc) => {
                                    declinedRideIds.add(doc.data().rideId);
                                });
                                
                                // Adicionar cada corrida não recusada à lista
                                let hasRides = false;
                                
                                querySnapshot.forEach((doc) => {
                                    const ride = doc.data();
                                    const rideId = doc.id;
                                    
                                    // Pular corridas recusadas
                                    if (declinedRideIds.has(rideId)) {
                                        return;
                                    }
                                    
                                    hasRides = true;
                                    
                                    const rideElement = document.createElement('div');
                                    rideElement.className = 'ride-item';
                                    rideElement.innerHTML = `
                                        <p><strong>Passageiro:</strong> ${ride.passengerName}</p>
                                        <p><strong>Local de partida:</strong> ${ride.pickupLocation}</p>
                                        <p><strong>Destino:</strong> ${ride.destination}</p>
                                        <div class="ride-actions">
                                            <button class="primary-button accept-ride" data-ride-id="${rideId}">Aceitar</button>
                                            <button class="secondary-button decline-ride" data-ride-id="${rideId}">Recusar</button>
                                        </div>
                                    `;
                                    
                                    ridesList.appendChild(rideElement);
                                    
                                    // Adicionar event listeners para os botões
                                    const acceptButton = rideElement.querySelector('.accept-ride');
                                    const declineButton = rideElement.querySelector('.decline-ride');
                                    
                                    acceptButton.addEventListener('click', () => acceptRide(rideId, ride));
                                    declineButton.addEventListener('click', () => declineRide(rideId));
                                });
                                
                                // Se não houver corridas não recusadas, mostrar mensagem
                                if (!hasRides) {
                                    ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
                                }
                            })
                            .catch((error) => {
                                console.error('Erro ao carregar corridas recusadas:', error);
                                ridesList.innerHTML = '<p class="empty-message">Erro ao carregar corridas. Tente novamente.</p>';
                            });
                    }, (error) => {
                        console.error('Erro ao monitorar corridas pendentes:', error);
                        ridesList.innerHTML = '<p class="empty-message">Erro ao monitorar corridas. Tente novamente.</p>';
                    });
            })
            .catch((error) => {
                console.error('Erro ao verificar corrida ativa:', error);
                ridesList.innerHTML = '<p class="empty-message">Erro ao verificar status. Tente novamente.</p>';
            });
    } catch (error) {
        console.error('Erro ao configurar listener de corridas pendentes:', error);
        ridesList.innerHTML = '<p class="empty-message">Erro ao configurar monitoramento. Tente novamente.</p>';
    }
}

// Aceitar uma corrida
function acceptRide(rideId, rideData) {
    // Verificar se o mototaxista já tem uma corrida em andamento
    db.collection('rides')
        .where('driverId', '==', currentUser.uid)
        .where('status', '==', 'accepted')
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                showError('Você já tem uma corrida em andamento. Finalize-a antes de aceitar uma nova.');
                return Promise.reject('Corrida em andamento');
            }
            
            // Verificar se a corrida ainda está pendente
            return db.collection('rides').doc(rideId).get();
        })
        .then((rideDoc) => {
            if (!rideDoc.exists) {
                showError('Esta corrida não existe mais.');
                return Promise.reject('Corrida não existe');
            }
            
            const currentRideData = rideDoc.data();
            if (currentRideData.status !== 'pending') {
                showError('Esta corrida já foi aceita por outro mototaxista ou foi cancelada.');
                return Promise.reject('Corrida não está mais pendente');
            }
            
            // Buscar dados do mototaxista
            return db.collection('users').doc(currentUser.uid).get();
        })
        .then((userDoc) => {
            const userData = userDoc.data();
            
            // Atualizar a corrida com os dados do mototaxista
            return db.collection('rides').doc(rideId).update({
                status: 'accepted',
                driverId: currentUser.uid,
                driverName: userData.name,
                driverPhone: userData.phone,
                acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            showSuccess('Corrida aceita com sucesso!');
            
            // Atualizar a interface para mostrar a corrida atual
            document.getElementById('passenger-name').textContent = rideData.passengerName;
            document.getElementById('ride-pickup').textContent = rideData.pickupLocation;
            document.getElementById('ride-destination').textContent = rideData.destination;
            
            currentRide.classList.remove('hidden');
            
            // Remover o listener de corridas pendentes
            if (pendingRidesListener) {
                pendingRidesListener();
                pendingRidesListener = null;
            }
            
            // Esconder a lista de corridas disponíveis
            ridesList.innerHTML = '<p class="empty-message">Você está em uma corrida no momento.</p>';
        })
        .catch((error) => {
            if (error === 'Corrida em andamento' || error === 'Corrida não existe' || error === 'Corrida não está mais pendente') return;
            console.error('Erro ao aceitar corrida:', error);
            showError('Erro ao aceitar corrida: ' + error.message);
        });
}

// Recusar uma corrida
function declineRide(rideId) {
    // Registrar que este mototaxista recusou esta corrida
    db.collection('declinedRides').add({
        rideId: rideId,
        driverId: currentUser.uid,
        declinedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // Remover o item da lista
        const rideElement = document.querySelector(`.ride-item .accept-ride[data-ride-id="${rideId}"]`);
        if (rideElement) {
            const parentElement = rideElement.closest('.ride-item');
            if (parentElement) {
                parentElement.remove();
            }
        }
        
        // Se não houver mais corridas, mostrar mensagem
        if (ridesList.children.length === 0) {
            ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
        }
    })
    .catch((error) => {
        console.error('Erro ao registrar recusa de corrida:', error);
        showError('Erro ao recusar corrida: ' + error.message);
    });
}

// Verificar se o mototaxista já tem uma corrida em andamento
function checkForActiveRide() {
    db.collection('rides')
        .where('driverId', '==', currentUser.uid)
        .where('status', '==', 'accepted')
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // O mototaxista tem uma corrida em andamento
                const rideDoc = querySnapshot.docs[0];
                const rideData = rideDoc.data();
                
                // Atualizar a interface para mostrar a corrida atual
                document.getElementById('passenger-name').textContent = rideData.passengerName;
                document.getElementById('ride-pickup').textContent = rideData.pickupLocation;
                document.getElementById('ride-destination').textContent = rideData.destination;
                
                currentRide.classList.remove('hidden');
                
                // Remover o listener de corridas pendentes
                if (pendingRidesListener) {
                    pendingRidesListener();
                    pendingRidesListener = null;
                }
                
                // Esconder a lista de corridas disponíveis
                ridesList.innerHTML = '<p class="empty-message">Você está em uma corrida no momento.</p>';
            }
        })
        .catch((error) => {
            console.error('Erro ao verificar corrida ativa:', error);
        });
}

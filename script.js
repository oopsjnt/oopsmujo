// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDcTmNZM7mgYT7PcuSFuByb2T6fw3gf0j4",
  authDomain: "oopsmujo.firebaseapp.com",
  projectId: "oopsmujo",
  storageBucket: "oopsmujo.firebasestorage.app",
  messagingSenderId: "1032028058233",
  appId: "1:1032028058233:web:6c9af952d2da504f465aa8"
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Variáveis globais
let currentUser = null;
let userType = null;
let deferredPrompt = null;
let currentRide = null;
let isAdmin = false;

// Elementos DOM - Autenticação
const authSection = document.getElementById('auth-section');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const termsCheckbox = document.getElementById('terms-checkbox');
const showTermsButton = document.getElementById('show-terms');
const termsModal = document.getElementById('terms-modal');
const acceptTermsButton = document.getElementById('accept-terms');

// Elementos DOM - App Principal
const appSection = document.getElementById('app-section');
const adminSection = document.getElementById('admin-section');
const userProfilePicture = document.getElementById('user-profile-picture');
const userName = document.getElementById('user-name');
const logoutButton = document.getElementById('logout-button');
const adminLogoutButton = document.getElementById('admin-logout-button');
const profileButton = document.getElementById('profile-button');

// Elementos DOM - Navegação
const navMain = document.getElementById('nav-main');
const navHistory = document.getElementById('nav-history');
const navProfile = document.getElementById('nav-profile');
const navSuggestions = document.getElementById('nav-suggestions');
const navPrices = document.getElementById('nav-prices');
const mainSection = document.getElementById('main-section');
const historySection = document.getElementById('history-section');
const profileSection = document.getElementById('profile-section');
const suggestionsSection = document.getElementById('suggestions-section');
const pricesSection = document.getElementById('prices-section');

// Elementos DOM - Interface do Passageiro
const passengerInterface = document.getElementById('passenger-interface');
const pickupLocation = document.getElementById('pickup-location');
const destination = document.getElementById('destination');
const useCurrentLocationButton = document.getElementById('use-current-location');
const locationStatus = document.getElementById('location-status');
const requestRideButton = document.getElementById('request-ride-button');
const rideStatus = document.getElementById('ride-status');
const statusMessage = document.getElementById('status-message');
const whatsappContact = document.getElementById('whatsapp-contact');
const cancelRideButton = document.getElementById('cancel-ride-button');
const nearbyDrivers = document.getElementById('nearby-drivers');

// Elementos DOM - Interface do Mototaxista
const driverInterface = document.getElementById('driver-interface');
const driverStatus = document.getElementById('driver-status');
const driverRating = document.getElementById('driver-rating');
const ridesList = document.getElementById('rides-list');
const currentRideElement = document.getElementById('current-ride');
const passengerName = document.getElementById('passenger-name');
const ridePickup = document.getElementById('ride-pickup');
const rideDestination = document.getElementById('ride-destination');
const whatsappContactDriver = document.getElementById('whatsapp-contact-driver');
const completeRideButton = document.getElementById('complete-ride-button');

// Elementos DOM - Histórico
const rideHistory = document.getElementById('ride-history');
const userRatingsHistory = document.getElementById('user-ratings-history');

// Elementos DOM - Perfil
const profilePicturePreview = document.getElementById('profile-picture-preview');
const profilePictureInput = document.getElementById('profile-picture');
const saveProfileButton = document.getElementById('save-profile-button');

// Elementos DOM - Sugestões
const suggestionTitle = document.getElementById('suggestion-title');
const suggestionText = document.getElementById('suggestion-text');
const suggestionType = document.getElementById('suggestion-type');
const submitSuggestionButton = document.getElementById('submit-suggestion-button');
const suggestionsList = document.getElementById('suggestions-list');

// Elementos DOM - Preços
const priceTableImage = document.getElementById('price-table-image');

// Elementos DOM - Feedback de Cancelamento
const cancelFeedbackContainer = document.getElementById('cancel-feedback-container');
const otherReasonTextarea = document.getElementById('other-reason');
const submitCancelFeedback = document.getElementById('submit-cancel-feedback');

// Elementos DOM - PWA
const pwaBanner = document.getElementById('pwa-banner');
const installPwaButton = document.getElementById('install-pwa');
const closePwaBannerButton = document.getElementById('close-pwa-banner');

// Elementos DOM - Admin
const adminNavDashboard = document.getElementById('admin-nav-dashboard');
const adminNavUsers = document.getElementById('admin-nav-users');
const adminNavRides = document.getElementById('admin-nav-rides');
const adminNavSuggestions = document.getElementById('admin-nav-suggestions');
const adminNavSettings = document.getElementById('admin-nav-settings');
const adminDashboard = document.getElementById('admin-dashboard');
const adminUsers = document.getElementById('admin-users');
const adminRides = document.getElementById('admin-rides');
const adminSuggestions = document.getElementById('admin-suggestions');
const adminSettings = document.getElementById('admin-settings');
const totalUsers = document.getElementById('total-users');
const activeDrivers = document.getElementById('active-drivers');
const ridesToday = document.getElementById('rides-today');
const totalRides = document.getElementById('total-rides');
const activityList = document.getElementById('activity-list');
const userSearch = document.getElementById('user-search');
const userFilter = document.getElementById('user-filter');
const usersList = document.getElementById('users-list');
const rideSearch = document.getElementById('ride-search');
const rideFilter = document.getElementById('ride-filter');
const adminRidesList = document.getElementById('admin-rides-list');
const suggestionSearch = document.getElementById('suggestion-search');
const suggestionFilter = document.getElementById('suggestion-filter');
const adminSuggestionsList = document.getElementById('admin-suggestions-list');
const timeoutSetting = document.getElementById('timeout-setting');
const saveSettings = document.getElementById('save-settings');
const priceTableUpload = document.getElementById('price-table-upload');
const uploadPriceTable = document.getElementById('upload-price-table');

// Event Listeners - Autenticação
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    auth.onAuthStateChanged(handleAuthStateChanged);
    
    // Tabs de autenticação
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
    
    // Login
    loginButton.addEventListener('click', handleLogin);
    
    // Registro
    termsCheckbox.addEventListener('change', () => {
        registerButton.disabled = !termsCheckbox.checked;
    });
    
    showTermsButton.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.classList.remove('hidden');
    });
    
    document.querySelector('.close-modal').addEventListener('click', () => {
        termsModal.classList.add('hidden');
    });
    
    acceptTermsButton.addEventListener('click', () => {
        termsCheckbox.checked = true;
        registerButton.disabled = false;
        termsModal.classList.add('hidden');
    });
    
    registerButton.addEventListener('click', handleRegister);
    
    // Logout
    logoutButton.addEventListener('click', handleLogout);
    if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', handleLogout);
    }
    
    // Navegação
    navMain.addEventListener('click', () => showSection(mainSection, navMain));
    navHistory.addEventListener('click', () => {
        showSection(historySection, navHistory);
        loadRideHistory();
        loadUserRatings();
    });
    navProfile.addEventListener('click', () => showSection(profileSection, navProfile));
    navSuggestions.addEventListener('click', () => {
        showSection(suggestionsSection, navSuggestions);
        loadUserSuggestions();
    });
    navPrices.addEventListener('click', () => {
        showSection(pricesSection, navPrices);
        loadPriceTable();
    });
    
    // Interface do Passageiro
    if (useCurrentLocationButton) {
        useCurrentLocationButton.addEventListener('click', handleGetCurrentLocation);
    }
    
    if (requestRideButton) {
        requestRideButton.addEventListener('click', handleRequestRide);
    }
    
    if (cancelRideButton) {
        cancelRideButton.addEventListener('click', showCancelFeedback);
    }
    
    // Interface do Mototaxista
    if (driverStatus) {
        driverStatus.addEventListener('change', handleDriverStatusChange);
    }
    
    if (completeRideButton) {
        completeRideButton.addEventListener('click', handleCompleteRide);
    }
    
    // Perfil
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', handleProfilePictureChange);
    }
    
    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', handleSaveProfile);
    }
    
    // Sugestões
    if (submitSuggestionButton) {
        submitSuggestionButton.addEventListener('click', handleSubmitSuggestion);
    }
    
    // Feedback de Cancelamento
    document.querySelectorAll('input[name="cancel-reason"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'other') {
                otherReasonTextarea.classList.remove('hidden');
            } else {
                otherReasonTextarea.classList.add('hidden');
            }
        });
    });
    
    document.querySelector('.close-modal-feedback').addEventListener('click', () => {
        cancelFeedbackContainer.classList.add('hidden');
    });
    
    if (submitCancelFeedback) {
        submitCancelFeedback.addEventListener('click', handleCancelRide);
    }
    
    // PWA
    if (installPwaButton) {
        installPwaButton.addEventListener('click', handleInstallPwa);
    }
    
    if (closePwaBannerButton) {
        closePwaBannerButton.addEventListener('click', () => {
            pwaBanner.classList.add('hidden');
            localStorage.setItem('pwaBannerClosed', 'true');
        });
    }
    
    // Admin
    if (adminNavDashboard) {
        adminNavDashboard.addEventListener('click', () => {
            showAdminSection(adminDashboard, adminNavDashboard);
            loadAdminDashboard();
        });
    }
    
    if (adminNavUsers) {
        adminNavUsers.addEventListener('click', () => {
            showAdminSection(adminUsers, adminNavUsers);
            loadAdminUsers();
        });
    }
    
    if (adminNavRides) {
        adminNavRides.addEventListener('click', () => {
            showAdminSection(adminRides, adminNavRides);
            loadAdminRides();
        });
    }
    
    if (adminNavSuggestions) {
        adminNavSuggestions.addEventListener('click', () => {
            showAdminSection(adminSuggestions, adminNavSuggestions);
            loadAdminSuggestions();
        });
    }
    
    if (adminNavSettings) {
        adminNavSettings.addEventListener('click', () => {
            showAdminSection(adminSettings, adminNavSettings);
            loadAdminSettings();
        });
    }
    
    if (userSearch) {
        userSearch.addEventListener('input', () => {
            loadAdminUsers(userSearch.value, userFilter.value);
        });
    }
    
    if (userFilter) {
        userFilter.addEventListener('change', () => {
            loadAdminUsers(userSearch.value, userFilter.value);
        });
    }
    
    if (rideSearch) {
        rideSearch.addEventListener('input', () => {
            loadAdminRides(rideSearch.value, rideFilter.value);
        });
    }
    
    if (rideFilter) {
        rideFilter.addEventListener('change', () => {
            loadAdminRides(rideSearch.value, rideFilter.value);
        });
    }
    
    if (suggestionSearch) {
        suggestionSearch.addEventListener('input', () => {
            loadAdminSuggestions(suggestionSearch.value, suggestionFilter.value);
        });
    }
    
    if (suggestionFilter) {
        suggestionFilter.addEventListener('change', () => {
            loadAdminSuggestions(suggestionSearch.value, suggestionFilter.value);
        });
    }
    
    if (saveSettings) {
        saveSettings.addEventListener('click', handleSaveSettings);
    }
    
    if (uploadPriceTable) {
        uploadPriceTable.addEventListener('click', handleUploadPriceTable);
    }
    
    // PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (!localStorage.getItem('pwaBannerClosed')) {
            pwaBanner.classList.remove('hidden');
        }
    });
});

// Funções de Autenticação
async function handleAuthStateChanged(user) {
    try {
        if (user) {
            currentUser = user;
            
            // Verificar se é admin
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                userType = userData.type;
                isAdmin = userData.isAdmin || false;
                
                if (isAdmin) {
                    // Mostrar interface de admin
                    authSection.classList.add('hidden');
                    appSection.classList.add('hidden');
                    adminSection.classList.remove('hidden');
                    loadAdminDashboard();
                    return;
                }
                
                // Atualizar UI com dados do usuário
                userName.textContent = userData.name || 'Usuário';
                if (userData.profilePicture) {
                    userProfilePicture.src = userData.profilePicture;
                    profilePicturePreview.src = userData.profilePicture;
                }
                
                // Mostrar interface apropriada
                authSection.classList.add('hidden');
                appSection.classList.remove('hidden');
                
                if (userType === 'driver') {
                    passengerInterface.classList.add('hidden');
                    driverInterface.classList.remove('hidden');
                    loadDriverInfo();
                    startRidesListener();
                } else {
                    driverInterface.classList.add('hidden');
                    passengerInterface.classList.remove('hidden');
                    checkActiveRide();
                }
            } else {
                console.error('Documento do usuário não encontrado');
                auth.signOut();
            }
        } else {
            // Usuário não autenticado
            currentUser = null;
            userType = null;
            isAdmin = false;
            authSection.classList.remove('hidden');
            appSection.classList.add('hidden');
            adminSection.classList.add('hidden');
            loginTab.click();
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        showToast('Erro ao verificar autenticação. Tente novamente.', 'error');
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Auth state change listener vai cuidar do redirecionamento
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showToast('Erro ao fazer login. Verifique suas credenciais.', 'error');
    }
}

async function handleRegister() {
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const accountType = document.querySelector('input[name="account-type"]:checked').value;
    
    if (!name || !phone || !email || !password) {
        showToast('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (!termsCheckbox.checked) {
        showToast('Você precisa aceitar os termos de uso.', 'error');
        return;
    }
    
    try {
        // Criar usuário no Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Salvar dados adicionais no Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            phone: phone,
            email: email,
            type: accountType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: accountType === 'driver' ? 'unavailable' : 'active',
            isAdmin: false
        });
        
        showToast('Cadastro realizado com sucesso!', 'success');
        // Auth state change listener vai cuidar do redirecionamento
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        showToast('Erro ao cadastrar. Tente novamente.', 'error');
    }
}

function handleLogout() {
    auth.signOut()
        .then(() => {
            // Auth state change listener vai cuidar do redirecionamento
        })
        .catch(error => {
            console.error('Erro ao fazer logout:', error);
            showToast('Erro ao fazer logout. Tente novamente.', 'error');
        });
}

// Funções de Navegação
function showSection(section, navButton) {
    // Esconder todas as seções
    mainSection.classList.add('hidden');
    historySection.classList.add('hidden');
    profileSection.classList.add('hidden');
    suggestionsSection.classList.add('hidden');
    pricesSection.classList.add('hidden');
    
    // Remover classe active de todos os botões
    navMain.classList.remove('active');
    navHistory.classList.remove('active');
    navProfile.classList.remove('active');
    navSuggestions.classList.remove('active');
    navPrices.classList.remove('active');
    
    // Mostrar seção selecionada
    section.classList.remove('hidden');
    navButton.classList.add('active');
}

function showAdminSection(section, navButton) {
    // Esconder todas as seções
    adminDashboard.classList.add('hidden');
    adminUsers.classList.add('hidden');
    adminRides.classList.add('hidden');
    adminSuggestions.classList.add('hidden');
    adminSettings.classList.add('hidden');
    
    // Remover classe active de todos os botões
    adminNavDashboard.classList.remove('active');
    adminNavUsers.classList.remove('active');
    adminNavRides.classList.remove('active');
    adminNavSuggestions.classList.remove('active');
    adminNavSettings.classList.remove('active');
    
    // Mostrar seção selecionada
    section.classList.remove('hidden');
    navButton.classList.add('active');
}

// Funções do Passageiro
async function handleGetCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocalização não é suportada pelo seu navegador.', 'error');
        return;
    }
    
    locationStatus.textContent = 'Obtendo localização...';
    locationStatus.classList.remove('hidden');
    
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        // Usar o serviço de geocodificação para obter o endereço
        const address = await reverseGeocode(latitude, longitude);
        pickupLocation.value = address;
        
        locationStatus.classList.add('hidden');
    } catch (error) {
        console.error('Erro ao obter localização:', error);
        locationStatus.textContent = 'Erro ao obter localização. Tente novamente.';
        setTimeout(() => {
            locationStatus.classList.add('hidden');
        }, 3000);
    }
}

async function handleRequestRide() {
    const pickup = pickupLocation.value;
    const dest = destination.value;
    
    if (!pickup || !dest) {
        showToast('Por favor, preencha os locais de partida e destino.', 'error');
        return;
    }
    
    try {
        // Verificar se já existe uma corrida ativa para este passageiro
        const activeRideQuery = await db.collection('rides')
            .where('passengerId', '==', currentUser.uid)
            .where('status', 'in', ['pending', 'accepted'])
            .get();
        
        if (!activeRideQuery.empty) {
            // Verificar se a corrida é antiga (mais de 1 hora)
            const ride = activeRideQuery.docs[0].data();
            const rideTime = ride.createdAt.toDate();
            const now = new Date();
            const diffInHours = (now - rideTime) / (1000 * 60 * 60);
            
            if (diffInHours < 1) {
                showToast('Você já tem uma corrida em andamento.', 'error');
                return;
            } else {
                // Cancelar corrida antiga automaticamente
                await db.collection('rides').doc(activeRideQuery.docs[0].id).update({
                    status: 'cancelled',
                    cancelReason: 'Cancelamento automático por timeout',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }
        
        // Obter dados do usuário
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        // Criar nova corrida
        const rideData = {
            passengerId: currentUser.uid,
            passengerName: userData.name,
            passengerPhone: userData.phone,
            passengerPictureUrl: userData.profilePicture || null,
            pickup: pickup,
            destination: dest,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            timeout: firebase.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)) // 5 minutos
        };
        
        // Adicionar coordenadas se disponíveis
        if (userData.lastLocation) {
            rideData.passengerLocation = userData.lastLocation;
        }
        
        const rideRef = await db.collection('rides').add(rideData);
        
        showToast('Corrida solicitada com sucesso!', 'success');
        
        // Atualizar UI
        rideStatus.classList.remove('hidden');
        statusMessage.textContent = 'Procurando mototaxistas próximos...';
        
        // Iniciar monitoramento da corrida
        startRideStatusMonitoring(rideRef.id);
    } catch (error) {
        console.error('Erro ao solicitar corrida:', error);
        showToast('Erro ao solicitar corrida: ' + error.message, 'error');
    }
}

async function checkActiveRide() {
    try {
        const activeRideQuery = await db.collection('rides')
            .where('passengerId', '==', currentUser.uid)
            .where('status', 'in', ['pending', 'accepted'])
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        
        if (!activeRideQuery.empty) {
            const rideDoc = activeRideQuery.docs[0];
            const rideData = rideDoc.data();
            
            // Verificar se a corrida é antiga (mais de 1 hora)
            const rideTime = rideData.createdAt.toDate();
            const now = new Date();
            const diffInHours = (now - rideTime) / (1000 * 60 * 60);
            
            if (diffInHours > 1) {
                // Cancelar corrida antiga automaticamente
                await db.collection('rides').doc(rideDoc.id).update({
                    status: 'cancelled',
                    cancelReason: 'Cancelamento automático por timeout',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return;
            }
            
            // Atualizar UI
            rideStatus.classList.remove('hidden');
            
            if (rideData.status === 'pending') {
                statusMessage.textContent = 'Procurando mototaxistas próximos...';
            } else if (rideData.status === 'accepted') {
                statusMessage.textContent = `Corrida aceita por ${rideData.driverName}. A caminho do local de partida.`;
                
                // Mostrar contato do mototaxista
                if (rideData.driverPhone) {
                    whatsappContact.innerHTML = `
                        <a href="https://wa.me/55${rideData.driverPhone.replace(/\D/g, '')}" class="whatsapp-button" target="_blank">
                            <img src="icons/whatsapp.png" alt="WhatsApp">
                            Contatar Mototaxista
                        </a>
                    `;
                    whatsappContact.classList.remove('hidden');
                }
            }
            
            // Iniciar monitoramento da corrida
            startRideStatusMonitoring(rideDoc.id);
        }
    } catch (error) {
        console.error('Erro ao verificar corridas ativas:', error);
        showToast('Erro ao verificar status da corrida. Tente novamente.', 'error');
    }
}

function startRideStatusMonitoring(rideId) {
    // Parar monitoramento anterior se existir
    if (window.rideStatusListener) {
        window.rideStatusListener();
        window.rideStatusListener = null;
    }
    
    // Verificar se o ID da corrida é válido
    if (!rideId) {
        console.error('ID de corrida inválido para monitoramento');
        statusMessage.textContent = 'Erro ao monitorar corrida. Tente novamente.';
        return;
    }
    
    // Verificar se o usuário está autenticado
    if (!currentUser || !currentUser.uid) {
        console.error('Usuário não autenticado ao iniciar monitoramento de corrida');
        statusMessage.textContent = 'Erro ao monitorar corrida. Faça login novamente.';
        return;
    }
    
    try {
        // Iniciar novo monitoramento com tratamento de erro aprimorado
        window.rideStatusListener = db.collection('rides').doc(rideId)
            .onSnapshot(
                (doc) => {
                    if (!doc || !doc.exists) {
                        console.error('Documento da corrida não encontrado');
                        statusMessage.textContent = 'Erro ao monitorar corrida. Tente novamente.';
                        
                        // Limpar monitoramento após alguns segundos
                        setTimeout(() => {
                            rideStatus.classList.add('hidden');
                            if (window.rideStatusListener) {
                                window.rideStatusListener();
                                window.rideStatusListener = null;
                            }
                        }, 5000);
                        return;
                    }
                    
                    const rideData = doc.data() || {};
                    
                    // Atualizar UI baseado no status
                    if (rideData.status === 'pending') {
                        statusMessage.textContent = 'Procurando mototaxistas próximos...';
                        whatsappContact.classList.add('hidden');
                    } else if (rideData.status === 'accepted') {
                        statusMessage.textContent = `Corrida aceita por ${rideData.driverName || 'Mototaxista'}. A caminho do local de partida.`;
                        
                        // Mostrar contato do mototaxista
                        if (rideData.driverPhone) {
                            whatsappContact.innerHTML = `
                                <a href="https://wa.me/55${rideData.driverPhone.replace(/\D/g, '')}" class="whatsapp-button" target="_blank">
                                    <img src="icons/whatsapp.png" alt="WhatsApp">
                                    Contatar Mototaxista
                                </a>
                            `;
                            whatsappContact.classList.remove('hidden');
                        } else {
                            whatsappContact.classList.add('hidden');
                        }
                    } else if (rideData.status === 'completed') {
                        statusMessage.textContent = 'Corrida finalizada.';
                        whatsappContact.classList.add('hidden');
                        
                        // Mostrar modal de avaliação
                        if (rideData.driverId) {
                            showRatingModal(rideId, rideData.driverId, 'driver');
                        }
                        
                        // Limpar monitoramento após alguns segundos
                        setTimeout(() => {
                            rideStatus.classList.add('hidden');
                            if (window.rideStatusListener) {
                                window.rideStatusListener();
                                window.rideStatusListener = null;
                            }
                        }, 5000);
                    } else if (rideData.status === 'cancelled') {
                        statusMessage.textContent = 'Corrida cancelada.';
                        whatsappContact.classList.add('hidden');
                        
                        // Limpar monitoramento após alguns segundos
                        setTimeout(() => {
                            rideStatus.classList.add('hidden');
                            if (window.rideStatusListener) {
                                window.rideStatusListener();
                                window.rideStatusListener = null;
                            }
                        }, 5000);
                    }
                },
                (error) => {
                    console.error('Erro ao monitorar corrida:', error);
                    statusMessage.textContent = 'Erro ao monitorar corrida. Tente novamente.';
                    showToast('Falha ao monitorar status da corrida. Verifique sua conexão.', 'error');
                    
                    // Tentar reiniciar o monitoramento após 10 segundos em caso de erro
                    setTimeout(() => {
                        if (window.rideStatusListener) {
                            startRideStatusMonitoring(rideId);
                        }
                    }, 10000);
                }
            );
    } catch (error) {
        console.error('Erro ao iniciar monitoramento de corrida:', error);
        statusMessage.textContent = 'Erro ao monitorar corrida. Tente novamente.';
        showToast('Falha ao iniciar monitoramento da corrida. Verifique sua conexão.', 'error');
    }
}

function showCancelFeedback() {
    cancelFeedbackContainer.classList.remove('hidden');
    
    // Resetar seleção
    document.querySelectorAll('input[name="cancel-reason"]').forEach(radio => {
        radio.checked = false;
    });
    otherReasonTextarea.value = '';
    otherReasonTextarea.classList.add('hidden');
}

async function handleCancelRide() {
    const selectedReason = document.querySelector('input[name="cancel-reason"]:checked');
    
    if (!selectedReason) {
        showToast('Por favor, selecione um motivo para o cancelamento.', 'error');
        return;
    }
    
    let cancelReason = selectedReason.value;
    
    if (cancelReason === 'other' && !otherReasonTextarea.value.trim()) {
        showToast('Por favor, descreva o motivo do cancelamento.', 'error');
        return;
    }
    
    if (cancelReason === 'other') {
        cancelReason = otherReasonTextarea.value.trim();
    }
    
    try {
        // Buscar corrida ativa
        const activeRideQuery = await db.collection('rides')
            .where('passengerId', '==', currentUser.uid)
            .where('status', 'in', ['pending', 'accepted'])
            .get();
        
        if (activeRideQuery.empty) {
            showToast('Nenhuma corrida ativa encontrada.', 'error');
            cancelFeedbackContainer.classList.add('hidden');
            return;
        }
        
        // Cancelar corrida
        await db.collection('rides').doc(activeRideQuery.docs[0].id).update({
            status: 'cancelled',
            cancelReason: cancelReason,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Corrida cancelada com sucesso.', 'success');
        cancelFeedbackContainer.classList.add('hidden');
        
        // Atualizar UI
        statusMessage.textContent = 'Corrida cancelada.';
        whatsappContact.classList.add('hidden');
        
        // Limpar monitoramento após alguns segundos
        setTimeout(() => {
            rideStatus.classList.add('hidden');
            if (window.rideStatusListener) {
                window.rideStatusListener();
                window.rideStatusListener = null;
            }
        }, 5000);
    } catch (error) {
        console.error('Erro ao cancelar corrida:', error);
        showToast('Erro ao cancelar corrida. Tente novamente.', 'error');
    }
}

// Funções do Mototaxista
async function loadDriverInfo() {
    try {
        // Carregar status atual
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        driverStatus.value = userData.status || 'unavailable';
        
        // Carregar avaliação média
        const ratings = await db.collection('ratings')
            .where('targetId', '==', currentUser.uid)
            .get();
        
        if (!ratings.empty) {
            let totalRating = 0;
            ratings.forEach(doc => {
                totalRating += doc.data().rating;
            });
            
            const averageRating = (totalRating / ratings.size).toFixed(1);
            const ratingStars = document.querySelector('.rating-stars');
            const ratingValue = document.querySelector('.rating-value');
            const ratingCount = document.querySelector('.rating-count');
            
            ratingStars.innerHTML = getStarsHTML(averageRating);
            ratingValue.textContent = averageRating;
            ratingCount.textContent = `(${ratings.size} avaliações)`;
        }
        
        // Verificar se há uma corrida em andamento
        const activeRideQuery = await db.collection('rides')
            .where('driverId', '==', currentUser.uid)
            .where('status', '==', 'accepted')
            .get();
        
        if (!activeRideQuery.empty) {
            const rideDoc = activeRideQuery.docs[0];
            const rideData = rideDoc.data();
            
            // Atualizar UI
            currentRide = {
                id: rideDoc.id,
                ...rideData
            };
            
            showCurrentRide(currentRide);
        }
    } catch (error) {
        console.error('Erro ao carregar informações do mototaxista:', error);
        showToast('Erro ao carregar informações. Tente novamente.', 'error');
    }
}

async function handleDriverStatusChange() {
    const newStatus = driverStatus.value;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast(`Status atualizado para ${newStatus === 'available' ? 'Disponível' : 'Indisponível'}.`, 'success');
        
        // Se ficar indisponível, parar de ouvir por novas corridas
        if (newStatus === 'unavailable') {
            if (window.availableRidesListener) {
                window.availableRidesListener();
                window.availableRidesListener = null;
                
                // Limpar lista de corridas
                ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
            }
        } else {
            // Se ficar disponível, começar a ouvir por novas corridas
            startRidesListener();
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showToast('Erro ao atualizar status. Tente novamente.', 'error');
        
        // Reverter UI
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        driverStatus.value = userData.status || 'unavailable';
    }
}

function startRidesListener() {
    // Parar listener anterior se existir
    if (window.availableRidesListener) {
        window.availableRidesListener();
        window.availableRidesListener = null;
    }
    
    // Verificar se o mototaxista está disponível
    if (driverStatus.value !== 'available') {
        ridesList.innerHTML = '<p class="empty-message">Você está indisponível. Mude seu status para receber corridas.</p>';
        return;
    }
    
    // Verificar se o usuário está autenticado
    if (!currentUser || !currentUser.uid) {
        console.error('Usuário não autenticado ao iniciar listener de corridas');
        ridesList.innerHTML = '<p class="error-message">Erro ao monitorar corridas. Faça login novamente.</p>';
        return;
    }
    
    // Mostrar mensagem de carregamento
    ridesList.innerHTML = '<p class="loading-message">Carregando corridas disponíveis...</p>';
    
    // Iniciar novo listener com tratamento de erro aprimorado
    try {
        window.availableRidesListener = db.collection('rides')
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                (snapshot) => {
                    // Limpar lista
                    ridesList.innerHTML = '';
                    
                    if (!snapshot || snapshot.empty) {
                        ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
                        return;
                    }
                    
                    let ridesAdded = 0;
                    
                    // Adicionar cada corrida à lista
                    snapshot.forEach(doc => {
                        if (!doc.exists) return;
                        
                        const ride = doc.data() || {};
                        
                        // Verificar se a corrida tem os dados mínimos necessários
                        if (!ride.pickup || !ride.destination) return;
                        
                        const rideTime = ride.createdAt ? ride.createdAt.toDate() : new Date();
                        const formattedTime = formatDate(rideTime);
                        
                        const rideElement = document.createElement('div');
                        rideElement.className = 'ride-item';
                        rideElement.innerHTML = `
                            <div class="ride-header">
                                <h4>${ride.passengerName || 'Passageiro'}</h4>
                                <span class="ride-time">${formattedTime}</span>
                            </div>
                            <div class="ride-locations">
                                <p><strong>Partida:</strong> ${ride.pickup}</p>
                                <p><strong>Destino:</strong> ${ride.destination}</p>
                            </div>
                            <div class="ride-buttons">
                                <button class="primary-button accept-ride-button" data-ride-id="${doc.id}">Aceitar Corrida</button>
                            </div>
                        `;
                        
                        ridesList.appendChild(rideElement);
                        ridesAdded++;
                        
                        // Adicionar event listener para o botão de aceitar
                        rideElement.querySelector('.accept-ride-button').addEventListener('click', () => {
                            handleAcceptRide(doc.id);
                        });
                    });
                    
                    // Se não adicionou nenhum elemento (pode acontecer se todos os documentos forem inválidos)
                    if (ridesAdded === 0) {
                        ridesList.innerHTML = '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
                    }
                },
                (error) => {
                    console.error('Erro ao monitorar corridas:', error);
                    ridesList.innerHTML = '<p class="error-message">Erro ao monitorar corridas. Tente novamente.</p>';
                    showToast('Falha ao monitorar corridas disponíveis. Verifique sua conexão.', 'error');
                    
                    // Tentar reiniciar o listener após 10 segundos em caso de erro
                    setTimeout(() => {
                        if (driverStatus.value === 'available') {
                            startRidesListener();
                        }
                    }, 10000);
                }
            );
    } catch (error) {
        console.error('Erro ao iniciar listener de corridas:', error);
        ridesList.innerHTML = '<p class="error-message">Erro ao monitorar corridas. Tente novamente.</p>';
        showToast('Falha ao iniciar monitoramento de corridas. Verifique sua conexão.', 'error');
    }
}
}

async function handleAcceptRide(rideId) {
    try {
        // Verificar se a corrida ainda está disponível
        const rideDoc = await db.collection('rides').doc(rideId).get();
        
        if (!rideDoc.exists) {
            showToast('Esta corrida não existe mais.', 'error');
            return;
        }
        
        const rideData = rideDoc.data();
        
        if (rideData.status !== 'pending') {
            showToast('Esta corrida já foi aceita por outro mototaxista.', 'error');
            return;
        }
        
        // Obter dados do mototaxista
        const driverDoc = await db.collection('users').doc(currentUser.uid).get();
        const driverData = driverDoc.data();
        
        // Aceitar corrida
        await db.collection('rides').doc(rideId).update({
            status: 'accepted',
            driverId: currentUser.uid,
            driverName: driverData.name,
            driverPhone: driverData.phone,
            driverPictureUrl: driverData.profilePicture || null,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Corrida aceita com sucesso!', 'success');
        
        // Atualizar UI
        currentRide = {
            id: rideId,
            ...rideData,
            driverId: currentUser.uid,
            driverName: driverData.name,
            driverPhone: driverData.phone,
            driverPictureUrl: driverData.profilePicture || null
        };
        
        showCurrentRide(currentRide);
        
        // Parar de ouvir por novas corridas
        if (window.availableRidesListener) {
            window.availableRidesListener();
            window.availableRidesListener = null;
        }
    } catch (error) {
        console.error('Erro ao aceitar corrida:', error);
        showToast('Erro ao aceitar corrida. Tente novamente.', 'error');
    }
}

function showCurrentRide(ride) {
    // Atualizar UI
    passengerName.textContent = ride.passengerName || 'Passageiro';
    ridePickup.textContent = ride.pickup;
    rideDestination.textContent = ride.destination;
    
    // Mostrar contato do passageiro
    if (ride.passengerPhone) {
        whatsappContactDriver.innerHTML = `
            <a href="https://wa.me/55${ride.passengerPhone.replace(/\D/g, '')}" class="whatsapp-button" target="_blank">
                <img src="icons/whatsapp.png" alt="WhatsApp">
                Contatar Passageiro
            </a>
        `;
        whatsappContactDriver.classList.remove('hidden');
    }
    
    // Mostrar seção de corrida atual
    currentRideElement.classList.remove('hidden');
    ridesList.innerHTML = '<p class="empty-message">Você tem uma corrida em andamento.</p>';
}

async function handleCompleteRide() {
    if (!currentRide) {
        showToast('Nenhuma corrida em andamento.', 'error');
        return;
    }
    
    try {
        // Finalizar corrida
        await db.collection('rides').doc(currentRide.id).update({
            status: 'completed',
            completedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Corrida finalizada com sucesso!', 'success');
        
        // Mostrar modal de avaliação
        showRatingModal(currentRide.id, currentRide.passengerId, 'passenger');
        
        // Limpar UI
        currentRideElement.classList.add('hidden');
        whatsappContactDriver.classList.add('hidden');
        currentRide = null;
        
        // Voltar a ouvir por novas corridas se estiver disponível
        if (driverStatus.value === 'available') {
            startRidesListener();
        }
    } catch (error) {
        console.error('Erro ao finalizar corrida:', error);
        showToast('Erro ao finalizar corrida. Tente novamente.', 'error');
    }
}

// Funções de Histórico
async function loadRideHistory() {
    try {
        // Verificar se o usuário está autenticado
        if (!currentUser || !currentUser.uid) {
            console.error('Usuário não autenticado ao carregar histórico');
            rideHistory.innerHTML = '<p class="error-message">Erro ao carregar histórico. Faça login novamente.</p>';
            return;
        }
        
        // Verificar se o tipo de usuário está definido
        if (!userType) {
            console.error('Tipo de usuário não definido ao carregar histórico');
            rideHistory.innerHTML = '<p class="error-message">Erro ao carregar histórico. Atualize a página.</p>';
            return;
        }
        
        rideHistory.innerHTML = '<p class="loading-message">Carregando histórico...</p>';
        
        // Buscar corridas do usuário com tratamento de erro aprimorado
        const ridesQuery = userType === 'driver'
            ? db.collection('rides').where('driverId', '==', currentUser.uid)
            : db.collection('rides').where('passengerId', '==', currentUser.uid);
        
        const ridesSnapshot = await ridesQuery
            .where('status', 'in', ['completed', 'cancelled'])
            .orderBy('updatedAt', 'desc')
            .limit(20)
            .get()
            .catch(error => {
                console.error('Erro na query de histórico:', error);
                throw new Error('Falha ao consultar histórico no banco de dados');
            });
        
        if (!ridesSnapshot || ridesSnapshot.empty) {
            rideHistory.innerHTML = '<p class="empty-message">Nenhuma corrida encontrada no histórico.</p>';
            return;
        }
        
        // Limpar e adicionar cada corrida ao histórico
        rideHistory.innerHTML = '';
        
        ridesSnapshot.forEach(doc => {
            if (!doc.exists) return;
            
            const ride = doc.data() || {};
            const rideTime = ride.updatedAt ? ride.updatedAt.toDate() : new Date();
            const formattedTime = formatDate(rideTime);
            
            const statusClass = ride.status === 'completed' ? 'status-completed' : 'status-cancelled';
            const statusText = ride.status === 'completed' ? 'Concluída' : 'Cancelada';
            
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            historyElement.innerHTML = `
                <div class="history-header">
                    <h4>${userType === 'driver' ? (ride.passengerName || 'Passageiro') : (ride.driverName || 'Mototaxista')}</h4>
                    <div>
                        <span class="history-date">${formattedTime}</span>
                        <span class="history-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="history-details">
                    <p><strong>Partida:</strong> ${ride.pickup || 'Não informado'}</p>
                    <p><strong>Destino:</strong> ${ride.destination || 'Não informado'}</p>
                    ${ride.status === 'cancelled' && ride.cancelReason ? `<p><strong>Motivo do cancelamento:</strong> ${ride.cancelReason}</p>` : ''}
                </div>
            `;
            
            rideHistory.appendChild(historyElement);
        });
        
        // Se não adicionou nenhum elemento (pode acontecer se todos os documentos forem inválidos)
        if (rideHistory.children.length === 0) {
            rideHistory.innerHTML = '<p class="empty-message">Nenhuma corrida encontrada no histórico.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        rideHistory.innerHTML = '<p class="error-message">Erro ao carregar histórico. Tente novamente.</p>';
        showToast('Não foi possível carregar seu histórico. Verifique sua conexão.', 'error');
    }
}

async function loadUserRatings() {
    try {
        // Verificar se o usuário está autenticado
        if (!currentUser || !currentUser.uid) {
            console.error('Usuário não autenticado ao carregar avaliações');
            userRatingsHistory.innerHTML = '<p class="error-message">Erro ao carregar avaliações. Faça login novamente.</p>';
            return;
        }
        
        userRatingsHistory.innerHTML = '<p class="loading-message">Carregando avaliações...</p>';
        
        // Buscar avaliações do usuário com tratamento de erro aprimorado
        const ratingsSnapshot = await db.collection('ratings')
            .where('targetId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get()
            .catch(error => {
                console.error('Erro na query de avaliações:', error);
                throw new Error('Falha ao consultar avaliações no banco de dados');
            });
        
        if (!ratingsSnapshot || ratingsSnapshot.empty) {
            userRatingsHistory.innerHTML = '<p class="empty-message">Nenhuma avaliação encontrada.</p>';
            return;
        }
        
        // Limpar e adicionar cada avaliação ao histórico
        userRatingsHistory.innerHTML = '';
        
        ratingsSnapshot.forEach(doc => {
            if (!doc.exists) return;
            
            const rating = doc.data() || {};
            const ratingTime = rating.createdAt ? rating.createdAt.toDate() : new Date();
            const formattedTime = formatDate(ratingTime);
            
            const ratingElement = document.createElement('div');
            ratingElement.className = 'rating-item';
            ratingElement.innerHTML = `
                <div class="rating-header">
                    <span class="rating-author">${rating.authorName || 'Usuário'}</span>
                    <span class="rating-date">${formattedTime}</span>
                </div>
                <div class="rating-body">
                    <div class="rating-stars">${getStarsHTML(rating.rating || 0)}</div>
                    ${rating.comment ? `<p class="rating-comment">"${rating.comment}"</p>` : ''}
                </div>
            `;
            
            userRatingsHistory.appendChild(ratingElement);
        });
        
        // Se não adicionou nenhum elemento (pode acontecer se todos os documentos forem inválidos)
        if (userRatingsHistory.children.length === 0) {
            userRatingsHistory.innerHTML = '<p class="empty-message">Nenhuma avaliação encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        userRatingsHistory.innerHTML = '<p class="error-message">Erro ao carregar avaliações. Tente novamente.</p>';
        showToast('Não foi possível carregar suas avaliações. Verifique sua conexão.', 'error');
    }
}

// Funções de Perfil
function handleProfilePictureChange() {
    const file = profilePictureInput.files[0];
    
    if (file) {
        // Verificar tipo de arquivo
        if (!file.type.match('image.*')) {
            showToast('Por favor, selecione uma imagem.', 'error');
            return;
        }
        
        // Verificar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('A imagem deve ter no máximo 5MB.', 'error');
            return;
        }
        
        // Mostrar preview
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicturePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function handleSaveProfile() {
    const file = profilePictureInput.files[0];
    
    if (!file) {
        showToast('Por favor, selecione uma imagem.', 'error');
        return;
    }
    
    try {
        // Upload da imagem para o Storage
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`profile_pictures/${currentUser.uid}_${Date.now()}`);
        
        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        
        // Atualizar perfil do usuário
        await db.collection('users').doc(currentUser.uid).update({
            profilePicture: downloadURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Atualizar UI
        userProfilePicture.src = downloadURL;
        
        showToast('Foto de perfil atualizada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        showToast('Erro ao salvar perfil. Tente novamente.', 'error');
    }
}

// Funções de Sugestões
async function handleSubmitSuggestion() {
    const title = suggestionTitle.value;
    const text = suggestionText.value;
    const type = suggestionType.value;
    
    if (!title || !text) {
        showToast('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    try {
        // Obter dados do usuário
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        // Criar sugestão
        await db.collection('suggestions').add({
            userId: currentUser.uid,
            userName: userData.name,
            userType: userData.type,
            title: title,
            text: text,
            type: type,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Sugestão enviada com sucesso!', 'success');
        
        // Limpar formulário
        suggestionTitle.value = '';
        suggestionText.value = '';
        suggestionType.value = 'improvement';
        
        // Recarregar sugestões
        loadUserSuggestions();
    } catch (error) {
        console.error('Erro ao enviar sugestão:', error);
        showToast('Erro ao enviar sugestão. Tente novamente.', 'error');
    }
}

async function loadUserSuggestions() {
    try {
        // Verificar se o usuário está autenticado
        if (!currentUser || !currentUser.uid) {
            console.error('Usuário não autenticado ao carregar sugestões');
            suggestionsList.innerHTML = '<p class="error-message">Erro ao carregar suas sugestões. Faça login novamente.</p>';
            return;
        }
        
        suggestionsList.innerHTML = '<p class="loading-message">Carregando sugestões...</p>';
        
        // Buscar sugestões do usuário com tratamento de erro aprimorado
        const suggestionsSnapshot = await db.collection('suggestions')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .catch(error => {
                console.error('Erro na query de sugestões:', error);
                throw new Error('Falha ao consultar sugestões no banco de dados');
            });
        
        if (!suggestionsSnapshot || suggestionsSnapshot.empty) {
            suggestionsList.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada.</p>';
            return;
        }
        
        // Limpar e adicionar cada sugestão à lista
        suggestionsList.innerHTML = '';
        
        suggestionsSnapshot.forEach(doc => {
            if (!doc.exists) return;
            
            const suggestion = doc.data() || {};
            const suggestionTime = suggestion.createdAt ? suggestion.createdAt.toDate() : new Date();
            const formattedTime = formatDate(suggestionTime);
            
            let statusClass = '';
            let statusText = '';
            
            switch (suggestion.status) {
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pendente';
                    break;
                case 'approved':
                    statusClass = 'status-approved';
                    statusText = 'Aprovada';
                    break;
                case 'rejected':
                    statusClass = 'status-rejected';
                    statusText = 'Rejeitada';
                    break;
                case 'implemented':
                    statusClass = 'status-implemented';
                    statusText = 'Implementada';
                    break;
                default:
                    statusClass = 'status-pending';
                    statusText = 'Pendente';
            }
            
            let typeText = '';
            
            switch (suggestion.type) {
                case 'improvement':
                    typeText = 'Melhoria';
                    break;
                case 'bug':
                    typeText = 'Problema';
                    break;
                case 'feature':
                    typeText = 'Nova Funcionalidade';
                    break;
                case 'other':
                    typeText = 'Outro';
                    break;
                default:
                    typeText = 'Outro';
            }
            
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-header">
                    <h4>${suggestion.title || 'Sem título'}</h4>
                    <span class="suggestion-date">${formattedTime}</span>
                </div>
                <p class="suggestion-text">${suggestion.text || 'Sem descrição'}</p>
                <div class="suggestion-footer">
                    <span class="suggestion-type">${typeText}</span>
                    <span class="suggestion-status ${statusClass}">${statusText}</span>
                </div>
            `;
            
            suggestionsList.appendChild(suggestionElement);
        });
        
        // Se não adicionou nenhum elemento (pode acontecer se todos os documentos forem inválidos)
        if (suggestionsList.children.length === 0) {
            suggestionsList.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
        suggestionsList.innerHTML = '<p class="error-message">Erro ao carregar suas sugestões. Tente novamente.</p>';
        showToast('Não foi possível carregar suas sugestões. Verifique sua conexão.', 'error');
    }
}

// Funções de Preços
async function loadPriceTable() {
    try {
        // Buscar URL da tabela de preços
        const settingsDoc = await db.collection('settings').doc('priceTable').get();
        
        if (settingsDoc.exists && settingsDoc.data().imageUrl) {
            priceTableImage.src = settingsDoc.data().imageUrl;
            priceTableImage.alt = 'Tabela de preços';
        } else {
            priceTableImage.src = '';
            priceTableImage.alt = 'Tabela de preços não disponível';
        }
    } catch (error) {
        console.error('Erro ao carregar tabela de preços:', error);
        priceTableImage.src = '';
        priceTableImage.alt = 'Erro ao carregar tabela de preços';
    }
}

// Funções de Avaliação
function showRatingModal(rideId, targetId, targetType) {
    // Verificar se já existe um modal de avaliação
    if (document.getElementById('rating-modal')) {
        return;
    }
    
    // Criar modal
    const modal = document.createElement('div');
    modal.id = 'rating-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeRatingModal()">&times;</span>
            <h2>Avalie o ${targetType === 'driver' ? 'Mototaxista' : 'Passageiro'}</h2>
            <div class="rating-stars-input">
                <span class="star" data-rating="1">★</span>
                <span class="star" data-rating="2">★</span>
                <span class="star" data-rating="3">★</span>
                <span class="star" data-rating="4">★</span>
                <span class="star" data-rating="5">★</span>
            </div>
            <div class="form-group">
                <label for="rating-comment">Comentário (opcional)</label>
                <textarea id="rating-comment" rows="3" placeholder="Deixe um comentário sobre sua experiência..."></textarea>
            </div>
            <button id="submit-rating" class="primary-button">Enviar Avaliação</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar event listeners
    let selectedRating = 0;
    
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            
            // Atualizar visual
            document.querySelectorAll('.star').forEach((s, index) => {
                if (index < selectedRating) {
                    s.style.color = 'var(--accent-secondary)';
                } else {
                    s.style.color = 'var(--text-secondary)';
                }
            });
        });
    });
    
    document.getElementById('submit-rating').addEventListener('click', async () => {
        if (selectedRating === 0) {
            showToast('Por favor, selecione uma avaliação.', 'error');
            return;
        }
        
        const comment = document.getElementById('rating-comment').value;
        
        try {
            // Obter dados do usuário
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            const userData = userDoc.data();
            
            // Criar avaliação
            await db.collection('ratings').add({
                rideId: rideId,
                authorId: currentUser.uid,
                authorName: userData.name,
                authorType: userData.type,
                targetId: targetId,
                targetType: targetType,
                rating: selectedRating,
                comment: comment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showToast('Avaliação enviada com sucesso!', 'success');
            
            // Fechar modal
            closeRatingModal();
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            showToast('Erro ao enviar avaliação. Tente novamente.', 'error');
        }
    });
}

// Funções do Admin
async function loadAdminDashboard() {
    try {
        // Carregar estatísticas
        const usersSnapshot = await db.collection('users').get();
        const driversSnapshot = await db.collection('users').where('type', '==', 'driver').where('status', '==', 'available').get();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const ridesTodaySnapshot = await db.collection('rides')
            .where('createdAt', '>=', firebase.firestore.Timestamp.fromDate(today))
            .get();
        
        const totalRidesSnapshot = await db.collection('rides').get();
        
        totalUsers.textContent = usersSnapshot.size;
        activeDrivers.textContent = driversSnapshot.size;
        ridesToday.textContent = ridesTodaySnapshot.size;
        totalRides.textContent = totalRidesSnapshot.size;
        
        // Carregar atividades recentes
        const activitiesSnapshot = await db.collection('rides')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();
        
        activityList.innerHTML = '';
        
        if (activitiesSnapshot.empty) {
            activityList.innerHTML = '<p class="empty-message">Nenhuma atividade recente.</p>';
            return;
        }
        
        activitiesSnapshot.forEach(doc => {
            const ride = doc.data();
            const rideTime = ride.createdAt ? ride.createdAt.toDate() : new Date();
            const formattedTime = formatDate(rideTime);
            
            let activityText = '';
            
            switch (ride.status) {
                case 'pending':
                    activityText = `${ride.passengerName} solicitou uma corrida`;
                    break;
                case 'accepted':
                    activityText = `${ride.driverName} aceitou a corrida de ${ride.passengerName}`;
                    break;
                case 'completed':
                    activityText = `Corrida de ${ride.passengerName} foi concluída por ${ride.driverName}`;
                    break;
                case 'cancelled':
                    activityText = `Corrida de ${ride.passengerName} foi cancelada`;
                    break;
                default:
                    activityText = `Atividade desconhecida`;
            }
            
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <span>${activityText}</span>
                <span class="activity-time">${formattedTime}</span>
            `;
            
            activityList.appendChild(activityElement);
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showToast('Erro ao carregar dashboard. Tente novamente.', 'error');
    }
}

async function loadAdminUsers(search = '', filter = 'all') {
    try {
        usersList.innerHTML = '<p class="loading-message">Carregando usuários...</p>';
        
        // Construir query base
        let query = db.collection('users');
        
        // Aplicar filtro
        if (filter === 'user') {
            query = query.where('type', '==', 'user');
        } else if (filter === 'driver') {
            query = query.where('type', '==', 'driver');
        } else if (filter === 'blocked') {
            query = query.where('blocked', '==', true);
        }
        
        // Executar query
        const usersSnapshot = await query.get();
        
        if (usersSnapshot.empty) {
            usersList.innerHTML = '<p class="empty-message">Nenhum usuário encontrado.</p>';
            return;
        }
        
        // Filtrar por busca se necessário
        let filteredUsers = [];
        
        usersSnapshot.forEach(doc => {
            const user = {
                id: doc.id,
                ...doc.data()
            };
            
            // Aplicar filtro de busca
            if (search && !user.name.toLowerCase().includes(search.toLowerCase()) && !user.email.toLowerCase().includes(search.toLowerCase())) {
                return;
            }
            
            filteredUsers.push(user);
        });
        
        // Ordenar por nome
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
        
        // Limpar e adicionar cada usuário à lista
        usersList.innerHTML = '';
        
        if (filteredUsers.length === 0) {
            usersList.innerHTML = '<p class="empty-message">Nenhum usuário encontrado.</p>';
            return;
        }
        
        filteredUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <div class="user-item-info">
                    <img src="${user.profilePicture || 'icons/default-profile.png'}" alt="Foto de perfil">
                    <div class="user-item-details">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                        <p>${user.type === 'driver' ? 'Mototaxista' : 'Passageiro'} | ${user.phone || 'Sem telefone'}</p>
                    </div>
                </div>
                <div class="user-item-actions">
                    <button class="secondary-button ${user.blocked ? 'unblock-user-button' : 'block-user-button'}" data-user-id="${user.id}">
                        ${user.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                </div>
            `;
            
            usersList.appendChild(userElement);
            
            // Adicionar event listeners
            if (user.blocked) {
                userElement.querySelector('.unblock-user-button').addEventListener('click', () => {
                    handleUnblockUser(user.id);
                });
            } else {
                userElement.querySelector('.block-user-button').addEventListener('click', () => {
                    handleBlockUser(user.id);
                });
            }
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        usersList.innerHTML = '<p class="error-message">Erro ao carregar usuários. Tente novamente.</p>';
    }
}

async function handleBlockUser(userId) {
    try {
        await db.collection('users').doc(userId).update({
            blocked: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Usuário bloqueado com sucesso!', 'success');
        
        // Recarregar lista
        loadAdminUsers(userSearch.value, userFilter.value);
    } catch (error) {
        console.error('Erro ao bloquear usuário:', error);
        showToast('Erro ao bloquear usuário. Tente novamente.', 'error');
    }
}

async function handleUnblockUser(userId) {
    try {
        await db.collection('users').doc(userId).update({
            blocked: false,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Usuário desbloqueado com sucesso!', 'success');
        
        // Recarregar lista
        loadAdminUsers(userSearch.value, userFilter.value);
    } catch (error) {
        console.error('Erro ao desbloquear usuário:', error);
        showToast('Erro ao desbloquear usuário. Tente novamente.', 'error');
    }
}

async function loadAdminRides(search = '', filter = 'all') {
    try {
        adminRidesList.innerHTML = '<p class="loading-message">Carregando corridas...</p>';
        
        // Construir query base
        let query = db.collection('rides');
        
        // Aplicar filtro
        if (filter === 'pending') {
            query = query.where('status', '==', 'pending');
        } else if (filter === 'accepted') {
            query = query.where('status', '==', 'accepted');
        } else if (filter === 'completed') {
            query = query.where('status', '==', 'completed');
        } else if (filter === 'cancelled') {
            query = query.where('status', '==', 'cancelled');
        }
        
        // Ordenar por data
        query = query.orderBy('createdAt', 'desc');
        
        // Executar query
        const ridesSnapshot = await query.limit(50).get();
        
        if (ridesSnapshot.empty) {
            adminRidesList.innerHTML = '<p class="empty-message">Nenhuma corrida encontrada.</p>';
            return;
        }
        
        // Filtrar por busca se necessário
        let filteredRides = [];
        
        ridesSnapshot.forEach(doc => {
            const ride = {
                id: doc.id,
                ...doc.data()
            };
            
            // Aplicar filtro de busca
            if (search && 
                !ride.passengerName?.toLowerCase().includes(search.toLowerCase()) && 
                !ride.driverName?.toLowerCase().includes(search.toLowerCase()) &&
                !ride.pickup?.toLowerCase().includes(search.toLowerCase()) &&
                !ride.destination?.toLowerCase().includes(search.toLowerCase())) {
                return;
            }
            
            filteredRides.push(ride);
        });
        
        // Limpar e adicionar cada corrida à lista
        adminRidesList.innerHTML = '';
        
        if (filteredRides.length === 0) {
            adminRidesList.innerHTML = '<p class="empty-message">Nenhuma corrida encontrada.</p>';
            return;
        }
        
        filteredRides.forEach(ride => {
            const rideTime = ride.createdAt ? ride.createdAt.toDate() : new Date();
            const formattedTime = formatDate(rideTime);
            
            let statusClass = '';
            let statusText = '';
            
            switch (ride.status) {
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pendente';
                    break;
                case 'accepted':
                    statusClass = 'status-accepted';
                    statusText = 'Aceita';
                    break;
                case 'completed':
                    statusClass = 'status-completed';
                    statusText = 'Concluída';
                    break;
                case 'cancelled':
                    statusClass = 'status-cancelled';
                    statusText = 'Cancelada';
                    break;
                default:
                    statusClass = 'status-pending';
                    statusText = 'Pendente';
            }
            
            const rideElement = document.createElement('div');
            rideElement.className = 'admin-ride-item';
            rideElement.innerHTML = `
                <div class="admin-ride-header">
                    <div>
                        <h4>Corrida #${ride.id.substring(0, 6)}</h4>
                        <span class="history-date">${formattedTime}</span>
                    </div>
                    <span class="history-status ${statusClass}">${statusText}</span>
                </div>
                <div class="admin-ride-details">
                    <p><strong>Partida:</strong> ${ride.pickup}</p>
                    <p><strong>Destino:</strong> ${ride.destination}</p>
                    ${ride.status === 'cancelled' && ride.cancelReason ? `<p><strong>Motivo do cancelamento:</strong> ${ride.cancelReason}</p>` : ''}
                </div>
                <div class="admin-ride-users">
                    <div class="admin-ride-user">
                        <img src="${ride.passengerPictureUrl || 'icons/default-profile.png'}" alt="Foto do passageiro">
                        <div>
                            <p><strong>Passageiro:</strong> ${ride.passengerName || 'Não informado'}</p>
                            <p>${ride.passengerPhone || 'Sem telefone'}</p>
                        </div>
                    </div>
                    ${ride.driverId ? `
                        <div class="admin-ride-user">
                            <img src="${ride.driverPictureUrl || 'icons/default-profile.png'}" alt="Foto do mototaxista">
                            <div>
                                <p><strong>Mototaxista:</strong> ${ride.driverName || 'Não informado'}</p>
                                <p>${ride.driverPhone || 'Sem telefone'}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            adminRidesList.appendChild(rideElement);
        });
    } catch (error) {
        console.error('Erro ao carregar corridas:', error);
        adminRidesList.innerHTML = '<p class="error-message">Erro ao carregar corridas. Tente novamente.</p>';
    }
}

async function loadAdminSuggestions(search = '', filter = 'all') {
    try {
        adminSuggestionsList.innerHTML = '<p class="loading-message">Carregando sugestões...</p>';
        
        // Construir query base
        let query = db.collection('suggestions');
        
        // Aplicar filtro
        if (filter === 'pending') {
            query = query.where('status', '==', 'pending');
        } else if (filter === 'approved') {
            query = query.where('status', '==', 'approved');
        } else if (filter === 'rejected') {
            query = query.where('status', '==', 'rejected');
        } else if (filter === 'implemented') {
            query = query.where('status', '==', 'implemented');
        }
        
        // Ordenar por data
        query = query.orderBy('createdAt', 'desc');
        
        // Executar query
        const suggestionsSnapshot = await query.limit(50).get();
        
        if (suggestionsSnapshot.empty) {
            adminSuggestionsList.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada.</p>';
            return;
        }
        
        // Filtrar por busca se necessário
        let filteredSuggestions = [];
        
        suggestionsSnapshot.forEach(doc => {
            const suggestion = {
                id: doc.id,
                ...doc.data()
            };
            
            // Aplicar filtro de busca
            if (search && 
                !suggestion.title?.toLowerCase().includes(search.toLowerCase()) && 
                !suggestion.text?.toLowerCase().includes(search.toLowerCase()) &&
                !suggestion.userName?.toLowerCase().includes(search.toLowerCase())) {
                return;
            }
            
            filteredSuggestions.push(suggestion);
        });
        
        // Limpar e adicionar cada sugestão à lista
        adminSuggestionsList.innerHTML = '';
        
        if (filteredSuggestions.length === 0) {
            adminSuggestionsList.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada.</p>';
            return;
        }
        
        filteredSuggestions.forEach(suggestion => {
            const suggestionTime = suggestion.createdAt ? suggestion.createdAt.toDate() : new Date();
            const formattedTime = formatDate(suggestionTime);
            
            let statusClass = '';
            let statusText = '';
            
            switch (suggestion.status) {
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pendente';
                    break;
                case 'approved':
                    statusClass = 'status-approved';
                    statusText = 'Aprovada';
                    break;
                case 'rejected':
                    statusClass = 'status-rejected';
                    statusText = 'Rejeitada';
                    break;
                case 'implemented':
                    statusClass = 'status-implemented';
                    statusText = 'Implementada';
                    break;
                default:
                    statusClass = 'status-pending';
                    statusText = 'Pendente';
            }
            
            let typeText = '';
            
            switch (suggestion.type) {
                case 'improvement':
                    typeText = 'Melhoria';
                    break;
                case 'bug':
                    typeText = 'Problema';
                    break;
                case 'feature':
                    typeText = 'Nova Funcionalidade';
                    break;
                case 'other':
                    typeText = 'Outro';
                    break;
                default:
                    typeText = 'Outro';
            }
            
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'admin-suggestion-item';
            suggestionElement.innerHTML = `
                <div class="admin-suggestion-header">
                    <div>
                        <h4 class="admin-suggestion-title">${suggestion.title}</h4>
                        <span class="admin-suggestion-date">${formattedTime} por ${suggestion.userName} (${suggestion.userType === 'driver' ? 'Mototaxista' : 'Passageiro'})</span>
                    </div>
                    <span class="suggestion-status ${statusClass}">${statusText}</span>
                </div>
                <div class="admin-suggestion-content">
                    <p>${suggestion.text}</p>
                </div>
                <div class="admin-suggestion-footer">
                    <span class="suggestion-type">${typeText}</span>
                    <div class="suggestion-actions">
                        ${suggestion.status === 'pending' ? `
                            <button class="secondary-button approve-suggestion-button" data-suggestion-id="${suggestion.id}">Aprovar</button>
                            <button class="secondary-button reject-suggestion-button" data-suggestion-id="${suggestion.id}">Rejeitar</button>
                        ` : suggestion.status === 'approved' ? `
                            <button class="secondary-button implement-suggestion-button" data-suggestion-id="${suggestion.id}">Marcar como Implementada</button>
                        ` : ''}
                    </div>
                </div>
            `;
            
            adminSuggestionsList.appendChild(suggestionElement);
            
            // Adicionar event listeners
            if (suggestion.status === 'pending') {
                suggestionElement.querySelector('.approve-suggestion-button').addEventListener('click', () => {
                    handleApproveSuggestion(suggestion.id);
                });
                
                suggestionElement.querySelector('.reject-suggestion-button').addEventListener('click', () => {
                    handleRejectSuggestion(suggestion.id);
                });
            } else if (suggestion.status === 'approved') {
                const implementButton = suggestionElement.querySelector('.implement-suggestion-button');
                if (implementButton) {
                    implementButton.addEventListener('click', () => {
                        handleImplementSuggestion(suggestion.id);
                    });
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
        adminSuggestionsList.innerHTML = '<p class="error-message">Erro ao carregar sugestões. Tente novamente.</p>';
    }
}

async function handleApproveSuggestion(suggestionId) {
    try {
        await db.collection('suggestions').doc(suggestionId).update({
            status: 'approved',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Sugestão aprovada com sucesso!', 'success');
        
        // Recarregar lista
        loadAdminSuggestions(suggestionSearch.value, suggestionFilter.value);
    } catch (error) {
        console.error('Erro ao aprovar sugestão:', error);
        showToast('Erro ao aprovar sugestão. Tente novamente.', 'error');
    }
}

async function handleRejectSuggestion(suggestionId) {
    try {
        await db.collection('suggestions').doc(suggestionId).update({
            status: 'rejected',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Sugestão rejeitada com sucesso!', 'success');
        
        // Recarregar lista
        loadAdminSuggestions(suggestionSearch.value, suggestionFilter.value);
    } catch (error) {
        console.error('Erro ao rejeitar sugestão:', error);
        showToast('Erro ao rejeitar sugestão. Tente novamente.', 'error');
    }
}

async function handleImplementSuggestion(suggestionId) {
    try {
        await db.collection('suggestions').doc(suggestionId).update({
            status: 'implemented',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Sugestão marcada como implementada com sucesso!', 'success');
        
        // Recarregar lista
        loadAdminSuggestions(suggestionSearch.value, suggestionFilter.value);
    } catch (error) {
        console.error('Erro ao marcar sugestão como implementada:', error);
        showToast('Erro ao marcar sugestão como implementada. Tente novamente.', 'error');
    }
}

async function loadAdminSettings() {
    try {
        // Carregar configurações
        const settingsDoc = await db.collection('settings').doc('general').get();
        
        if (settingsDoc.exists) {
            const settings = settingsDoc.data();
            timeoutSetting.value = settings.rideTimeout || 5;
        }
        
        // Carregar tabela de preços
        const priceTableDoc = await db.collection('settings').doc('priceTable').get();
        
        if (priceTableDoc.exists && priceTableDoc.data().imageUrl) {
            const priceTablePreview = document.createElement('img');
            priceTablePreview.src = priceTableDoc.data().imageUrl;
            priceTablePreview.alt = 'Tabela de preços atual';
            priceTablePreview.style.maxWidth = '100%';
            priceTablePreview.style.marginTop = '10px';
            
            const previewContainer = document.createElement('div');
            previewContainer.id = 'price-table-preview';
            previewContainer.appendChild(priceTablePreview);
            
            // Remover preview anterior se existir
            const oldPreview = document.getElementById('price-table-preview');
            if (oldPreview) {
                oldPreview.remove();
            }
            
            // Adicionar novo preview
            document.querySelector('.form-group').appendChild(previewContainer);
        }
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        showToast('Erro ao carregar configurações. Tente novamente.', 'error');
    }
}

async function handleSaveSettings() {
    const timeout = parseInt(timeoutSetting.value);
    
    if (isNaN(timeout) || timeout < 1 || timeout > 60) {
        showToast('Por favor, insira um tempo válido entre 1 e 60 minutos.', 'error');
        return;
    }
    
    try {
        await db.collection('settings').doc('general').set({
            rideTimeout: timeout,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        showToast('Configurações salvas com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showToast('Erro ao salvar configurações. Tente novamente.', 'error');
    }
}

async function handleUploadPriceTable() {
    const file = priceTableUpload.files[0];
    
    if (!file) {
        showToast('Por favor, selecione uma imagem.', 'error');
        return;
    }
    
    // Verificar tipo de arquivo
    if (!file.type.match('image.*')) {
        showToast('Por favor, selecione uma imagem.', 'error');
        return;
    }
    
    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('A imagem deve ter no máximo 5MB.', 'error');
        return;
    }
    
    try {
        // Upload da imagem para o Storage
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`price_tables/price_table_${Date.now()}`);
        
        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        
        // Salvar URL no Firestore
        await db.collection('settings').doc('priceTable').set({
            imageUrl: downloadURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Tabela de preços atualizada com sucesso!', 'success');
        
        // Recarregar configurações
        loadAdminSettings();
    } catch (error) {
        console.error('Erro ao fazer upload da tabela de preços:', error);
        showToast('Erro ao fazer upload da tabela de preços. Tente novamente.', 'error');
    }
}

// Funções do PWA
function handleInstallPwa() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação do PWA');
            } else {
                console.log('Usuário recusou a instalação do PWA');
            }
            
            deferredPrompt = null;
        });
        
        pwaBanner.classList.add('hidden');
    }
}

// Funções Utilitárias
function showToast(message, type = 'info') {
    // Verificar se já existe um toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Esconder toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remover toast do DOM após animação
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    
    // Menos de 1 minuto
    if (diff < 60 * 1000) {
        return 'Agora mesmo';
    }
    
    // Menos de 1 hora
    if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Menos de 24 horas
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Menos de 7 dias
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
    
    // Formato completo
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStarsHTML(rating) {
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

// Adicionar estilos para o toast
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px var(--shadow-color);
        z-index: 1000;
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .toast-success {
        border-left: 4px solid var(--success-color);
    }
    
    .toast-error {
        border-left: 4px solid var(--error-color);
    }
    
    .toast-info {
        border-left: 4px solid var(--accent-secondary);
    }
`;

document.head.appendChild(style);

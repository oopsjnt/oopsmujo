// Configuração do Firebase
const firebaseConfig = {
     apiKey: "AIzaSyDcTmNZM7mgYT7PcuSFuByb2T6fw3gf0j4",
  authDomain: "oopsmujo.firebaseapp.com",
  projectId: "oopsmujo",
  storageBucket: "oopsmujo.firebasestorage.app",
  messagingSenderId: "1032028058233",
  appId: "1:1032028058233:web:6c9af952d2da504f465aa8"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Inicializa os serviços
ratingService = new RatingService(db);
adminService = new AdminService(db, storage);

// Elementos da UI
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const adminSection = document.getElementById("admin-section");

// Tabs de Autenticação
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Campos de Login
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");

// Campos de Cadastro
const registerName = document.getElementById("register-name");
const registerPhone = document.getElementById("register-phone");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerButton = document.getElementById("register-button");
const accountTypeRadios = document.querySelectorAll("input[name=\"account-type\"]");
const termsCheckbox = document.getElementById("terms-checkbox");
const showTermsLink = document.getElementById("show-terms");
const termsModal = document.getElementById("terms-modal");
const closeModalButton = termsModal.querySelector(".close-modal");
const acceptTermsButton = document.getElementById("accept-terms");

// Informações do Usuário Logado
const userNameDisplay = document.getElementById("user-name");
const userProfilePicture = document.getElementById("user-profile-picture");
const profileButton = document.getElementById("profile-button");
const logoutButton = document.getElementById("logout-button");
const adminLogoutButton = document.getElementById("admin-logout-button");

// Navegação Principal
const navMain = document.getElementById("nav-main");
const navHistory = document.getElementById("nav-history");
const navProfile = document.getElementById("nav-profile");
const navSuggestions = document.getElementById("nav-suggestions");
const navPrices = document.getElementById("nav-prices");

// Seções de Conteúdo
const mainSection = document.getElementById("main-section");
const historySection = document.getElementById("history-section");
const profileSection = document.getElementById("profile-section");
const suggestionsSection = document.getElementById("suggestions-section");
const pricesSection = document.getElementById("prices-section");

// Interface do Passageiro
const passengerInterface = document.getElementById("passenger-interface");
const pickupLocationInput = document.getElementById("pickup-location");
const useCurrentLocationButton = document.getElementById("use-current-location");
const locationStatus = document.getElementById("location-status");
const destinationInput = document.getElementById("destination");
const requestRideButton = document.getElementById("request-ride-button");
const nearbyDriversContainer = document.getElementById("nearby-drivers");
const rideStatusContainer = document.getElementById("ride-status");
const statusMessage = document.getElementById("status-message");
const cancelRideButton = document.getElementById("cancel-ride-button");
const whatsappContactContainer = document.getElementById("whatsapp-contact");
const cancelFeedbackModal = document.getElementById("cancel-feedback-container");
const closeFeedbackModalButton = cancelFeedbackModal.querySelector(".close-modal-feedback");
const submitCancelFeedbackButton = document.getElementById("submit-cancel-feedback");
const otherReasonTextarea = document.getElementById("other-reason");
const cancelReasonRadios = document.querySelectorAll("input[name=\"cancel-reason\"]");

// Interface do Mototaxista
const driverInterface = document.getElementById("driver-interface");
const driverStatusSelect = document.getElementById("driver-status");
const ridesListContainer = document.getElementById("rides-list");
const currentRideContainer = document.getElementById("current-ride");
const passengerNameDisplay = document.getElementById("passenger-name");
const ridePickupDisplay = document.getElementById("ride-pickup");
const rideDestinationDisplay = document.getElementById("ride-destination");
const completeRideButton = document.getElementById("complete-ride-button");
const whatsappContactDriverContainer = document.getElementById("whatsapp-contact-driver");
const driverRatingSection = document.getElementById("driver-rating");

// Histórico
const rideHistoryContainer = document.getElementById("ride-history");
const userRatingsHistoryContainer = document.getElementById("user-ratings-history");

// Perfil
const profilePicturePreview = document.getElementById("profile-picture-preview");
const profilePictureInput = document.getElementById("profile-picture");
const saveProfileButton = document.getElementById("save-profile-button");

// Sugestões
const suggestionTitleInput = document.getElementById("suggestion-title");
const suggestionTextInput = document.getElementById("suggestion-text");
const suggestionTypeSelect = document.getElementById("suggestion-type");
const submitSuggestionButton = document.getElementById("submit-suggestion-button");
const suggestionsListContainer = document.getElementById("suggestions-list");

// Tabela de Preços
const priceTableImage = document.getElementById("price-table-image");

// PWA Banner
const pwaBanner = document.getElementById("pwa-banner");
const installPwaButton = document.getElementById("install-pwa");
const closePwaBannerButton = document.getElementById("close-pwa-banner");

// Admin
const adminNavDashboard = document.getElementById("admin-nav-dashboard");
const adminNavUsers = document.getElementById("admin-nav-users");
const adminNavRides = document.getElementById("admin-nav-rides");
const adminNavSuggestions = document.getElementById("admin-nav-suggestions");
const adminNavSettings = document.getElementById("admin-nav-settings");

const adminDashboardSection = document.getElementById("admin-dashboard");
const adminUsersSection = document.getElementById("admin-users");
const adminRidesSection = document.getElementById("admin-rides");
const adminSuggestionsSection = document.getElementById("admin-suggestions");
const adminSettingsSection = document.getElementById("admin-settings");

const totalUsersDisplay = document.getElementById("total-users");
const activeDriversDisplay = document.getElementById("active-drivers");
const ridesTodayDisplay = document.getElementById("rides-today");
const totalRidesDisplay = document.getElementById("total-rides");
const ridesChartContainer = document.getElementById("rides-chart");
const ratingsChartContainer = document.getElementById("ratings-chart");
const activityListContainer = document.getElementById("activity-list");
const usersListContainer = document.getElementById("users-list");
const adminRidesListContainer = document.getElementById("admin-rides-list");
const adminSuggestionsListContainer = document.getElementById("admin-suggestions-list");
const userSearchInput = document.getElementById("user-search");
const userFilterSelect = document.getElementById("user-filter");
const rideSearchInput = document.getElementById("ride-search");
const rideFilterSelect = document.getElementById("ride-filter");
const suggestionSearchInput = document.getElementById("suggestion-search");
const suggestionFilterSelect = document.getElementById("suggestion-filter");
const priceTableUploadInput = document.getElementById("price-table-upload");
const uploadPriceTableButton = document.getElementById("upload-price-table");
const timeoutSettingInput = document.getElementById("timeout-setting");
const saveSettingsButton = document.getElementById("save-settings");

// Variáveis de estado
let currentUser = null;
let currentUserData = null;
let currentRideListener = null;
let ridesListener = null;
let userListener = null;
let rideTimeout = 5; // Padrão, será carregado das configurações
let currentRideIdToCancel = null;
let deferredPrompt = null; // Para PWA install banner

// --- Funções de Autenticação ---

// Monitora o estado de autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData(user.uid);
        if (currentUserData && currentUserData.isAdmin) {
            showAdminSection();
        } else if (currentUserData) {
            showAppSection();
        } else {
            // Caso onde o usuário existe no Auth mas não no Firestore
            console.error("Usuário autenticado mas dados não encontrados no Firestore.");
            showError("Erro ao carregar seus dados. Tente fazer login novamente.");
            auth.signOut();
            showAuthSection();
        }
        loadAppSettings(); // Carrega configurações do app
    } else {
        currentUser = null;
        currentUserData = null;
        showAuthSection();
        clearListeners(); // Limpa listeners ao deslogar
    }
});

// Carrega dados do usuário do Firestore
async function loadUserData(userId) {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (userDoc.exists) {
            currentUserData = { id: userDoc.id, ...userDoc.data() };
            updateUserInfoUI();
            if (!currentUserData.isAdmin) {
                if (currentUserData.accountType === "driver") {
                    setupDriverListeners();
                } else if (currentUserData.accountType === "user") {
                    setupPassengerListeners();
                }
            }
        } else {
            currentUserData = null; // Garante que currentUserData seja null se não encontrar
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        showError("Erro ao carregar seus dados. Tente novamente.");
        currentUserData = null;
    }
}

// Atualiza a interface com informações do usuário
function updateUserInfoUI() {
    if (currentUserData) {
        userNameDisplay.textContent = currentUserData.name || "Usuário";
        userProfilePicture.src = currentUserData.pictureUrl || "icons/default-profile.png";
    }
}

// Login
loginButton.addEventListener("click", async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    if (!email || !password) {
        showError("Preencha email e senha.");
        return;
    }
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged cuidará da transição da UI
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        showError("Email ou senha inválidos.");
    }
});

// Cadastro
registerButton.addEventListener("click", async () => {
    const name = registerName.value;
    const phone = registerPhone.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    const accountTypeRadio = document.querySelector("input[name=\"account-type\"]:checked");
    const accountType = accountTypeRadio ? accountTypeRadio.value : null;

    if (!name || !phone || !email || !password || !accountType) {
        showError("Preencha todos os campos.");
        return;
    }
    if (!termsCheckbox.checked) {
        showError("Você precisa aceitar os termos de uso para se cadastrar.");
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Salva informações adicionais no Firestore
        await db.collection("users").doc(user.uid).set({
            name: name,
            phone: phone,
            email: email,
            accountType: accountType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: accountType === "driver" ? "unavailable" : "active", // Status inicial
            pictureUrl: null,
            averageRating: 0,
            ratingCount: 0,
            blocked: false,
            isAdmin: false // Define isAdmin como false por padrão
        });
        // onAuthStateChanged cuidará da transição da UI
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        if (error.code === "auth/email-already-in-use") {
            showError("Este email já está em uso.");
        } else {
            showError("Erro ao cadastrar. Tente novamente.");
        }
    }
});

// Logout
logoutButton.addEventListener("click", () => {
    auth.signOut();
});

adminLogoutButton.addEventListener("click", () => {
    auth.signOut();
});

// --- Controle de Visibilidade das Seções ---
function showAuthSection() {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    adminSection.classList.add("hidden");
    clearUI();
}

function showAppSection() {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    adminSection.classList.add("hidden");
    if (currentUserData) {
        if (currentUserData.accountType === "driver") {
            driverInterface.classList.remove("hidden");
            passengerInterface.classList.add("hidden");
            driverStatusSelect.value = currentUserData.status || "unavailable";
            loadDriverRating();
        } else {
            passengerInterface.classList.remove("hidden");
            driverInterface.classList.add("hidden");
            checkActiveRide(); // Verifica se há corrida ativa para o passageiro
        }
        setActiveNav("nav-main");
        showContentSection("main-section");
    }
}

function showAdminSection() {
    authSection.classList.add("hidden");
    appSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    setActiveAdminNav("admin-nav-dashboard");
    showAdminContentSection("admin-dashboard");
    loadAdminDashboard();
}

function clearUI() {
    // Limpa campos de formulário, listas, etc.
    loginEmail.value = "";
    loginPassword.value = "";
    registerName.value = "";
    registerPhone.value = "";
    registerEmail.value = "";
    registerPassword.value = "";
    termsCheckbox.checked = false;
    registerButton.disabled = true;
    pickupLocationInput.value = "";
    destinationInput.value = "";
    ridesListContainer.innerHTML =
        '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
    rideHistoryContainer.innerHTML =
        '<p class="empty-message">Nenhuma corrida no histórico.</p>';
    userRatingsHistoryContainer.innerHTML =
        '<p class="empty-message">Nenhuma avaliação recebida.</p>';
    suggestionsListContainer.innerHTML =
        '<p class="empty-message">Nenhuma sugestão enviada.</p>';
    nearbyDriversContainer.innerHTML = "";
    rideStatusContainer.classList.add("hidden");
    currentRideContainer.classList.add("hidden");
    whatsappContactContainer.classList.add("hidden");
    whatsappContactDriverContainer.classList.add("hidden");
    profilePicturePreview.src = "icons/default-profile.png";
    profilePictureInput.value = "";
    suggestionTitleInput.value = "";
    suggestionTextInput.value = "";
    suggestionTypeSelect.value = "improvement";
    // Limpar admin UI
    totalUsersDisplay.textContent = '-';
    activeDriversDisplay.textContent = '-';
    ridesTodayDisplay.textContent = '-';
    totalRidesDisplay.textContent = '-';
    activityListContainer.innerHTML = '';
    usersListContainer.innerHTML = '';
    adminRidesListContainer.innerHTML = '';
    adminSuggestionsListContainer.innerHTML = '';
    userSearchInput.value = '';
    rideSearchInput.value = '';
    suggestionSearchInput.value = '';
    priceTableUploadInput.value = '';
    timeoutSettingInput.value = '5';
}

// --- Navegação e Tabs ---
loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
});

registerTab.addEventListener("click", () => {
    loginTab.classList.remove("active");
    registerTab.classList.add("active");
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
});

// Habilita/desabilita botão de cadastro baseado no aceite dos termos
termsCheckbox.addEventListener("change", () => {
    registerButton.disabled = !termsCheckbox.checked;
});

// Lógica do Modal de Termos de Uso
showTermsLink.addEventListener("click", (e) => {
    e.preventDefault();
    termsModal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
    termsModal.classList.add("hidden");
});

acceptTermsButton.addEventListener("click", () => {
    termsCheckbox.checked = true;
    registerButton.disabled = false;
    termsModal.classList.add("hidden");
});

// Navegação principal do app
const navButtons = document.querySelectorAll(".main-nav .nav-button");
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetSectionId = button.id.replace("nav-", "") + "-section";
        setActiveNav(button.id);
        showContentSection(targetSectionId);

        // Carrega dados específicos da seção
        if (targetSectionId === "history-section") {
            loadRideHistory();
            loadUserRatingsHistory();
        } else if (targetSectionId === "suggestions-section") {
            loadUserSuggestions();
        } else if (targetSectionId === "prices-section") {
            loadPriceTable();
        } else if (targetSectionId === "profile-section") {
            loadProfileData();
        }
    });
});

function setActiveNav(activeButtonId) {
    navButtons.forEach(button => {
        button.classList.toggle("active", button.id === activeButtonId);
    });
}

function showContentSection(sectionId) {
    const contentSections = document.querySelectorAll(".app-section .content-section");
    contentSections.forEach(section => {
        section.classList.toggle("hidden", section.id !== sectionId);
    });
}

// --- Funcionalidades do Passageiro ---

// Botão "Usar minha localização atual"
useCurrentLocationButton.addEventListener("click", async () => {
    locationStatus.textContent = "Obtendo localização...";
    locationStatus.classList.remove("hidden");
    try {
        const position = await geoService.getCurrentPosition();
        const address = await geoService.reverseGeocode(position.latitude, position.longitude);
        pickupLocationInput.value = address;
        locationStatus.textContent = "Localização obtida!";
        setTimeout(() => locationStatus.classList.add("hidden"), 3000);
    } catch (error) {
        console.error("Erro ao obter localização:", error);
        showError(error.message || "Não foi possível obter sua localização.");
        locationStatus.textContent = "Erro ao obter localização.";
        locationStatus.classList.remove("hidden");
        setTimeout(() => locationStatus.classList.add("hidden"), 3000);
    }
});

// Solicitar corrida
requestRideButton.addEventListener("click", async () => {
    const pickupLocation = pickupLocationInput.value;
    const destination = destinationInput.value;

    if (!pickupLocation || !destination) {
        showError("Preencha os locais de partida e destino.");
        return;
    }

    if (!currentUser || !currentUserData) {
        showError("Erro: Usuário não autenticado.");
        return;
    }

    // Verifica se já existe uma corrida ativa
    const activeRide = await checkActiveRide(false); // Não mostra erro se não houver
    if (activeRide) {
        showError("Você já possui uma corrida em andamento.");
        return;
    }

    try {
        let pickupCoords = null;
        // Tenta obter coordenadas se a localização atual foi usada
        if (geoService.currentPosition && pickupLocationInput.value.includes(geoService.currentPosition.latitude.toFixed(5))) { // Verifica se o endereço contém as coordenadas
             pickupCoords = {
                latitude: geoService.currentPosition.latitude,
                longitude: geoService.currentPosition.longitude
            };
        } // Futuramente, adicionar geocodificação para endereços digitados

        const rideData = {
            passengerId: currentUser.uid,
            passengerName: currentUserData.name || "Passageiro",
            passengerPhone: currentUserData.phone || null,
            passengerPictureUrl: currentUserData.pictureUrl || null, // Corrigido
            pickupLocation: pickupLocation,
            destination: destination,
            pickupCoords: pickupCoords, // Pode ser null
            status: "pending", // pending, accepted, completed, cancelled
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            driverId: null,
            driverName: null,
            driverPhone: null,
            driverPictureUrl: null,
            acceptedAt: null,
            completedAt: null,
            cancelledAt: null,
            cancelReason: null,
            passengerRating: null,
            driverRating: null
        };

        const rideRef = await db.collection("rides").add(rideData);
        showRideStatus("pending", rideRef.id);
        monitorRideStatus(rideRef.id);

        // Inicia timeout para cancelamento automático
        startRideTimeout(rideRef.id);

    } catch (error) {
        console.error("Erro ao solicitar corrida:", error);
        // Verifica se o erro é de dados inválidos (como undefined)
        if (error.message && error.message.includes("invalid data")) {
             showError("Erro ao solicitar corrida: Verifique se seus dados de perfil (nome, telefone) estão completos.");
        } else {
            showError(`Erro ao solicitar corrida: ${error.message}`);
        }
    }
});

// Monitora o status da corrida solicitada
function monitorRideStatus(rideId) {
    if (currentRideListener) {
        currentRideListener(); // Cancela listener anterior
    }
    currentRideListener = db.collection("rides").doc(rideId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const rideData = doc.data();
                showRideStatus(rideData.status, rideId, rideData);
            } else {
                // Corrida foi deletada ou não existe mais
                showRideStatus("cancelled");
                if (currentRideListener) currentRideListener();
                currentRideListener = null;
            }
        }, (error) => {
            console.error("Erro ao monitorar status da corrida:", error);
            showError("Erro ao atualizar status da corrida.");
            if (currentRideListener) currentRideListener();
            currentRideListener = null;
        });
}

// Exibe o status atual da corrida para o passageiro
function showRideStatus(status, rideId = null, rideData = null) {
    rideStatusContainer.classList.remove("hidden");
    requestRideButton.disabled = true;
    cancelRideButton.dataset.rideId = rideId;
    whatsappContactContainer.classList.add("hidden"); // Esconde por padrão

    switch (status) {
        case "pending":
            statusMessage.textContent = "Procurando mototaxistas próximos...";
            cancelRideButton.classList.remove("hidden");
            break;
        case "accepted":
            statusMessage.textContent = `Mototaxista ${rideData?.driverName || ''} a caminho!`;
            cancelRideButton.classList.remove("hidden"); // Ainda pode cancelar?
            showWhatsAppContact(rideData?.driverPhone, whatsappContactContainer);
            break;
        case "completed":
            statusMessage.textContent = "Corrida finalizada! Obrigado por usar Oops Transportes.";
            cancelRideButton.classList.add("hidden");
            rideStatusContainer.classList.add("hidden"); // Esconde status após completar
            requestRideButton.disabled = false;
            if (currentRideListener) currentRideListener();
            currentRideListener = null;
            // Abrir modal de avaliação
            if (rideId && !rideData?.passengerRating) {
                showRatingModal(rideId, rideData.driverId, "driver");
            }
            break;
        case "cancelled":
            statusMessage.textContent = "Corrida cancelada.";
            cancelRideButton.classList.add("hidden");
            rideStatusContainer.classList.add("hidden"); // Esconde status após cancelar
            requestRideButton.disabled = false;
            if (currentRideListener) currentRideListener();
            currentRideListener = null;
            break;
        default:
            rideStatusContainer.classList.add("hidden");
            requestRideButton.disabled = false;
            if (currentRideListener) currentRideListener();
            currentRideListener = null;
    }
}

// Verifica se o passageiro tem uma corrida ativa ao carregar
async function checkActiveRide(showErrorMsg = true) {
    if (!currentUser) return null;
    try {
        const ridesRef = db.collection("rides");
        const query = ridesRef
            .where("passengerId", "==", currentUser.uid)
            .where("status", "in", ["pending", "accepted"])
            .orderBy("createdAt", "desc")
            .limit(1);

        const snapshot = await query.get();

        if (!snapshot.empty) {
            const rideDoc = snapshot.docs[0];
            const rideData = rideDoc.data();
            // Verifica se a corrida não é muito antiga (ex: mais de 2 horas)
            const twoHoursAgo = firebase.firestore.Timestamp.now().seconds - (2 * 60 * 60);
            if (rideData.createdAt && rideData.createdAt.seconds > twoHoursAgo) {
                 showRideStatus(rideData.status, rideDoc.id, rideData);
                 monitorRideStatus(rideDoc.id);
                 return rideDoc.id;
            } else {
                // Cancela corrida antiga
                await db.collection("rides").doc(rideDoc.id).update({ 
                    status: "cancelled", 
                    cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                    cancelReason: "Timeout automático (corrida antiga)"
                });
                return null;
            }
        } else {
            showRideStatus(null); // Esconde container de status
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar corrida ativa:", error);
        if (showErrorMsg) showError("Erro ao verificar status da corrida.");
        return null;
    }
}

// Cancela a corrida (pelo passageiro)
cancelRideButton.addEventListener("click", () => {
    currentRideIdToCancel = cancelRideButton.dataset.rideId;
    if (!currentRideIdToCancel) return;

    // Limpa seleções anteriores e esconde textarea
    cancelReasonRadios.forEach(radio => radio.checked = false);
    otherReasonTextarea.classList.add('hidden');
    otherReasonTextarea.value = '';

    cancelFeedbackModal.classList.remove("hidden");
});

closeFeedbackModalButton.addEventListener("click", () => {
    cancelFeedbackModal.classList.add("hidden");
    currentRideIdToCancel = null;
});

// Mostra/esconde textarea para "Outro motivo"
cancelReasonRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'other' && radio.checked) {
            otherReasonTextarea.classList.remove('hidden');
        } else {
            otherReasonTextarea.classList.add('hidden');
        }
    });
});

submitCancelFeedbackButton.addEventListener("click", async () => {
    if (!currentRideIdToCancel) return;

    const selectedReasonRadio = document.querySelector("input[name=\"cancel-reason\"]:checked");
    let cancelReason = selectedReasonRadio ? selectedReasonRadio.value : "Não especificado";

    if (cancelReason === "other") {
        cancelReason = otherReasonTextarea.value.trim() || "Outro motivo (não especificado)";
    }

    if (!selectedReasonRadio && cancelReason === "Não especificado") {
        showError("Por favor, selecione um motivo para o cancelamento.");
        return;
    }

    try {
        await db.collection("rides").doc(currentRideIdToCancel).update({
            status: "cancelled",
            cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
            cancelReason: cancelReason
        });
        showRideStatus("cancelled");
        cancelFeedbackModal.classList.add("hidden");
        currentRideIdToCancel = null;
    } catch (error) {
        console.error("Erro ao cancelar corrida:", error);
        showError("Erro ao cancelar a corrida. Tente novamente.");
    }
});

// Inicia timeout para cancelamento automático
function startRideTimeout(rideId) {
    setTimeout(async () => {
        try {
            const rideDoc = await db.collection("rides").doc(rideId).get();
            if (rideDoc.exists && rideDoc.data().status === "pending") {
                await db.collection("rides").doc(rideId).update({
                    status: "cancelled",
                    cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                    cancelReason: "Timeout (nenhum mototaxista aceitou)"
                });
                console.log(`Corrida ${rideId} cancelada por timeout.`);
                // A atualização via onSnapshot deve cuidar da UI
            }
        } catch (error) {
            console.error("Erro no timeout da corrida:", error);
        }
    }, rideTimeout * 60 * 1000); // Converte minutos para milissegundos
}

// --- Funcionalidades do Mototaxista ---

// Atualiza status do mototaxista
driverStatusSelect.addEventListener("change", async () => {
    if (!currentUser) return;
    const newStatus = driverStatusSelect.value;
    try {
        await db.collection("users").doc(currentUser.uid).update({ status: newStatus });
        currentUserData.status = newStatus; // Atualiza localmente
        if (newStatus === "available") {
            startListeningForRides();
            startLocationUpdates(); // Começa a enviar localização
        } else {
            stopListeningForRides();
            stopLocationUpdates(); // Para de enviar localização
        }
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        showError("Erro ao atualizar seu status.");
        // Reverte a seleção em caso de erro
        driverStatusSelect.value = currentUserData.status;
    }
});

// Começa a ouvir por corridas disponíveis
function startListeningForRides() {
    if (ridesListener) {
        ridesListener(); // Cancela listener anterior
    }
    if (currentUserData?.status !== 'available') {
        ridesListContainer.innerHTML =
            '<p class="empty-message">Você está indisponível. Mude seu status para ver corridas.</p>';
        return;
    }
    
    ridesListContainer.innerHTML = '<p class="loading-message">Procurando corridas...</p>';
    
    const ridesRef = db.collection("rides");
    ridesListener = ridesRef
        .where("status", "==", "pending")
        .orderBy("createdAt", "asc") // Pega as mais antigas primeiro
        .onSnapshot((snapshot) => {
            const rides = [];
            snapshot.forEach((doc) => {
                rides.push({ id: doc.id, ...doc.data() });
            });
            displayAvailableRides(rides);
        }, (error) => {
            console.error("Erro ao monitorar corridas disponíveis:", error);
            ridesListContainer.innerHTML =
                '<p class="error-message">Erro ao carregar corridas. Tente novamente.</p>';
        });
}

// Para de ouvir por corridas
function stopListeningForRides() {
    if (ridesListener) {
        ridesListener();
        ridesListener = null;
    }
    ridesListContainer.innerHTML =
        '<p class="empty-message">Você está indisponível. Mude seu status para ver corridas.</p>';
}

// Exibe as corridas disponíveis para o mototaxista
function displayAvailableRides(rides) {
    ridesListContainer.innerHTML = ""; // Limpa a lista
    if (rides.length === 0) {
        ridesListContainer.innerHTML =
            '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
        return;
    }

    rides.forEach(ride => {
        const rideElement = document.createElement("div");
        rideElement.classList.add("ride-item");

        const createdAt = ride.createdAt ? ride.createdAt.toDate().toLocaleTimeString("pt-BR") : "N/A";

        rideElement.innerHTML = `
            <div class="ride-header">
                <strong>Passageiro:</strong> ${ride.passengerName || "Desconhecido"}
                <span class="ride-time">Solicitada às ${createdAt}</span>
            </div>
            <div class="ride-locations">
                <p><strong>Partida:</strong> ${ride.pickupLocation || 'N/A'}</p>
                <p><strong>Destino:</strong> ${ride.destination || 'N/A'}</p>
            </div>
            <div class="ride-buttons">
                <button class="primary-button accept-ride-button" data-ride-id="${ride.id}">Aceitar</button>
                <button class="secondary-button reject-ride-button" data-ride-id="${ride.id}">Recusar</button>
            </div>
        `;
        ridesListContainer.appendChild(rideElement);
    });

    // Adiciona listeners aos botões de aceitar/recusar
    document.querySelectorAll(".accept-ride-button").forEach(button => {
        button.addEventListener("click", () => acceptRide(button.dataset.rideId));
    });
    document.querySelectorAll(".reject-ride-button").forEach(button => {
        button.addEventListener("click", () => rejectRide(button.dataset.rideId));
    });
}

// Aceita uma corrida
async function acceptRide(rideId) {
    if (!currentUser || !currentUserData || currentUserData.status !== "available") {
        showError("Você precisa estar disponível para aceitar corridas.");
        return;
    }

    // Verifica se o motorista já tem uma corrida ativa
    const activeRide = await checkDriverActiveRide(false);
    if (activeRide) {
        showError("Você já está em uma corrida.");
        return;
    }

    try {
        const rideRef = db.collection("rides").doc(rideId);
        await db.runTransaction(async (transaction) => {
            const rideDoc = await transaction.get(rideRef);
            if (!rideDoc.exists) {
                throw new Error("Corrida não encontrada.");
            }
            const rideData = rideDoc.data();
            if (rideData.status !== "pending") {
                throw new Error("Esta corrida não está mais disponível.");
            }
            transaction.update(rideRef, {
                status: "accepted",
                driverId: currentUser.uid,
                driverName: currentUserData.name || "Mototaxista",
                driverPhone: currentUserData.phone || null,
                driverPictureUrl: currentUserData.pictureUrl || null,
                acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        // Atualiza UI do motorista
        showCurrentRide(rideId);
        stopListeningForRides(); // Para de ouvir novas corridas
        stopLocationUpdates(); // Para de enviar localização como disponível

    } catch (error) {
        console.error("Erro ao aceitar corrida:", error);
        showError(error.message || "Erro ao aceitar a corrida.");
        // Recarrega a lista caso a corrida não esteja mais disponível
        if (currentUserData.status === "available") {
             startListeningForRides();
        }
    }
}

// Recusa uma corrida (opcional, pode apenas não aceitar)
async function rejectRide(rideId) {
    console.log(`Corrida ${rideId} recusada (ou ignorada).`);
    // Remove o item da UI para dar feedback visual
    const rideItem = ridesListContainer.querySelector(`button[data-ride-id="${rideId}"]`)?.closest('.ride-item');
    if (rideItem) {
        rideItem.remove();
    }
    if (ridesListContainer.children.length === 0) {
         ridesListContainer.innerHTML =
            '<p class="empty-message">Nenhuma corrida disponível no momento.</p>';
    }
}

// Exibe a corrida atual para o mototaxista
async function showCurrentRide(rideId) {
    try {
        const rideDoc = await db.collection("rides").doc(rideId).get();
        if (rideDoc.exists) {
            const rideData = rideDoc.data();
            passengerNameDisplay.textContent = rideData.passengerName || "N/A";
            ridePickupDisplay.textContent = rideData.pickupLocation || "N/A";
            rideDestinationDisplay.textContent = rideData.destination || "N/A";
            completeRideButton.dataset.rideId = rideId;
            currentRideContainer.classList.remove("hidden");
            ridesListContainer.parentElement.classList.add("hidden"); // Esconde lista de disponíveis
            showWhatsAppContact(rideData.passengerPhone, whatsappContactDriverContainer);
        } else {
            console.warn("Corrida atual não encontrada para exibição.");
            currentRideContainer.classList.add("hidden");
            ridesListContainer.parentElement.classList.remove("hidden");
            whatsappContactDriverContainer.classList.add("hidden");
        }
    } catch (error) {
        console.error("Erro ao exibir corrida atual:", error);
        showError("Erro ao carregar detalhes da corrida atual.");
    }
}

// Verifica se o mototaxista tem uma corrida ativa ao carregar
async function checkDriverActiveRide(showErrorMsg = true) {
    if (!currentUser) return null;
    try {
        const ridesRef = db.collection("rides");
        const query = ridesRef
            .where("driverId", "==", currentUser.uid)
            .where("status", "==", "accepted")
            .orderBy("acceptedAt", "desc")
            .limit(1);

        const snapshot = await query.get();

        if (!snapshot.empty) {
            const rideDoc = snapshot.docs[0];
            showCurrentRide(rideDoc.id);
            return rideDoc.id;
        } else {
            currentRideContainer.classList.add("hidden");
            ridesListContainer.parentElement.classList.remove("hidden");
            whatsappContactDriverContainer.classList.add("hidden");
            // Se estiver disponível, começa a ouvir por corridas
            if (currentUserData?.status === "available") {
                startListeningForRides();
            }
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar corrida ativa do motorista:", error);
        if (showErrorMsg) showError("Erro ao verificar status da corrida.");
        return null;
    }
}

// Finaliza a corrida
completeRideButton.addEventListener("click", async () => {
    const rideId = completeRideButton.dataset.rideId;
    if (!rideId) return;

    try {
        await db.collection("rides").doc(rideId).update({
            status: "completed",
            completedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        currentRideContainer.classList.add("hidden");
        ridesListContainer.parentElement.classList.remove("hidden");
        whatsappContactDriverContainer.classList.add("hidden");
        // Se estiver disponível, volta a ouvir por corridas
        if (currentUserData?.status === "available") {
            startListeningForRides();
            startLocationUpdates(); // Volta a enviar localização
        }

        // Abrir modal de avaliação
        const rideDoc = await db.collection("rides").doc(rideId).get();
        if (rideDoc.exists && !rideDoc.data().driverRating) {
            showRatingModal(rideId, rideDoc.data().passengerId, "passenger");
        }

    } catch (error) {
        console.error("Erro ao finalizar corrida:", error);
        showError("Erro ao finalizar a corrida. Tente novamente.");
    }
});

// Envio de localização do mototaxista disponível
let locationUpdateInterval = null;
function startLocationUpdates() {
    if (locationUpdateInterval) clearInterval(locationUpdateInterval);

    const updateLocation = async () => {
        if (currentUserData?.status !== "available") {
            stopLocationUpdates();
            return;
        }
        try {
            const position = await geoService.getCurrentPosition();
            await db.collection("users").doc(currentUser.uid).update({
                lastLocation: new firebase.firestore.GeoPoint(position.latitude, position.longitude),
                lastLocationUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
            // console.log("Localização do motorista atualizada.");
        } catch (error) {
            // Não mostra erro para o usuário, apenas loga
            console.warn("Não foi possível atualizar a localização do motorista:", error.message);
        }
    };

    updateLocation(); // Atualiza imediatamente
    locationUpdateInterval = setInterval(updateLocation, 60 * 1000); // Atualiza a cada 60 segundos
}

function stopLocationUpdates() {
    if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        locationUpdateInterval = null;
    }
}

// Carrega e exibe a avaliação média do motorista
async function loadDriverRating() {
    if (!currentUser) return;
    try {
        const { averageRating, ratingCount } = await ratingService.getUserAverageRating(currentUser.uid);
        driverRatingSection.innerHTML = `
            <h3>Sua Avaliação Média</h3>
            <div class="average-rating">
                <span class="rating-stars">${ratingService.formatRatingStars(averageRating)}</span>
                <span class="rating-value">${averageRating.toFixed(1)}</span>
                <span class="rating-count">(${ratingCount} avaliações)</span>
            </div>
        `;
    } catch (error) {
        console.error("Erro ao carregar avaliação do motorista:", error);
        driverRatingSection.innerHTML = `<p class="error-message">Erro ao carregar sua avaliação.</p>`;
    }
}

// --- Histórico ---
async function loadRideHistory() {
    if (!currentUser) return;
    rideHistoryContainer.innerHTML =
        '<p class="loading-message">Carregando histórico...</p>';
    try {
        const ridesRef = db.collection("rides");
        let query;

        if (currentUserData.accountType === "user") {
            query = ridesRef.where("passengerId", "==", currentUser.uid);
        } else {
            query = ridesRef.where("driverId", "==", currentUser.uid);
        }

        const snapshot = await query
            .where("status", "in", ["completed", "cancelled"])
            .orderBy("createdAt", "desc")
            .limit(20) // Limita a 20 itens por performance
            .get();

        if (snapshot.empty) {
            rideHistoryContainer.innerHTML =
                '<p class="empty-message">Nenhuma corrida no histórico.</p>';
            return;
        }

        rideHistoryContainer.innerHTML = ""; // Limpa
        snapshot.forEach(doc => {
            const ride = doc.data();
            const rideElement = document.createElement("div");
            rideElement.classList.add("history-item");

            const date = ride.createdAt ? ride.createdAt.toDate().toLocaleDateString("pt-BR") : "N/A";
            const statusClass = ride.status === "completed" ? "status-completed" : "status-cancelled";
            const statusText = ride.status === "completed" ? "Concluída" : "Cancelada";

            let otherUserName = "";
            let ratingGiven = null;
            if (currentUserData.accountType === "user") {
                otherUserName = ride.driverName || "Mototaxista";
                ratingGiven = ride.passengerRating;
            } else {
                otherUserName = ride.passengerName || "Passageiro";
                ratingGiven = ride.driverRating;
            }

            rideElement.innerHTML = `
                <div class="history-header">
                    <span class="history-date">${date}</span>
                    <span class="history-status ${statusClass}">${statusText}</span>
                </div>
                <div class="history-details">
                    <p><strong>${currentUserData.accountType === "user" ? "Mototaxista" : "Passageiro"}:</strong> ${otherUserName}</p>
                    <p><strong>Partida:</strong> ${ride.pickupLocation || 'N/A'}</p>
                    <p><strong>Destino:</strong> ${ride.destination || 'N/A'}</p>
                    ${ride.status === 'cancelled' && ride.cancelReason ? `<p><strong>Motivo Cancel.:</strong> ${ride.cancelReason}</p>` : ''}
                </div>
                ${ride.status === 'completed' ? `
                <div class="history-rating">
                    ${ratingGiven ?
                        `<span>Sua Avaliação: <span class="rating-stars">${ratingService.formatRatingStars(ratingGiven)}</span></span>` :
                        `<button class="secondary-button rate-ride-button" data-ride-id="${doc.id}" data-user-to-rate="${currentUserData.accountType === 'user' ? ride.driverId : ride.passengerId}" data-user-type-to-rate="${currentUserData.accountType === 'user' ? 'driver' : 'passenger'}">Avaliar</button>`
                    }
                </div>` : ''}
            `;
            rideHistoryContainer.appendChild(rideElement);
        });

        // Adiciona listeners aos botões de avaliar
        document.querySelectorAll(".rate-ride-button").forEach(button => {
            button.addEventListener("click", () => {
                showRatingModal(button.dataset.rideId, button.dataset.userToRate, button.dataset.userTypeToRate);
            });
        });

    } catch (error) {
        console.error("Erro ao carregar histórico de corridas:", error);
        rideHistoryContainer.innerHTML =
            '<p class="error-message">Erro ao carregar histórico.</p>';
    }
}

// Carrega histórico de avaliações recebidas
async function loadUserRatingsHistory() {
    if (!currentUser) return;
    userRatingsHistoryContainer.innerHTML =
        '<p class="loading-message">Carregando avaliações...</p>';
    try {
        const ratings = await ratingService.getUserRatings(currentUser.uid);

        if (ratings.length === 0) {
            userRatingsHistoryContainer.innerHTML =
                '<p class="empty-message">Nenhuma avaliação recebida.</p>';
            return;
        }

        userRatingsHistoryContainer.innerHTML = ""; // Limpa

        // Carrega nomes dos avaliadores
        const userIds = ratings.map(r => r.fromUserId);
        const uniqueUserIds = [...new Set(userIds)];
        const userDocs = await Promise.all(uniqueUserIds.map(id => db.collection('users').doc(id).get()));
        const userNames = {};
        userDocs.forEach(doc => {
            if (doc.exists) {
                userNames[doc.id] = doc.data().name || "Usuário Anônimo";
            }
        });

        ratings.forEach(rating => {
            const ratingElement = document.createElement("div");
            ratingElement.classList.add("rating-item");
            const date = rating.createdAt ? rating.createdAt.toDate().toLocaleDateString("pt-BR") : "N/A";
            const authorName = userNames[rating.fromUserId] || "Usuário Anônimo";

            ratingElement.innerHTML = `
                <div class="rating-header">
                    <span class="rating-author">${authorName}</span>
                    <span class="rating-date">${date}</span>
                </div>
                <div class="rating-body">
                    <span class="rating-stars">${ratingService.formatRatingStars(rating.rating)}</span>
                    ${rating.comment ? `<p class="rating-comment">"${rating.comment}"</p>` : ''}
                </div>
            `;
            userRatingsHistoryContainer.appendChild(ratingElement);
        });

    } catch (error) {
        console.error("Erro ao carregar histórico de avaliações:", error);
        userRatingsHistoryContainer.innerHTML =
            '<p class="error-message">Erro ao carregar avaliações.</p>';
    }
}

// --- Perfil ---
profileButton.addEventListener("click", () => {
    setActiveNav("nav-profile");
    showContentSection("profile-section");
    loadProfileData();
});

navProfile.addEventListener("click", () => {
    loadProfileData();
});

function loadProfileData() {
    if (currentUserData) {
        profilePicturePreview.src = currentUserData.pictureUrl || "icons/default-profile.png";
    }
}

// Seleciona a foto de perfil
profilePictureInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicturePreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Salva alterações no perfil (apenas foto)
saveProfileButton.addEventListener("click", async () => {
    const file = profilePictureInput.files[0];
    if (!file) {
        showError("Selecione uma foto para fazer upload.");
        return;
    }

    if (!currentUser) return;

    try {
        // Faz upload da imagem para o Firebase Storage
        const filePath = `profile_pictures/${currentUser.uid}/${file.name}`;
        const fileRef = storage.ref().child(filePath);
        const uploadTask = await fileRef.put(file);
        const pictureUrl = await uploadTask.ref.getDownloadURL();

        // Atualiza a URL da foto no Firestore
        await db.collection("users").doc(currentUser.uid).update({
            pictureUrl: pictureUrl
        });

        // Atualiza localmente e na UI
        currentUserData.pictureUrl = pictureUrl;
        updateUserInfoUI();
        profilePicturePreview.src = pictureUrl;

        showSuccess("Foto de perfil atualizada com sucesso!");

    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        showError("Erro ao atualizar a foto de perfil.");
    }
});

// --- Sugestões ---
submitSuggestionButton.addEventListener("click", async () => {
    const title = suggestionTitleInput.value;
    const text = suggestionTextInput.value;
    const type = suggestionTypeSelect.value;

    if (!title || !text) {
        showError("Preencha o título e a descrição da sugestão.");
        return;
    }

    if (!currentUser || !currentUserData) {
        showError("Erro: Usuário não autenticado.");
        return;
    }

    try {
        await db.collection("suggestions").add({
            userId: currentUser.uid,
            userName: currentUserData.name,
            title: title,
            text: text,
            type: type,
            status: "pending", // pending, approved, rejected, implemented
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showSuccess("Sugestão enviada com sucesso!");
        suggestionTitleInput.value = "";
        suggestionTextInput.value = "";
        loadUserSuggestions(); // Recarrega a lista

    } catch (error) {
        console.error("Erro ao enviar sugestão:", error);
        showError("Erro ao enviar sugestão. Tente novamente.");
    }
});

// Carrega sugestões enviadas pelo usuário
async function loadUserSuggestions() {
    if (!currentUser) return;
    suggestionsListContainer.innerHTML =
        '<p class="loading-message">Carregando sugestões...</p>';
    try {
        const suggestionsRef = db.collection("suggestions");
        const query = suggestionsRef
            .where("userId", "==", currentUser.uid)
            .orderBy("createdAt", "desc")
            .limit(20);

        const snapshot = await query.get();

        if (snapshot.empty) {
            suggestionsListContainer.innerHTML =
                '<p class="empty-message">Nenhuma sugestão enviada ainda.</p>';
            return;
        }

        suggestionsListContainer.innerHTML = ""; // Limpa
        snapshot.forEach(doc => {
            const suggestion = doc.data();
            const suggestionElement = document.createElement("div");
            suggestionElement.classList.add("suggestion-item");

            const date = suggestion.createdAt ? suggestion.createdAt.toDate().toLocaleDateString("pt-BR") : "N/A";
            const statusClass = `status-${suggestion.status}`;
            const statusText = suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1);

            suggestionElement.innerHTML = `
                <div class="suggestion-header">
                    <strong>${suggestion.title || 'Sem título'}</strong>
                    <span class="suggestion-date">${date}</span>
                </div>
                <p class="suggestion-text">${suggestion.text || 'Sem texto'}</p>
                <div class="suggestion-footer">
                    <span class="suggestion-type">${suggestion.type || 'N/A'}</span>
                    <span class="suggestion-status ${statusClass}">${statusText}</span>
                </div>
            `;
            suggestionsListContainer.appendChild(suggestionElement);
        });

    } catch (error) {
        console.error("Erro ao carregar sugestões:", error);
        suggestionsListContainer.innerHTML =
            '<p class="error-message">Erro ao carregar suas sugestões.</p>';
    }
}

// --- Tabela de Preços ---
async function loadPriceTable() {
    priceTableImage.parentElement.classList.add('hidden'); // Esconde por padrão
    priceTableImage.src = ''; // Limpa imagem anterior
    try {
        const imageUrl = await adminService.getPriceTableUrl();
        if (imageUrl) {
            priceTableImage.src = imageUrl;
            priceTableImage.alt = "Tabela de preços";
            priceTableImage.parentElement.classList.remove('hidden');
        } else {
            priceTableImage.alt = "Tabela de preços não disponível";
            // Mantém escondido
        }
    } catch (error) {
        console.error("Erro ao carregar tabela de preços:", error);
        priceTableImage.alt = "Erro ao carregar tabela de preços";
        // Mantém escondido
    }
}

// --- Avaliação (Modal) ---
function showRatingModal(rideId, userToRateId, userTypeToRate) {
    // Fecha modal anterior se existir
    closeRatingModal();
    
    // Cria o modal dinamicamente
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'rating-modal';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const userTypeText = userTypeToRate === 'driver' ? 'mototaxista' : 'passageiro';

    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeRatingModal()">&times;</span>
        <h2>Avaliar ${userTypeText}</h2>
        <p>Como foi sua experiência nesta corrida?</p>
        <div class="rating-stars-input">
            ${[1, 2, 3, 4, 5].map(star =>
                `<span class="star" data-value="${star}">☆</span>`
            ).join('')}
        </div>
        <input type="hidden" id="rating-value" value="0">
        <div class="form-group">
            <label for="rating-comment">Comentário (opcional)</label>
            <textarea id="rating-comment" rows="3" placeholder="Deixe um comentário..."></textarea>
        </div>
        <button id="submit-rating-button" class="primary-button">Enviar Avaliação</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Adiciona listeners para as estrelas
    const stars = modal.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            document.getElementById('rating-value').value = value;
            stars.forEach((s, index) => {
                s.textContent = index < value ? '★' : '☆';
            });
        });
    });

    // Adiciona listener para o botão de submit
    document.getElementById('submit-rating-button').addEventListener('click', async () => {
        const rating = parseInt(document.getElementById('rating-value').value);
        const comment = document.getElementById('rating-comment').value;

        if (rating === 0) {
            showError("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
            return;
        }

        try {
            await ratingService.addRating({
                rideId: rideId,
                fromUserId: currentUser.uid,
                toUserId: userToRateId,
                rating: rating,
                comment: comment || null
            });
            showSuccess("Avaliação enviada com sucesso!");
            closeRatingModal();
            loadRideHistory(); // Recarrega o histórico para mostrar que foi avaliado
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            showError(error.message || "Erro ao enviar avaliação.");
        }
    });
}

function closeRatingModal() {
    const modal = document.getElementById('rating-modal');
    if (modal) {
        modal.remove();
    }
}

// --- WhatsApp --- 
function showWhatsAppContact(phoneNumber, container) {
    if (!phoneNumber) {
        container.classList.add("hidden");
        return;
    }
    // Formata o número para o link do WhatsApp (remove caracteres não numéricos)
    const whatsappNumber = phoneNumber.replace(/\D/g, '');
    // Adiciona o código do país (55 para Brasil) se não estiver presente
    const formattedNumber = whatsappNumber.startsWith('55') ? whatsappNumber : `55${whatsappNumber}`;

    container.innerHTML = `
        <a href="https://wa.me/${formattedNumber}" target="_blank" class="whatsapp-button">
            <img src="icons/whatsapp.png" alt="WhatsApp">
            Entrar em contato
        </a>
    `;
    container.classList.remove("hidden");
}

// --- Funções Auxiliares ---
function showError(message) {
    // Implementar uma forma mais visual de mostrar erros (ex: toast notification)
    console.error("Erro:", message);
    alert(`Erro: ${message}`);
}

function showSuccess(message) {
    // Implementar uma forma mais visual de mostrar sucesso
    console.log("Sucesso:", message);
    alert(`Sucesso: ${message}`);
}

// Limpa listeners do Firestore para evitar memory leaks
function clearListeners() {
    if (currentRideListener) {
        currentRideListener();
        currentRideListener = null;
    }
    if (ridesListener) {
        ridesListener();
        ridesListener = null;
    }
    if (userListener) {
        userListener();
        userListener = null;
    }
    stopLocationUpdates();
}

// Configura listeners específicos para passageiros
function setupPassengerListeners() {
    // Listener para dados do usuário (ex: atualizações de perfil feitas pelo admin)
    if (userListener) userListener();
    userListener = db.collection("users").doc(currentUser.uid).onSnapshot(doc => {
        if (doc.exists) {
            currentUserData = { id: doc.id, ...doc.data() };
            updateUserInfoUI();
            // Verifica se foi bloqueado
            if (currentUserData.blocked) {
                showError("Sua conta foi bloqueada. Entre em contato com o suporte.");
                auth.signOut();
            }
        }
    }, error => {
        console.error("Erro no listener de usuário (passageiro):", error);
    });
    checkActiveRide();
}

// Configura listeners específicos para motoristas
function setupDriverListeners() {
    // Listener para dados do usuário
    if (userListener) userListener();
    userListener = db.collection("users").doc(currentUser.uid).onSnapshot(doc => {
        if (doc.exists) {
            const oldStatus = currentUserData?.status;
            currentUserData = { id: doc.id, ...doc.data() };
            updateUserInfoUI();
            driverStatusSelect.value = currentUserData.status || "unavailable";
            // Se o status mudou (ex: admin alterou), ajusta listeners
            if (oldStatus !== currentUserData.status) {
                 if (currentUserData.status === "available") {
                    startListeningForRides();
                    startLocationUpdates();
                } else {
                    stopListeningForRides();
                    stopLocationUpdates();
                }
            }
            // Verifica se foi bloqueado
            if (currentUserData.blocked) {
                showError("Sua conta foi bloqueada. Entre em contato com o suporte.");
                auth.signOut();
            }
        }
    }, error => {
        console.error("Erro no listener de usuário (motorista):", error);
    });
    checkDriverActiveRide();
}

// Carrega configurações do app (ex: timeout)
async function loadAppSettings() {
    try {
        const settings = await adminService.getSettings();
        rideTimeout = settings.rideTimeout || 5; // Usa 5 como padrão se não definido
        console.log(`Timeout para corridas definido em ${rideTimeout} minutos.`);
    } catch (error) {
        console.warn("Erro ao carregar configurações do app, usando padrão:", error);
        rideTimeout = 5;
    }
}

// --- Lógica Admin ---

// Navegação Admin
const adminNavButtons = document.querySelectorAll(".admin-section .main-nav .nav-button");
adminNavButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetSectionId = button.id.replace("nav-", "");
        setActiveAdminNav(button.id);
        showAdminContentSection(targetSectionId);

        // Carrega dados da seção admin
        if (targetSectionId === "admin-dashboard") {
            loadAdminDashboard();
        } else if (targetSectionId === "admin-users") {
            loadAdminUsers();
        } else if (targetSectionId === "admin-rides") {
            loadAdminRides();
        } else if (targetSectionId === "admin-suggestions") {
            loadAdminSuggestions();
        } else if (targetSectionId === "admin-settings") {
            loadAdminSettings();
        }
    });
});

function setActiveAdminNav(activeButtonId) {
    adminNavButtons.forEach(button => {
        button.classList.toggle("active", button.id === activeButtonId);
    });
}

function showAdminContentSection(sectionId) {
    const contentSections = document.querySelectorAll(".admin-section .content-section");
    contentSections.forEach(section => {
        section.classList.toggle("hidden", section.id !== sectionId);
    });
}

// Carrega dados do Dashboard Admin
async function loadAdminDashboard() {
    adminDashboardSection.innerHTML = '<p class="loading-message">Carregando dashboard...</p>';
    try {
        const stats = await adminService.getDashboardStats();
        const activities = await adminService.getRecentActivities();
        
        // Limpa a seção antes de adicionar conteúdo
        adminDashboardSection.innerHTML = `
            <h2>Dashboard</h2>
            <div class="stats-container">
                <div class="stat-card"><h3>Usuários Totais</h3><p id="total-users">${stats.totalUsers}</p></div>
                <div class="stat-card"><h3>Mototaxistas Ativos</h3><p id="active-drivers">${stats.activeDrivers}</p></div>
                <div class="stat-card"><h3>Corridas Hoje</h3><p id="rides-today">${stats.ridesToday}</p></div>
                <div class="stat-card"><h3>Corridas Totais</h3><p id="total-rides">${stats.totalRides}</p></div>
            </div>
            <!-- Gráficos podem ser adicionados aqui -->
            <h3>Atividades Recentes</h3>
            <div id="activity-list" class="activity-list-container"></div>
        `;
        
        const activityListContainer = adminDashboardSection.querySelector('#activity-list');
        if (activities.length === 0) {
            activityListContainer.innerHTML = '<p class="empty-message">Nenhuma atividade recente.</p>';
        } else {
            activities.forEach(activity => {
                const item = document.createElement('div');
                item.classList.add('activity-item');
                const date = activity.timestamp ? activity.timestamp.toDate().toLocaleString('pt-BR') : 'N/A';
                let icon = '';
                if (activity.type === 'ride') icon = '🏍️';
                else if (activity.type === 'suggestion') icon = '💡';

                item.innerHTML = `
                    <span>${icon} ${activity.details} (${activity.status})</span>
                    <span class="activity-time">${date}</span>
                `;
                activityListContainer.appendChild(item);
            });
        }

    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        adminDashboardSection.innerHTML = '<p class="error-message">Erro ao carregar dados do dashboard.</p>';
    }
}

// Carrega lista de usuários admin
async function loadAdminUsers() {
    const filter = userFilterSelect.value;
    const searchTerm = userSearchInput.value;
    usersListContainer.innerHTML = '<p class="loading-message">Carregando usuários...</p>';
    try {
        const users = await adminService.listUsers(filter, searchTerm);
        usersListContainer.innerHTML = "";
        if (users.length === 0) {
            usersListContainer.innerHTML = '<p class="empty-message">Nenhum usuário encontrado.</p>';
            return;
        }
        users.forEach(user => {
            const item = document.createElement('div');
            item.classList.add('user-item');
            item.innerHTML = `
                <div class="user-item-info">
                    <img src="${user.pictureUrl || 'icons/default-profile.png'}" alt="Foto">
                    <div class="user-item-details">
                        <h4>${user.name} (${user.accountType}) ${user.isAdmin ? '(Admin)' : ''}</h4>
                        <p>${user.email} | ${user.phone}</p>
                        <p>Avaliação: ${user.averageRating?.toFixed(1) || 'N/A'} (${user.ratingCount || 0})</p>
                    </div>
                </div>
                <div class="user-item-actions">
                    <button class="secondary-button block-user-button" data-user-id="${user.id}" data-blocked="${user.blocked}">
                        ${user.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                </div>
            `;
            usersListContainer.appendChild(item);
        });

        // Add listeners for block buttons
        document.querySelectorAll('.block-user-button').forEach(button => {
            button.addEventListener('click', async () => {
                const userId = button.dataset.userId;
                const currentBlockedStatus = button.dataset.blocked === 'true';
                try {
                    await adminService.toggleUserBlock(userId, !currentBlockedStatus);
                    showSuccess(`Usuário ${!currentBlockedStatus ? 'bloqueado' : 'desbloqueado'} com sucesso.`);
                    loadAdminUsers(); // Refresh list
                } catch (error) {
                    showError("Erro ao alterar status de bloqueio.");
                }
            });
        });

    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        usersListContainer.innerHTML = '<p class="error-message">Erro ao carregar usuários.</p>';
    }
}

// Carrega lista de corridas admin
async function loadAdminRides() {
    const filter = rideFilterSelect.value;
    const searchTerm = rideSearchInput.value;
    adminRidesListContainer.innerHTML = '<p class="loading-message">Carregando corridas...</p>';
    try {
        const rides = await adminService.listRides(filter, searchTerm);
        adminRidesListContainer.innerHTML = "";
        if (rides.length === 0) {
            adminRidesListContainer.innerHTML = '<p class="empty-message">Nenhuma corrida encontrada.</p>';
            return;
        }
        rides.forEach(ride => {
            const item = document.createElement('div');
            item.classList.add('admin-ride-item');
            const date = ride.createdAt ? ride.createdAt.toDate().toLocaleString('pt-BR') : 'N/A';
            const statusClass = `status-${ride.status}`;

            item.innerHTML = `
                <div class="admin-ride-header">
                    <span class="admin-ride-id">ID: ${ride.id.substring(0, 8)}...</span>
                    <span class="history-status ${statusClass}">${ride.status}</span>
                </div>
                <div class="admin-ride-details">
                    <p><strong>Data:</strong> ${date}</p>
                    <p><strong>Partida:</strong> ${ride.pickupLocation}</p>
                    <p><strong>Destino:</strong> ${ride.destination}</p>
                </div>
                <div class="admin-ride-users">
                    <div class="admin-ride-user">
                        <img src="${ride.passengerPictureUrl || 'icons/default-profile.png'}" alt="Passageiro">
                        <span>${ride.passengerName || 'N/A'} (Passageiro)</span>
                    </div>
                    <div class="admin-ride-user">
                        <img src="${ride.driverPictureUrl || 'icons/default-profile.png'}" alt="Mototaxista">
                        <span>${ride.driverName || 'N/A'} (Mototaxista)</span>
                    </div>
                </div>
                ${ride.status === 'cancelled' && ride.cancelReason ? `<p><strong>Motivo Cancel.:</strong> ${ride.cancelReason}</p>` : ''}
            `;
            adminRidesListContainer.appendChild(item);
        });
    } catch (error) {
        console.error("Erro ao carregar corridas:", error);
        adminRidesListContainer.innerHTML = '<p class="error-message">Erro ao carregar corridas.</p>';
    }
}

// Carrega lista de sugestões admin
async function loadAdminSuggestions() {
    const filter = suggestionFilterSelect.value;
    const searchTerm = suggestionSearchInput.value;
    adminSuggestionsListContainer.innerHTML = '<p class="loading-message">Carregando sugestões...</p>';
    try {
        const suggestions = await adminService.listSuggestions(filter, searchTerm);
        adminSuggestionsListContainer.innerHTML = "";
        if (suggestions.length === 0) {
            adminSuggestionsListContainer.innerHTML = '<p class="empty-message">Nenhuma sugestão encontrada.</p>';
            return;
        }
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.classList.add('admin-suggestion-item');
            const date = suggestion.createdAt ? suggestion.createdAt.toDate().toLocaleString('pt-BR') : 'N/A';
            const statusClass = `status-${suggestion.status}`;

            item.innerHTML = `
                <div class="admin-suggestion-header">
                    <span class="admin-suggestion-title">${suggestion.title}</span>
                    <span class="admin-suggestion-date">Enviada por ${suggestion.userName || 'N/A'} em ${date}</span>
                </div>
                <div class="admin-suggestion-content">
                    <p>${suggestion.text}</p>
                    <p><strong>Tipo:</strong> ${suggestion.type}</p>
                </div>
                <div class="admin-suggestion-footer">
                    <span class="suggestion-status ${statusClass}">${suggestion.status}</span>
                    <div class="admin-suggestion-actions">
                        <select class="suggestion-status-select" data-suggestion-id="${suggestion.id}">
                            <option value="pending" ${suggestion.status === 'pending' ? 'selected' : ''}>Pendente</option>
                            <option value="approved" ${suggestion.status === 'approved' ? 'selected' : ''}>Aprovada</option>
                            <option value="rejected" ${suggestion.status === 'rejected' ? 'selected' : ''}>Rejeitada</option>
                            <option value="implemented" ${suggestion.status === 'implemented' ? 'selected' : ''}>Implementada</option>
                        </select>
                    </div>
                </div>
            `;
            adminSuggestionsListContainer.appendChild(item);
        });

        // Add listeners for status selects
        document.querySelectorAll('.suggestion-status-select').forEach(select => {
            select.addEventListener('change', async (event) => {
                const suggestionId = event.target.dataset.suggestionId;
                const newStatus = event.target.value;
                try {
                    await adminService.updateSuggestionStatus(suggestionId, newStatus);
                    showSuccess("Status da sugestão atualizado.");
                    loadAdminSuggestions(); // Refresh list
                } catch (error) {
                    showError("Erro ao atualizar status da sugestão.");
                }
            });
        });

    } catch (error) {
        console.error("Erro ao carregar sugestões:", error);
        adminSuggestionsListContainer.innerHTML = '<p class="error-message">Erro ao carregar sugestões.</p>';
    }
}

// Carrega configurações admin
async function loadAdminSettings() {
    try {
        const settings = await adminService.getSettings();
        timeoutSettingInput.value = settings.rideTimeout || 5;
        // Carregar URL da tabela de preços se necessário
    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        showError("Erro ao carregar configurações.");
    }
}

// Salva configurações admin
saveSettingsButton.addEventListener('click', async () => {
    const newTimeout = parseInt(timeoutSettingInput.value);
    if (isNaN(newTimeout) || newTimeout < 1 || newTimeout > 60) {
        showError("Tempo limite inválido (deve ser entre 1 e 60 minutos).");
        return;
    }
    try {
        await adminService.updateSettings({ rideTimeout: newTimeout });
        rideTimeout = newTimeout; // Atualiza variável global
        showSuccess("Configurações salvas com sucesso!");
    } catch (error) {
        showError("Erro ao salvar configurações.");
    }
});

// Upload da tabela de preços
uploadPriceTableButton.addEventListener('click', async () => {
    const file = priceTableUploadInput.files[0];
    if (!file) {
        showError("Selecione um arquivo de imagem para a tabela de preços.");
        return;
    }
    // Valida tipo de arquivo (opcional mas recomendado)
    if (!file.type.startsWith('image/')) {
        showError("Por favor, selecione um arquivo de imagem (PNG, JPG, etc.).");
        return;
    }
    
    uploadPriceTableButton.disabled = true;
    uploadPriceTableButton.textContent = 'Enviando...';
    
    try {
        const imageUrl = await adminService.updatePriceTable(file);
        showSuccess("Tabela de preços atualizada com sucesso!");
        // Atualizar a imagem na aba de tabela de preços se estiver visível
        if (!pricesSection.classList.contains('hidden')) {
            loadPriceTable();
        }
    } catch (error) {
        showError("Erro ao atualizar tabela de preços.");
    } finally {
        uploadPriceTableButton.disabled = false;
        uploadPriceTableButton.textContent = 'Salvar Tabela de Preços';
        priceTableUploadInput.value = ''; // Limpa o input
    }
});

// Add listeners for admin search/filter
userSearchInput.addEventListener('input', loadAdminUsers);
userFilterSelect.addEventListener('change', loadAdminUsers);
rideSearchInput.addEventListener('input', loadAdminRides);
rideFilterSelect.addEventListener('change', loadAdminRides);
suggestionSearchInput.addEventListener('input', loadAdminSuggestions);
suggestionFilterSelect.addEventListener('change', loadAdminSuggestions);

// --- PWA Install Banner ---
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    pwaBanner.classList.remove('hidden');
});

installPwaButton.addEventListener('click', async () => {
    // Hide the app provided install promotion
    pwaBanner.classList.add('hidden');
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
});

closePwaBannerButton.addEventListener('click', () => {
    pwaBanner.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
    // Hide the install promotion
    pwaBanner.classList.add('hidden');
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    console.log('PWA was installed');
});

// --- Inicialização ---
// A lógica inicial é controlada pelo onAuthStateChanged


// Integração dos serviços, avaliações, geolocalização e ajustes finais

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
const storage = firebase.storage(); // Novo: Para fotos de perfil
let currentUser = null;
let rideStatusListener = null;
let pendingRidesListener = null;
let locationWatchId = null;
let rideTimeoutCheck = null; // Novo: Para timeout de aceitação

// Referências aos serviços locais
let geoService = null;
let ratingService = null;

// Elementos DOM - Login e Registro
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const logoutButton = document.getElementById("logout-button");

// Elementos DOM - Interface do Usuário
const userName = document.getElementById("user-name");
const userRatingContainer = document.getElementById("user-rating");
const passengerInterface = document.getElementById("passenger-interface");
const driverInterface = document.getElementById("driver-interface");
const requestRideButton = document.getElementById("request-ride-button");
const rideStatus = document.getElementById("ride-status");
const statusMessage = document.getElementById("status-message");
const driverStatus = document.getElementById("driver-status");
const ridesList = document.getElementById("rides-list");
const currentRide = document.getElementById("current-ride");
const completeRideButton = document.getElementById("complete-ride-button");
const cancelRideButton = document.getElementById("cancel-ride-button"); // Novo: Botão de cancelar corrida

// Novos elementos DOM para geolocalização
const useCurrentLocationBtn = document.getElementById("use-current-location");
const locationStatus = document.getElementById("location-status");
const nearbyDriversContainer = document.getElementById("nearby-drivers");

// Novos elementos DOM para perfil
const profileSection = document.getElementById("profile-section");
const profileNameInput = document.getElementById("profile-name");
const profilePhoneInput = document.getElementById("profile-phone");
const profilePictureInput = document.getElementById("profile-picture");
const profilePicturePreview = document.getElementById("profile-picture-preview");
const saveProfileButton = document.getElementById("save-profile-button");
const userProfilePicture = document.getElementById("user-profile-picture"); // Para exibir a foto no cabeçalho

// Novo: Elemento para histórico de viagens
const rideHistoryContainer = document.getElementById("ride-history");

// Novo: Elemento para contato do WhatsApp
const whatsappContactContainer = document.getElementById("whatsapp-contact");

// Alternar entre as abas de login e cadastro
loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
});

registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
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
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const oneDayAgoTimestamp = firebase.firestore.Timestamp.fromDate(oneDayAgo);

    db.collection("rides")
        .where("status", "in", ["pending", "accepted"])
        .where("createdAt", "<", oneDayAgoTimestamp)
        .get()
        .then((querySnapshot) => {
            const batch = db.batch();
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, {
                    status: "cancelled",
                    cancelReason: "Cancelada automaticamente por inatividade",
                    cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            return batch.commit();
        })
        .then(() => {
            console.log("Limpeza de corridas antigas concluída");
        })
        .catch((error) => {
            console.error("Erro ao limpar corridas antigas:", error);
        });
}

// Limpar corridas antigas ao iniciar o app
cleanupOldRides();

// Função para fazer login
loginButton.addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        showError("Por favor, preencha todos os campos.");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showSuccess("Login realizado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro no login:", error);
            showError("Erro no login: " + error.message);
        });
});

// Função para cadastrar novo usuário
registerButton.addEventListener("click", () => {
    const name = document.getElementById("register-name").value;
    const phone = document.getElementById("register-phone").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const accountType = document.querySelector("input[name=\"account-type\"]:checked").value;

    if (!name || !phone || !email || !password) {
        showError("Por favor, preencha todos os campos.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection("users").doc(user.uid).set({
                name: name,
                phone: phone,
                email: email,
                accountType: accountType,
                status: accountType === "driver" ? "available" : null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                fcmTokens: [],
                rating: 0,
                ratingCount: 0,
                location: null,
                profilePictureUrl: null // Novo: Campo para URL da foto de perfil
            });
        })
        .then(() => {
            showSuccess("Cadastro realizado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro no cadastro:", error);
            showError("Erro no cadastro: " + error.message);
        });
});

// Função para fazer logout
logoutButton.addEventListener("click", () => {
    stopLocationTracking();
    removeAllListeners();
    auth.signOut()
        .then(() => {
            showSuccess("Logout realizado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro no logout:", error);
            showError("Erro no logout: " + error.message);
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
    if (rideTimeoutCheck) {
        clearTimeout(rideTimeoutCheck);
        rideTimeoutCheck = null;
    }
}

// Função para iniciar monitoramento de localização
function startLocationTracking(userId, accountType) {
    if (!geoService) return;
    geoService.init()
        .then(position => {
            return geoService.saveLocationToFirestore(userId, position);
        })
        .then(() => {
            if (accountType === "driver") {
                locationWatchId = geoService.startWatching((position, error) => {
                    if (position) {
                        geoService.saveLocationToFirestore(userId, position)
                            .catch(err => console.error("Erro ao atualizar localização:", err));
                    }
                });
            }
        })
        .catch(error => {
            console.error("Erro ao inicializar geolocalização:", error);
            if (locationStatus) {
                locationStatus.textContent = "Erro ao obter localização. Verifique as permissões.";
                locationStatus.classList.add("error");
            }
        });
}

// Função para parar monitoramento de localização
function stopLocationTracking() {
    if (locationWatchId && geoService) {
        geoService.stopWatching(locationWatchId);
        locationWatchId = null;
    }
}

// Listener para mudanças no estado de autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                userName.textContent = userData.name;
                
                // Exibir foto de perfil
                if (userProfilePicture) {
                    userProfilePicture.src = userData.profilePictureUrl || "icons/default-profile.png"; // Usar uma imagem padrão
                }

                if (ratingService && userRatingContainer) {
                    ratingService.displayUserAverageRating(user.uid, userRatingContainer);
                }

                authSection.classList.add("hidden");
                appSection.classList.remove("hidden");
                startLocationTracking(user.uid, userData.accountType);
                setupProfileSection(userData); // Configurar seção de perfil
                loadRideHistory(userData.accountType); // Carregar histórico de viagens

                if (userData.accountType === "user") {
                    passengerInterface.classList.remove("hidden");
                    driverInterface.classList.add("hidden");
                    setupPassengerInterface(userData);
                } else {
                    driverInterface.classList.remove("hidden");
                    passengerInterface.classList.add("hidden");
                    setupDriverInterface(userData);
                }
            } else {
                console.error("Documento do usuário não encontrado no Firestore");
                showError("Erro ao carregar dados do usuário. Por favor, faça login novamente.");
                auth.signOut();
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            showError("Erro ao carregar dados do usuário: " + error.message);
        }
    } else {
        currentUser = null;
        stopLocationTracking();
        removeAllListeners();
        authSection.classList.remove("hidden");
        appSection.classList.add("hidden");
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        document.getElementById("register-name").value = "";
        document.getElementById("register-phone").value = "";
        document.getElementById("register-email").value = "";
        document.getElementById("register-password").value = "";
    }
});

// Configurar a interface do passageiro
function setupPassengerInterface(userData) {
    rideStatus.classList.add("hidden");
    whatsappContactContainer.classList.add("hidden"); // Esconder contato inicialmente
    checkForActivePassengerRide();

    if (useCurrentLocationBtn && geoService) {
        useCurrentLocationBtn.addEventListener("click", () => {
            if (locationStatus) {
                locationStatus.textContent = "Obtendo sua localização...";
                locationStatus.classList.remove("error", "hidden");
            }
            geoService.getCurrentPosition()
                .then(position => geoService.getAddressFromCoords(position.latitude, position.longitude))
                .then(address => {
                    const pickupLocationInput = document.getElementById("pickup-location");
                    if (pickupLocationInput) {
                        pickupLocationInput.value = address.fullAddress || `${address.street} ${address.number}, ${address.neighborhood}, ${address.city}`;
                    }
                    if (locationStatus) {
                        locationStatus.textContent = "Localização obtida com sucesso!";
                        setTimeout(() => locationStatus.classList.add("hidden"), 3000);
                    }
                    return geoService.getCurrentPosition(); // Obter posição novamente para buscar motoristas
                })
                .then(position => geoService.findNearbyDrivers(position))
                .then(nearbyDrivers => displayNearbyDrivers(nearbyDrivers))
                .catch(error => {
                    console.error("Erro ao obter localização:", error);
                    if (locationStatus) {
                        locationStatus.textContent = "Erro ao obter localização. " + error;
                        locationStatus.classList.add("error");
                    }
                });
        });
    }

    requestRideButton.addEventListener("click", () => {
        const pickupLocation = document.getElementById("pickup-location").value;
        const destination = document.getElementById("destination").value;

        if (!pickupLocation || !destination) {
            showError("Por favor, preencha o local de partida e o destino.");
            return;
        }

        db.collection("rides")
            .where("passengerId", "==", currentUser.uid)
            .where("status", "in", ["pending", "accepted"])
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const rideDoc = querySnapshot.docs[0];
                    const rideData = rideDoc.data();
                    const rideCreatedAt = rideData.createdAt ? rideData.createdAt.toDate() : new Date();
                    const oneHourAgo = new Date();
                    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

                    if (rideCreatedAt < oneHourAgo) {
                        return db.collection("rides").doc(rideDoc.id).update({
                            status: "cancelled",
                            cancelReason: "Cancelada automaticamente por inatividade",
                            cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(() => Promise.resolve());
                    } else {
                        showError("Você já tem uma corrida ativa. Cancele-a ou aguarde sua conclusão.");
                        return Promise.reject("Corrida ativa existente");
                    }
                }
                return Promise.resolve();
            })
            .then(() => geoService ? geoService.getCurrentPosition() : Promise.resolve(null))
            .then((location) => {
                if (!location && pickupLocation && geoService) {
                    return geoService.getCoordsFromAddress(pickupLocation)
                        .catch(error => {
                            console.warn("Não foi possível obter coordenadas do endereço:", error);
                            return null;
                        });
                }
                return location;
            })
            .then((location) => {
                return db.collection("rides").add({
                    passengerId: currentUser.uid,
                    passengerName: userData.name,
                    passengerPhone: userData.phone,
                    passengerPictureUrl: userData.profilePictureUrl, // Novo
                    pickupLocation: pickupLocation,
                    destination: destination,
                    status: "pending",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    driverId: null,
                    driverName: null,
                    driverPhone: null, // Novo
                    driverPictureUrl: null, // Novo
                    location: location,
                    rated: false,
                    passengerRating: 0,
                    driverRating: 0
                });
            })
            .then((docRef) => {
                showSuccess("Corrida solicitada com sucesso!");
                rideStatus.classList.remove("hidden");
                statusMessage.textContent = "Procurando mototaxistas próximos...";
                document.getElementById("pickup-location").value = "";
                document.getElementById("destination").value = "";
                setupRideStatusListener(docRef.id);
                startRideTimeoutCheck(docRef.id); // Iniciar verificação de timeout
            })
            .catch((error) => {
                if (error === "Corrida ativa existente") return;
                console.error("Erro ao solicitar corrida:", error);
                showError("Erro ao solicitar corrida: " + error.message);
            });
    });
    
    // Novo: Event listener para cancelar corrida
    cancelRideButton.addEventListener("click", () => {
        const rideId = cancelRideButton.dataset.rideId;
        if (rideId) {
            cancelRide(rideId, "passenger");
        }
    });
}

// Função para exibir mototaxistas próximos
function displayNearbyDrivers(drivers) {
    if (!nearbyDriversContainer) return;
    nearbyDriversContainer.innerHTML = "";
    if (!drivers || drivers.length === 0) {
        nearbyDriversContainer.innerHTML = "<p class=\"info-message\">Nenhum mototaxista disponível nas proximidades.</p>";
        return;
    }
    const title = document.createElement("h3");
    title.textContent = "Mototaxistas Próximos";
    nearbyDriversContainer.appendChild(title);
    const driversList = document.createElement("div");
    driversList.className = "drivers-list";
    drivers.forEach(driver => {
        const driverItem = document.createElement("div");
        driverItem.className = "driver-item";
        const distanceText = driver.distance < 1 ? `${Math.round(driver.distance * 1000)} m` : `${driver.distance.toFixed(1)} km`;
        const ratingStars = "★".repeat(Math.round(driver.rating)) + "☆".repeat(5 - Math.round(driver.rating));
        driverItem.innerHTML = `
            <div class="driver-profile-small">
                <img src="${driver.profilePictureUrl || 'icons/default-profile.png'}" alt="Foto de ${driver.name}">
                <div class="driver-info">
                    <p class="driver-name">${driver.name}</p>
                    <p class="driver-distance">${distanceText}</p>
                    <p class="driver-rating">${ratingStars} (${driver.rating.toFixed(1)})</p>
                </div>
            </div>
        `;
        driversList.appendChild(driverItem);
    });
    nearbyDriversContainer.appendChild(driversList);
}

// Verificar se o passageiro já tem uma corrida ativa
function checkForActivePassengerRide() {
    db.collection("rides")
        .where("passengerId", "==", currentUser.uid)
        .where("status", "in", ["pending", "accepted"])
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const rideDoc = querySnapshot.docs[0];
                const rideData = rideDoc.data();
                const rideCreatedAt = rideData.createdAt ? rideData.createdAt.toDate() : new Date();
                const oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);

                if (rideCreatedAt < oneHourAgo) {
                    db.collection("rides").doc(rideDoc.id).update({
                        status: "cancelled",
                        cancelReason: "Cancelada automaticamente por inatividade",
                        cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        rideStatus.classList.add("hidden");
                        whatsappContactContainer.classList.add("hidden");
                    }).catch((error) => console.error("Erro ao cancelar corrida antiga:", error));
                } else {
                    rideStatus.classList.remove("hidden");
                    cancelRideButton.dataset.rideId = rideDoc.id; // Armazenar ID para cancelamento
                    setupRideStatusListener(rideDoc.id);
                }
            } else {
                rideStatus.classList.add("hidden");
                whatsappContactContainer.classList.add("hidden");
            }
        })
        .catch((error) => console.error("Erro ao verificar corrida ativa do passageiro:", error));
}

// Configurar listener para atualizações no status da corrida
function setupRideStatusListener(rideId) {
    if (rideStatusListener) rideStatusListener();
    rideStatusListener = db.collection("rides").doc(rideId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const rideData = doc.data();
                cancelRideButton.classList.add("hidden"); // Esconder botão por padrão
                whatsappContactContainer.classList.add("hidden"); // Esconder contato por padrão

                switch(rideData.status) {
                    case "pending":
                        statusMessage.textContent = "Procurando mototaxistas próximos...";
                        cancelRideButton.classList.remove("hidden"); // Mostrar botão de cancelar
                        break;
                    case "accepted":
                        statusMessage.textContent = `Corrida aceita por ${rideData.driverName}! Aguarde no local de partida.`;
                        cancelRideButton.classList.remove("hidden"); // Mostrar botão de cancelar
                        displayWhatsappContact(rideData.driverPhone); // Mostrar contato do motorista
                        
                        if (rideData.driverLocation && geoService) {
                            geoService.getCurrentPosition()
                                .then(userPosition => {
                                    const distance = geoService.calculateDistance(userPosition.latitude, userPosition.longitude, rideData.driverLocation.latitude, rideData.driverLocation.longitude);
                                    const estimatedMinutes = Math.round((distance / 30) * 60);
                                    statusMessage.textContent += ` Distância: ${distance.toFixed(1)} km. Tempo estimado: ${estimatedMinutes} min.`;
                                })
                                .catch(error => console.warn("Erro ao calcular distância:", error));
                        }
                        break;
                    case "completed":
                        statusMessage.textContent = "Corrida finalizada. Obrigado por usar nosso serviço!";
                        if (ratingService && (!rideData.rated || !rideData.driverRating)) {
                            ratingService.showRatingForm("driver", rideId, rideData.driverId, rideData.driverName, rideData.driverPictureUrl)
                                .then(result => {
                                    if (result.submitted) {
                                        const ratingData = {
                                            rideId: rideId,
                                            rating: result.rating,
                                            comment: result.comment,
                                            ratedBy: currentUser.uid,
                                            ratedByName: currentUser.displayName || "Passageiro", // Usar nome do perfil
                                            targetUserId: rideData.driverId,
                                            ratingType: "driver"
                                        };
                                        return ratingService.saveRating(ratingData);
                                    }
                                })
                                .then(() => {
                                    showSuccess("Avaliação enviada com sucesso!");
                                    setTimeout(() => rideStatus.classList.add("hidden"), 3000);
                                })
                                .catch(error => {
                                    console.error("Erro ao processar avaliação:", error);
                                    showError("Erro ao enviar avaliação: " + error.message);
                                    setTimeout(() => rideStatus.classList.add("hidden"), 3000);
                                });
                        } else {
                            setTimeout(() => rideStatus.classList.add("hidden"), 5000);
                        }
                        break;
                    case "cancelled":
                        statusMessage.textContent = `Corrida cancelada. ${rideData.cancelReason || ""}`;
                        setTimeout(() => rideStatus.classList.add("hidden"), 5000);
                        break;
                }
            } else {
                // Corrida não existe mais (pode ter sido excluída ou erro)
                rideStatus.classList.add("hidden");
                whatsappContactContainer.classList.add("hidden");
            }
        }, (error) => {
            console.error("Erro ao monitorar status da corrida:", error);
            rideStatus.classList.add("hidden");
            whatsappContactContainer.classList.add("hidden");
        });
}

// Novo: Função para cancelar corrida
function cancelRide(rideId, cancelledBy) {
    db.collection("rides").doc(rideId).get()
        .then(doc => {
            if (!doc.exists) throw new Error("Corrida não encontrada.");
            const rideData = doc.data();
            if (rideData.status !== "pending" && rideData.status !== "accepted") {
                throw new Error("Não é possível cancelar uma corrida que já foi finalizada ou cancelada.");
            }
            
            return db.collection("rides").doc(rideId).update({
                status: "cancelled",
                cancelReason: `Cancelada pelo ${cancelledBy === 'passenger' ? 'passageiro' : 'mototaxista'}`, // Ou 'timeout'
                cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            showSuccess("Corrida cancelada com sucesso!");
            // A atualização do status será tratada pelo listener onSnapshot
        })
        .catch(error => {
            console.error("Erro ao cancelar corrida:", error);
            showError("Erro ao cancelar corrida: " + error.message);
        });
}

// Novo: Função para iniciar verificação de timeout da corrida
function startRideTimeoutCheck(rideId) {
    if (rideTimeoutCheck) clearTimeout(rideTimeoutCheck);
    
    rideTimeoutCheck = setTimeout(() => {
        db.collection("rides").doc(rideId).get()
            .then(doc => {
                if (doc.exists && doc.data().status === "pending") {
                    // Se ainda estiver pendente após 5 minutos, cancelar
                    console.log(`Corrida ${rideId} excedeu o tempo limite de 5 minutos. Cancelando...`);
                    return db.collection("rides").doc(rideId).update({
                        status: "cancelled",
                        cancelReason: "Nenhum mototaxista aceitou a tempo",
                        cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            })
            .catch(error => {
                console.error("Erro ao verificar timeout da corrida:", error);
            });
    }, 5 * 60 * 1000); // 5 minutos em milissegundos
}

// Configurar a interface do mototaxista
function setupDriverInterface(userData) {
    currentRide.classList.add("hidden");
    whatsappContactContainer.classList.add("hidden"); // Esconder contato inicialmente

    driverStatus.addEventListener("change", () => {
        const status = driverStatus.value;
        db.collection("users").doc(currentUser.uid).update({ status: status })
            .then(() => {
                showSuccess(`Status atualizado para: ${status === "available" ? "Disponível" : "Indisponível"}`);
                if (status === "unavailable") {
                    ridesList.innerHTML = "<p class=\"empty-message\">Você está indisponível para novas corridas.</p>";
                    if (pendingRidesListener) {
                        pendingRidesListener();
                        pendingRidesListener = null;
                    }
                } else {
                    setupPendingRidesListener();
                }
            })
            .catch((error) => {
                console.error("Erro ao atualizar status:", error);
                showError("Erro ao atualizar status: " + error.message);
            });
    });

    db.collection("users").doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                driverStatus.value = data.status || "available";
                if (!data.status) {
                    db.collection("users").doc(currentUser.uid).update({ status: "available" });
                }
                checkForActiveDriverRide();
                if (driverStatus.value === "available") {
                    setupPendingRidesListener();
                }
            }
        })
        .catch((error) => console.error("Erro ao carregar status do mototaxista:", error));

    completeRideButton.addEventListener("click", () => {
        db.collection("rides")
            .where("driverId", "==", currentUser.uid)
            .where("status", "==", "accepted")
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const rideDoc = querySnapshot.docs[0];
                    const rideData = rideDoc.data();
                    return db.collection("rides").doc(rideDoc.id).update({
                        status: "completed",
                        completedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => ({ rideId: rideDoc.id, rideData: rideData }));
                } else {
                    throw new Error("Nenhuma corrida ativa encontrada.");
                }
            })
            .then(({ rideId, rideData }) => {
                showSuccess("Corrida finalizada com sucesso!");
                currentRide.classList.add("hidden");
                whatsappContactContainer.classList.add("hidden");
                if (ratingService && (!rideData.rated || !rideData.passengerRating)) {
                    return ratingService.showRatingForm("passenger", rideId, rideData.passengerId, rideData.passengerName, rideData.passengerPictureUrl)
                        .then(result => {
                            if (result.submitted) {
                                const ratingData = {
                                    rideId: rideId,
                                    rating: result.rating,
                                    comment: result.comment,
                                    ratedBy: currentUser.uid,
                                    ratedByName: currentUser.displayName || "Mototaxista", // Usar nome do perfil
                                    targetUserId: rideData.passengerId,
                                    ratingType: "passenger"
                                };
                                return ratingService.saveRating(ratingData);
                            }
                        });
                }
            })
            .then(() => {
                showSuccess("Avaliação enviada com sucesso!");
                if (driverStatus.value === "available") {
                    setupPendingRidesListener();
                }
            })
            .catch((error) => {
                if (error.message === "Nenhuma corrida ativa encontrada.") {
                    showError(error.message);
                    return;
                }
                console.error("Erro ao finalizar corrida ou processar avaliação:", error);
                showError("Erro ao finalizar corrida: " + error.message);
                if (driverStatus.value === "available") {
                    setupPendingRidesListener();
                }
            });
    });
}

// Configurar listener para corridas pendentes
function setupPendingRidesListener() {
    try {
        if (pendingRidesListener) pendingRidesListener();
        ridesList.innerHTML = "<p class=\"empty-message\">Carregando corridas disponíveis...</p>";
        if (driverStatus.value !== "available") {
            ridesList.innerHTML = "<p class=\"empty-message\">Você está indisponível para novas corridas.</p>";
            return;
        }

        db.collection("rides")
            .where("driverId", "==", currentUser.uid)
            .where("status", "==", "accepted")
            .get()
            .then((activeRideSnapshot) => {
                if (!activeRideSnapshot.empty) {
                    ridesList.innerHTML = "<p class=\"empty-message\">Você está em uma corrida no momento.</p>";
                    return;
                }

                let driverLocation = null;
                const getLocationPromise = geoService ? geoService.getCurrentPosition().then(p => { driverLocation = p; return p; }).catch(() => null) : Promise.resolve(null);

                getLocationPromise.then(() => {
                    pendingRidesListener = db.collection("rides")
                        .where("status", "==", "pending")
                        .orderBy("createdAt", "asc")
                        .onSnapshot((querySnapshot) => {
                            ridesList.innerHTML = ""; // Limpar antes de adicionar
                            if (querySnapshot.empty) {
                                ridesList.innerHTML = "<p class=\"empty-message\">Nenhuma corrida disponível no momento.</p>";
                                return;
                            }

                            db.collection("declinedRides")
                                .where("driverId", "==", currentUser.uid)
                                .get()
                                .then((declinedSnapshot) => {
                                    const declinedRideIds = new Set();
                                    declinedSnapshot.forEach((doc) => declinedRideIds.add(doc.data().rideId));
                                    let hasRides = false;

                                    querySnapshot.forEach((doc) => {
                                        const ride = doc.data();
                                        const rideId = doc.id;
                                        if (declinedRideIds.has(rideId)) return;
                                        hasRides = true;

                                        let distanceText = "";
                                        if (ride.location && driverLocation && geoService) {
                                            const distance = geoService.calculateDistance(driverLocation.latitude, driverLocation.longitude, ride.location.latitude, ride.location.longitude);
                                            distanceText = distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
                                        }

                                        const rideElement = document.createElement("div");
                                        rideElement.className = "ride-item";
                                        rideElement.innerHTML = `
                                            <div class="passenger-profile-small">
                                                <img src="${ride.passengerPictureUrl || 'icons/default-profile.png'}" alt="Foto de ${ride.passengerName}">
                                                <p><strong>Passageiro:</strong> ${ride.passengerName}</p>
                                            </div>
                                            <p><strong>Local de partida:</strong> ${ride.pickupLocation}</p>
                                            <p><strong>Destino:</strong> ${ride.destination}</p>
                                            ${distanceText ? `<p><strong>Distância:</strong> ${distanceText}</p>` : ""}
                                            <div class="ride-actions">
                                                <button class="primary-button accept-ride" data-ride-id="${rideId}">Aceitar</button>
                                                <button class="secondary-button decline-ride" data-ride-id="${rideId}">Recusar</button>
                                            </div>
                                        `;
                                        ridesList.appendChild(rideElement);
                                        rideElement.querySelector(".accept-ride").addEventListener("click", () => acceptRide(rideId, ride));
                                        rideElement.querySelector(".decline-ride").addEventListener("click", () => declineRide(rideId));
                                    });

                                    if (!hasRides) {
                                        ridesList.innerHTML = "<p class=\"empty-message\">Nenhuma corrida disponível no momento.</p>";
                                    }
                                })
                                .catch((error) => {
                                    console.error("Erro ao carregar corridas recusadas:", error);
                                    ridesList.innerHTML = "<p class=\"error-message\">Erro ao carregar corridas. Tente novamente.</p>";
                                });
                        }, (error) => {
                            console.error("Erro ao monitorar corridas pendentes:", error);
                            ridesList.innerHTML = "<p class=\"error-message\">Erro ao monitorar corridas. Tente novamente.</p>";
                        });
                });
            })
            .catch((error) => {
                console.error("Erro ao verificar corrida ativa:", error);
                ridesList.innerHTML = "<p class=\"error-message\">Erro ao verificar status. Tente novamente.</p>";
            });
    } catch (error) {
        console.error("Erro ao configurar listener de corridas pendentes:", error);
        ridesList.innerHTML = "<p class=\"error-message\">Erro ao configurar monitoramento. Tente novamente.</p>";
    }
}

// Aceitar uma corrida
function acceptRide(rideId, rideData) {
    db.collection("rides")
        .where("driverId", "==", currentUser.uid)
        .where("status", "==", "accepted")
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                showError("Você já tem uma corrida em andamento.");
                return Promise.reject("Corrida em andamento");
            }
            return db.collection("rides").doc(rideId).get();
        })
        .then((rideDoc) => {
            if (!rideDoc.exists) throw new Error("Corrida não existe");
            const currentRideData = rideDoc.data();
            if (currentRideData.status !== "pending") throw new Error("Corrida não está mais pendente");
            return db.collection("users").doc(currentUser.uid).get();
        })
        .then((userDoc) => {
            const userData = userDoc.data();
            const getLocationPromise = geoService ? geoService.getCurrentPosition().catch(() => null) : Promise.resolve(null);
            return getLocationPromise.then(position => ({ userData, driverLocation: position }));
        })
        .then(({ userData, driverLocation }) => {
            const updateData = {
                status: "accepted",
                driverId: currentUser.uid,
                driverName: userData.name,
                driverPhone: userData.phone,
                driverPictureUrl: userData.profilePictureUrl, // Novo
                acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (driverLocation) updateData.driverLocation = driverLocation;
            return db.collection("rides").doc(rideId).update(updateData);
        })
        .then(() => {
            showSuccess("Corrida aceita com sucesso!");
            document.getElementById("passenger-name").textContent = rideData.passengerName;
            document.getElementById("ride-pickup").textContent = rideData.pickupLocation;
            document.getElementById("ride-destination").textContent = rideData.destination;
            currentRide.classList.remove("hidden");
            displayWhatsappContact(rideData.passengerPhone); // Mostrar contato do passageiro
            if (pendingRidesListener) pendingRidesListener();
            ridesList.innerHTML = "<p class=\"empty-message\">Você está em uma corrida no momento.</p>";
            if (rideTimeoutCheck) clearTimeout(rideTimeoutCheck); // Limpar timeout ao aceitar
        })
        .catch((error) => {
            if (error.message === "Corrida em andamento" || error.message === "Corrida não existe" || error.message === "Corrida não está mais pendente") {
                showError(error.message);
                return;
            }
            console.error("Erro ao aceitar corrida:", error);
            showError("Erro ao aceitar corrida: " + error.message);
        });
}

// Recusar uma corrida
function declineRide(rideId) {
    db.collection("declinedRides").add({
        rideId: rideId,
        driverId: currentUser.uid,
        declinedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        const rideElement = document.querySelector(`.ride-item .accept-ride[data-ride-id="${rideId}"]`);
        if (rideElement) {
            const parentElement = rideElement.closest(".ride-item");
            if (parentElement) parentElement.remove();
        }
        if (ridesList.children.length === 0) {
            ridesList.innerHTML = "<p class=\"empty-message\">Nenhuma corrida disponível no momento.</p>";
        }
    })
    .catch((error) => {
        console.error("Erro ao registrar recusa de corrida:", error);
        showError("Erro ao recusar corrida: " + error.message);
    });
}

// Verificar se o mototaxista já tem uma corrida em andamento
function checkForActiveDriverRide() {
    db.collection("rides")
        .where("driverId", "==", currentUser.uid)
        .where("status", "==", "accepted")
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const rideDoc = querySnapshot.docs[0];
                const rideData = rideDoc.data();
                document.getElementById("passenger-name").textContent = rideData.passengerName;
                document.getElementById("ride-pickup").textContent = rideData.pickupLocation;
                document.getElementById("ride-destination").textContent = rideData.destination;
                currentRide.classList.remove("hidden");
                displayWhatsappContact(rideData.passengerPhone); // Mostrar contato do passageiro
                if (pendingRidesListener) pendingRidesListener();
                ridesList.innerHTML = "<p class=\"empty-message\">Você está em uma corrida no momento.</p>";
            }
        })
        .catch((error) => console.error("Erro ao verificar corrida ativa:", error));
}

// Novo: Configurar seção de perfil
function setupProfileSection(userData) {
    if (!profileSection) return;
    profileNameInput.value = userData.name || "";
    profilePhoneInput.value = userData.phone || "";
    profilePicturePreview.src = userData.profilePictureUrl || "icons/default-profile.png";

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

    saveProfileButton.addEventListener("click", () => {
        const newName = profileNameInput.value;
        const newPhone = profilePhoneInput.value;
        const file = profilePictureInput.files[0];
        
        if (!newName || !newPhone) {
            showError("Nome e telefone são obrigatórios.");
            return;
        }

        const updateData = {
            name: newName,
            phone: newPhone
        };

        // Função para atualizar dados no Firestore
        const updateFirestore = (imageUrl = null) => {
            if (imageUrl) {
                updateData.profilePictureUrl = imageUrl;
            }
            db.collection("users").doc(currentUser.uid).update(updateData)
                .then(() => {
                    showSuccess("Perfil atualizado com sucesso!");
                    // Atualizar nome no cabeçalho
                    userName.textContent = newName;
                    if (imageUrl && userProfilePicture) {
                        userProfilePicture.src = imageUrl;
                    }
                })
                .catch(error => {
                    console.error("Erro ao atualizar perfil:", error);
                    showError("Erro ao atualizar perfil: " + error.message);
                });
        };

        // Se uma nova foto foi selecionada, fazer upload primeiro
        if (file) {
            const filePath = `profilePictures/${currentUser.uid}/${file.name}`;
            const fileRef = storage.ref(filePath);
            const uploadTask = fileRef.put(file);

            uploadTask.on("state_changed", 
                (snapshot) => { /* Progresso */ }, 
                (error) => {
                    console.error("Erro no upload da foto:", error);
                    showError("Erro ao fazer upload da foto: " + error.message);
                }, 
                () => {
                    // Upload concluído, obter URL e atualizar Firestore
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        updateFirestore(downloadURL);
                    });
                }
            );
        } else {
            // Se não há nova foto, apenas atualizar nome e telefone
            updateFirestore();
        }
    });
}

// Novo: Carregar histórico de viagens
function loadRideHistory(accountType) {
    if (!rideHistoryContainer) return;
    rideHistoryContainer.innerHTML = "<p class=\"loading-message\">Carregando histórico...</p>";

    const queryField = accountType === "user" ? "passengerId" : "driverId";
    
    db.collection("rides")
        .where(queryField, "==", currentUser.uid)
        .where("status", "in", ["completed", "cancelled"])
        .orderBy("createdAt", "desc")
        .limit(10) // Limitar a 10 viagens por exemplo
        .get()
        .then(querySnapshot => {
            rideHistoryContainer.innerHTML = ""; // Limpar
            if (querySnapshot.empty) {
                rideHistoryContainer.innerHTML = "<p class=\"empty-message\">Nenhuma viagem encontrada no histórico.</p>";
                return;
            }

            const title = document.createElement("h3");
            title.textContent = "Histórico de Viagens";
            rideHistoryContainer.appendChild(title);

            const historyList = document.createElement("div");
            historyList.className = "history-list";

            querySnapshot.forEach(doc => {
                const ride = doc.data();
                const rideItem = document.createElement("div");
                rideItem.className = `history-item status-${ride.status}`;
                const date = ride.createdAt ? ride.createdAt.toDate().toLocaleDateString("pt-BR") : "Data indisponível";
                const otherPartyName = accountType === "user" ? ride.driverName : ride.passengerName;
                const otherPartyLabel = accountType === "user" ? "Mototaxista" : "Passageiro";

                rideItem.innerHTML = `
                    <p><strong>Data:</strong> ${date}</p>
                    <p><strong>De:</strong> ${ride.pickupLocation}</p>
                    <p><strong>Para:</strong> ${ride.destination}</p>
                    <p><strong>${otherPartyLabel}:</strong> ${otherPartyName || "Não informado"}</p>
                    <p><strong>Status:</strong> ${ride.status === "completed" ? "Concluída" : "Cancelada"}</p>
                    ${ride.status === "cancelled" && ride.cancelReason ? `<p><strong>Motivo:</strong> ${ride.cancelReason}</p>` : ""}
                `;
                historyList.appendChild(rideItem);
            });
            rideHistoryContainer.appendChild(historyList);
        })
        .catch(error => {
            console.error("Erro ao carregar histórico de viagens:", error);
            rideHistoryContainer.innerHTML = "<p class=\"error-message\">Erro ao carregar histórico.</p>";
        });
}

// Novo: Função para exibir contato do WhatsApp
function displayWhatsappContact(phoneNumber) {
    if (!whatsappContactContainer || !phoneNumber) {
        whatsappContactContainer.classList.add("hidden");
        return;
    }
    
    // Remover caracteres não numéricos e adicionar código do país (Brasil)
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/55${cleanPhoneNumber}`;
    
    whatsappContactContainer.innerHTML = `
        <a href="${whatsappLink}" target="_blank" class="whatsapp-link">
            <img src="icons/whatsapp.png" alt="WhatsApp Icon"> 
            Contatar via WhatsApp
        </a>
    `;
    whatsappContactContainer.classList.remove("hidden");
}

// Carregar script
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Carregar os serviços e inicializar
Promise.all([
    loadScript("geo-service.js"),
    loadScript("rating-service.js")
])
.then(() => {
    console.log("Serviços carregados com sucesso");
    geoService = window.GeoService;
    ratingService = window.RatingService.init(db);
    // O listener onAuthStateChanged será chamado automaticamente
})
.catch(error => {
    console.error("Erro ao carregar serviços:", error);
    showError("Erro crítico ao carregar o aplicativo. Por favor, recarregue a página.");
});

// Aplicar tema escuro se definido no localStorage
function applyTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Botão para alternar tema (exemplo, pode ser colocado no HTML)
// <button id="toggle-theme-button">Alternar Tema</button>
/*
const toggleThemeButton = document.getElementById('toggle-theme-button');
if (toggleThemeButton) {
    toggleThemeButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}
*/

// Aplicar tema ao carregar
applyTheme();

// Serviço de Geolocalização para o aplicativo Oops Transportes Caramujo

// Namespace para evitar conflitos
window.GeoService = (function() {
    // Referência ao Firestore
    const db = firebase.firestore();
    
    // Verificar se a geolocalização está disponível
    const isGeolocationAvailable = () => {
        return 'geolocation' in navigator;
    };
    
    // Obter a posição atual
    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            if (!isGeolocationAvailable()) {
                reject(new Error('Geolocalização não disponível neste dispositivo.'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    resolve(coords);
                },
                (error) => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Permissão para geolocalização negada.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Informação de localização indisponível.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Tempo esgotado ao obter localização.';
                            break;
                        default:
                            errorMessage = 'Erro desconhecido ao obter localização.';
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };
    
    // Iniciar monitoramento contínuo de localização
    const startWatching = (callback) => {
        if (!isGeolocationAvailable()) {
            callback(null, new Error('Geolocalização não disponível neste dispositivo.'));
            return null;
        }
        
        return navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                callback(coords, null);
            },
            (error) => {
                callback(null, error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };
    
    // Parar monitoramento de localização
    const stopWatching = (watchId) => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }
    };
    
    // Salvar localização no Firestore
    const saveLocationToFirestore = (userId, position) => {
        if (!userId || !position) {
            return Promise.reject(new Error('Usuário ou posição inválidos.'));
        }
        
        return db.collection('users').doc(userId).update({
            location: {
                latitude: position.latitude,
                longitude: position.longitude,
                accuracy: position.accuracy,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        });
    };
    
    // Calcular distância entre dois pontos (fórmula de Haversine)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distância em km
        return distance;
    };
    
    // Encontrar mototaxistas próximos
    const findNearbyDrivers = (position, maxDistance = 10) => {
        if (!position) {
            return Promise.reject(new Error('Posição inválida.'));
        }
        
        return db.collection('users')
            .where('accountType', '==', 'driver')
            .where('status', '==', 'available')
            .get()
            .then((querySnapshot) => {
                const nearbyDrivers = [];
                querySnapshot.forEach((doc) => {
                    const driverData = doc.data();
                    if (driverData.location) {
                        const distance = calculateDistance(
                            position.latitude,
                            position.longitude,
                            driverData.location.latitude,
                            driverData.location.longitude
                        );
                        
                        if (distance <= maxDistance) {
                            nearbyDrivers.push({
                                id: doc.id,
                                name: driverData.name,
                                distance: distance,
                                rating: driverData.rating || 0,
                                ratingCount: driverData.ratingCount || 0,
                                profilePictureUrl: driverData.profilePictureUrl
                            });
                        }
                    }
                });
                
                // Ordenar por distância
                nearbyDrivers.sort((a, b) => a.distance - b.distance);
                return nearbyDrivers;
            });
    };
    
    // Converter endereço em coordenadas (geocoding)
    const getCoordsFromAddress = (address) => {
        return new Promise((resolve, reject) => {
            // Usando a API de Geocodificação do OpenStreetMap (Nominatim)
            const encodedAddress = encodeURIComponent(address);
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        resolve({
                            latitude: parseFloat(data[0].lat),
                            longitude: parseFloat(data[0].lon)
                        });
                    } else {
                        reject(new Error('Endereço não encontrado.'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
    
    // Converter coordenadas em endereço (geocoding reverso)
    const getAddressFromCoords = (latitude, longitude) => {
        return new Promise((resolve, reject) => {
            // Usando a API de Geocodificação Reversa do OpenStreetMap (Nominatim)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.address) {
                        const address = {
                            street: data.address.road || data.address.pedestrian || '',
                            number: data.address.house_number || '',
                            neighborhood: data.address.suburb || data.address.neighbourhood || '',
                            city: data.address.city || data.address.town || data.address.village || '',
                            state: data.address.state || '',
                            country: data.address.country || '',
                            fullAddress: data.display_name || ''
                        };
                        resolve(address);
                    } else {
                        reject(new Error('Não foi possível obter o endereço para estas coordenadas.'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
    
    // Inicializar o serviço
    const init = () => {
        return getCurrentPosition()
            .then(position => {
                console.log('Geolocalização inicializada com sucesso.');
                return position;
            })
            .catch(error => {
                console.error('Erro ao inicializar geolocalização:', error);
                throw error;
            });
    };
    
    // API pública
    return {
        init,
        getCurrentPosition,
        startWatching,
        stopWatching,
        saveLocationToFirestore,
        calculateDistance,
        findNearbyDrivers,
        getCoordsFromAddress,
        getAddressFromCoords
    };
})();

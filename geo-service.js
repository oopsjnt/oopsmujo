// Serviço de Geolocalização para o aplicativo Oops Transportes Caramujo
const GeoService = {
    // Obter a localização atual do usuário
    getCurrentLocation: function() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalização não é suportada pelo seu navegador'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    // Converter coordenadas em endereço usando API de geocodificação reversa
                    this.reverseGeocode(coords)
                        .then(address => {
                            resolve({
                                coords: coords,
                                address: address
                            });
                        })
                        .catch(error => {
                            // Se falhar a geocodificação, retorna apenas as coordenadas
                            resolve({
                                coords: coords,
                                address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
                            });
                        });
                },
                error => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Permissão para geolocalização negada';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Informação de localização indisponível';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Tempo esgotado ao obter localização';
                            break;
                        default:
                            errorMessage = 'Erro desconhecido ao obter localização';
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
    },
    
    // Converter coordenadas em endereço usando API de geocodificação reversa
    reverseGeocode: function(coords) {
        return new Promise((resolve, reject) => {
            // Usando a API Nominatim do OpenStreetMap para geocodificação reversa
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`;
            
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Falha na geocodificação reversa');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.display_name) {
                        // Simplificar o endereço para exibição
                        const addressParts = data.display_name.split(',');
                        // Pegar apenas os primeiros 3-4 componentes do endereço para simplificar
                        const simplifiedAddress = addressParts.slice(0, 4).join(',');
                        resolve(simplifiedAddress);
                    } else {
                        reject(new Error('Endereço não encontrado'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    
    // Calcular distância entre duas coordenadas usando a fórmula de Haversine
    calculateDistance: function(coords1, coords2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.deg2rad(coords2.latitude - coords1.latitude);
        const dLon = this.deg2rad(coords2.longitude - coords1.longitude);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(coords1.latitude)) * Math.cos(this.deg2rad(coords2.latitude)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distância em km
        return distance;
    },
    
    // Converter graus para radianos
    deg2rad: function(deg) {
        return deg * (Math.PI/180);
    },
    
    // Estimar tempo de chegada baseado na distância
    estimateArrivalTime: function(distanceKm) {
        // Assumindo velocidade média de 30 km/h para mototáxi em área urbana
        const averageSpeedKmh = 30;
        // Tempo em minutos
        const timeMinutes = (distanceKm / averageSpeedKmh) * 60;
        return Math.round(timeMinutes);
    }
};

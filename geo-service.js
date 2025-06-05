// Serviço de Geolocalização para o Oops Transportes Caramujo
class GeoService {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
        this.geocoder = null;
    }

    // Verifica se a geolocalização está disponível no navegador
    isGeolocationAvailable() {
        return 'geolocation' in navigator;
    }

    // Inicializa o serviço de geocodificação reversa
    initGeocoder() {
        // Verificamos se já existe uma instância do geocoder
        if (!this.geocoder && window.google && window.google.maps) {
            this.geocoder = new google.maps.Geocoder();
        }
        return !!this.geocoder;
    }

    // Obtém a localização atual do usuário (uma única vez)
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!this.isGeolocationAvailable()) {
                reject(new Error('Geolocalização não suportada neste navegador.'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    resolve(this.currentPosition);
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
                            errorMessage = 'Tempo esgotado ao tentar obter localização.';
                            break;
                        default:
                            errorMessage = 'Erro desconhecido ao obter localização.';
                    }
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    }

    // Inicia o monitoramento contínuo da localização
    watchPosition(callback) {
        if (!this.isGeolocationAvailable()) {
            callback(null, new Error('Geolocalização não suportada neste navegador.'));
            return null;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                callback(this.currentPosition);
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
                        errorMessage = 'Tempo esgotado ao tentar obter localização.';
                        break;
                    default:
                        errorMessage = 'Erro desconhecido ao obter localização.';
                }
                callback(null, new Error(errorMessage));
            },
            options
        );

        return this.watchId;
    }

    // Para o monitoramento da localização
    clearWatch() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    // Converte coordenadas em endereço usando geocodificação reversa
    async reverseGeocode(latitude, longitude) {
        return new Promise((resolve, reject) => {
            // Se não temos o geocoder, tentamos usar uma API alternativa
            if (!this.geocoder) {
                // Usando Nominatim OpenStreetMap como alternativa
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.display_name) {
                            resolve(data.display_name);
                        } else {
                            reject(new Error('Não foi possível obter o endereço.'));
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
                return;
            }

            // Usando Google Maps Geocoder se disponível
            const latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
            this.geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject(new Error('Nenhum resultado encontrado.'));
                    }
                } else {
                    reject(new Error(`Geocodificação reversa falhou: ${status}`));
                }
            });
        });
    }

    // Calcula a distância entre dois pontos usando a fórmula de Haversine
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distância em km
        return distance;
    }

    // Converte graus para radianos
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Estima o tempo de chegada baseado na distância e velocidade média
    estimateArrivalTime(distanceKm, averageSpeedKmh = 30) {
        // Tempo em minutos = (distância / velocidade) * 60
        const timeMinutes = (distanceKm / averageSpeedKmh) * 60;
        return Math.round(timeMinutes);
    }

    // Formata a distância para exibição
    formatDistance(distanceKm) {
        if (distanceKm < 1) {
            return `${Math.round(distanceKm * 1000)} m`;
        }
        return `${distanceKm.toFixed(1)} km`;
    }
}

// Exporta o serviço
const geoService = new GeoService();

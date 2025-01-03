import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

const LocationPickerModal = ({ visible, onClose, onLocationSelect, title }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
                setInitialRegion({
                    latitude: 40.7128,
                    longitude: -74.0060,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.log('Error getting location:', error);
        }
    };

    const handleMapPress = async (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC6kkz9yNjthTzu8vGULBRafD-4B1Hnc_o`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
                setSelectedLocation({
                    latitude,
                    longitude,
                    placeId: data.results[0].place_id,
                    address: data.results[0].formatted_address,
                });
            }
        } catch (error) {
            console.log('Error getting place details:', error);
            setSelectedLocation({
                latitude,
                longitude,
                placeId: '',
                address: '',
            });
        }
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect({
                placeId: selectedLocation.placeId,
                longitude: selectedLocation.longitude,
                latitude: selectedLocation.latitude,
                address: selectedLocation.address,
            });
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <GooglePlacesAutocomplete
                        placeholder="Search location"
                        onPress={(data, details = null) => {
                            console.log("Place selected:", { data, details }); // Debug log
                            if (details) {
                                setSelectedLocation({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                    placeId: data.place_id,
                                    address: data.description,
                                });
                            }
                        }}
                        query={{
                            key: 'AIzaSyC6kkz9yNjthTzu8vGULBRafD-4B1Hnc_o',
                            language: 'en',
                        }}
                        fetchDetails={true}
                        styles={{
                            container: styles.searchInputContainer,
                            textInput: styles.searchInput,
                            listView: styles.searchResultsList,
                        }}
                    />
                </View>

                {initialRegion ? (
                    <MapView
                        style={styles.map}
                        initialRegion={initialRegion}
                        region={selectedLocation ? {
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        } : initialRegion}
                        onPress={handleMapPress}
                    >
                        {selectedLocation && (
                            <Marker
                                coordinate={{
                                    latitude: selectedLocation.latitude,
                                    longitude: selectedLocation.longitude,
                                }}
                            />
                        )}
                    </MapView>
                ) : (
                    <ActivityIndicator size="large" />
                )}

                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        !selectedLocation && styles.confirmButtonDisabled
                    ]}
                    onPress={handleConfirm}
                    disabled={!selectedLocation}
                >
                    <Text style={styles.confirmButtonText}>
                        Confirm Location
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        padding: 8,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#666',
    },
    searchContainer: {
        padding: 16,
        zIndex: 1,
    },
    searchInputContainer: {
        flex: 0,
    },
    searchInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
    },
    searchResultsList: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        maxHeight: 200,
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    confirmButton: {
        backgroundColor: '#4caf50',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#ccc',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LocationPickerModal; 
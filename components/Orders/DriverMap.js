import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_API_KEY = 'AIzaSyC6kkz9yNjthTzu8vGULBRafD-4B1Hnc_o'; // Replace with your API key

const DriverMap = ({ pickup, dropoff, driverLocation }) => {
  if (!pickup || !dropoff || !driverLocation) return null;
  const [region, setRegion] = useState({
    latitude: pickup.latitude,
    longitude: pickup.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [currentDriverLocation, setCurrentDriverLocation] = useState(driverLocation);

  useEffect(() => {
    const watchDriverLocation = async () => {
      // Simulating real-time updates with a Location API or socket
      const subscription = Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (newLocation) => {
          setCurrentDriverLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
      return () => subscription.remove();
    };

    watchDriverLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Pickup Marker */}
        <Marker
          coordinate={pickup}
          title="Pickup Location"
          pinColor="green"
        />

        {/* Dropoff Marker */}
        <Marker
          coordinate={dropoff}
          title="Drop-off Location"
          pinColor="red"
        />

        {/* Driver's Real-Time Location */}
        {currentDriverLocation && (
          <Marker
            coordinate={currentDriverLocation}
            title="Driver Location"
            pinColor="blue"
          />
        )}

        {/* Route */}
        <MapViewDirections
          origin={pickup}
          destination={dropoff}
          waypoints={[currentDriverLocation]} // Optional
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor="blue"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default DriverMap;

// src/screens/MapScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

const MapScreen = ({ job }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setOrigin({
        latitude: job.pickupLocation?.latitude || loc.coords.latitude,
        longitude: job.pickupLocation?.longitude || loc.coords.longitude,
      });
      setDestination({
        latitude: job.dropoffLocation?.latitude || loc.coords.latitude,
        longitude: job.dropoffLocation?.longitude || loc.coords.longitude,
      });
    })();
  }, []);
  console.log(origin);
  console.log(destination);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {origin && <Marker coordinate={origin} title="Origin" />}
        {destination && <Marker coordinate={destination} title="Destination" />}
        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey="AIzaSyC6kkz9yNjthTzu8vGULBRafD-4B1Hnc_o"
            strokeWidth={8}
            strokeColor="blue"
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              });
            }}
          />
        )}
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
  inputContainer: {
    position: "absolute",
    top: 10,
    width: "100%",
  },
});

export default MapScreen;

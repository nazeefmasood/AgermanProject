import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import LoginForm from "./Forms/Login"
import { ActivityIndicator } from "react-native";
const SplashScreen = ({ navigation }) => {

  return (
    <>
      
        <View style={styles.container}>
          <Image
            source={require("../assets/images/logo.jpg")}
            style={styles.image}
          />
          <ActivityIndicator size="large" color="#00ff00"  />
        </View>
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Change background color if desired
  },

  image: {
    width: 320,
    height: 320,
  },
});

export default SplashScreen;

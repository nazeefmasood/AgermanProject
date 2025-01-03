import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
  Image,
  SafeAreaView,
  Platform,
  Switch,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authFirebase } from "../../database/firebaseConfig";

const logo = require("../../assets/images/logo.jpg");

const LoginForm = ({ register, guide, reset, driver }) => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [error, setError] = useState("");

  const onSignInPress = async () => {
    setLoading(true);
    if (!isLoaded) {
      return;
    }
    try {
      if (isDriver) {
        await handleDriverSignIn();
      } else {
        const completeSignIn = await signIn.create({
          identifier: emailAddress,
          password: password,
        });
        try {
          await setActive({ session: completeSignIn.createdSessionId });
          setLoading(false);
        } catch (error) {}
        console.log(isSignedIn);
      }
    } catch (err) {
      alert("Email or Password is incorrect");
    }
    setLoading(false);
  };

  const handleDriverSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        authFirebase,
        emailAddress,
        password
      );
      setLoading(false);
      router.replace("DriverHome");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("No driver account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        default:
          setError("Login failed. Please try again");
      }
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner visible={loading} />

      <Image source={logo} style={styles.image} resizeMode="contain" />

      <Text style={styles.title}>Login</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <Text style={styles.switchText}>Driver Login</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#34eba4" }}
            thumbColor={isDriver ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#767577"
            onValueChange={() => setIsDriver(!isDriver)}
            value={isDriver}
          />
        </View>
        <Pressable onPress={() => reset()}>
          <Text style={styles.forgetText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <View style={styles.buttonView}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDriver ? "#2196F3" : "#34eba4" },
          ]}
          onPress={() => onSignInPress()}
        >
          <Text style={styles.buttonText}>
            {isDriver ? "DRIVER LOGIN" : "USER LOGIN"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.footerText}>
        Don't Have Account?
        <Pressable onPress={() => register()}>
          <Text style={styles.signup}> Sign Up</Text>
        </Pressable>
      </Text>
      <Pressable onPress={() => driver()}>
        <Text style={styles.signup}> Tips</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 70 : 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    height: 180,
    width: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 15,
    color: "green",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 35,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  switch: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    color: "#666",
  },
  forgetText: {
    fontSize: 14,
    color: "red",
    fontWeight: "500",
  },
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 10,
  },
  signup: {
    color: "red",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 30,
  },
});

import { Stack } from "expo-router";
import React from "react";

const _Layout = () => {
  return (
    <Stack initialRouteName="Login">
      <Stack.Screen name="Login" options={{ headerShown: false }} />

      <Stack.Screen name="Guide" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="ResetPass"
        options={{ headerTitle: "Reset Password" }}
      ></Stack.Screen>
      <Stack.Screen name="SignUp" />
    </Stack>
  );
};

export default _Layout;

import "react-native-get-random-values";
import { Stack, Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#000"} />
    </Pressable> 
  );
};

export const ProfileButton = () => {
  const gotoProfile = () => {
    router.push("Profile");
  };

  return (
    <Pressable onPress={gotoProfile} style={{ marginRight: 10 }}>
      <Ionicons name="person-outline" size={24} color={"#000"} />
    </Pressable>
  );
};
export const BackButton = () => {
  const goBack = () => {
    router.canGoBack = true;
    router.back();
  };

  return (
    <Pressable onPress={goBack} style={{ marginRight: 10 }}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </Pressable>
  );
};



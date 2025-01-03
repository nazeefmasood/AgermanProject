import { Stack, Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import NotificationScreen from "./NotificationScreen";
import { useState } from "react";
import { NativeScreenNavigationContainer } from "react-native-screens";
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

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "lightgreen",
        },

        headerShown: false,
        headerTitleStyle: {
          color: "whitesmoke",
        },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "green",
      }}
    >
      <Tabs.Screen
        name="UserHomePage"
        options={{
          //   headerStyle:{opacity:500},
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Home",
          headerRight: () => <ProfileButton />,
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="MyOrders"
        options={{
          headerTitle: "Add Furniture",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add" size={24} color={color} />
          ),
          tabBarLabel: "add Furniture",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="FurnitureLists"
        options={{
          headerTitle: "Inventory",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory" size={24} color={color} />
          ),
          tabBarLabel: "inventory",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerTitle: "User Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="supervised-user-circle"
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "profile",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="CompanyDetails"
        options={{
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <DrawerToggleButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="ShowCars"
        options={{
          href: null,
          // headerRight: () => <LogoutButton />,
          // headerLeft: () => <DrawerToggleButton/>,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="ListingDetails"
        options={{
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <DrawerToggleButton />,
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="EditInventory"
        options={{
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <DrawerToggleButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="NotificationScreen"
        options={{
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <DrawerToggleButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="Inventory"
        options={{
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <DrawerToggleButton />,
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="ListCompanies"
        href="null"
        options={{
          headerTitle: "select movers",
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <BackButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="FareCalculation"
        href="null"
        options={{
          headerTitle: "select movers",
          href: null,
          headerRight: () => <LogoutButton />,
          headerLeft: () => <BackButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;

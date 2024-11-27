import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileScreen from "./ProfileScreen";
import SearchScreen from "./SearchScreen";
import ListeScreen from "./ListeScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import FeedScreen from "./FeedScreen";
import ParametreScreen from "./ParametreScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Feed") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Liste") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "Parametre") {
              iconName = focused? "settings" : "settings-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
        })}
      >
          <Tab.Screen
            name="Feed"
            component={FeedScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Liste"
            component={ListeScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
          name="Parametre"
          component={ParametreScreen}
          options={{ headerShown: false }}
        />
        </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;

import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from './screens/SignupScreen';
import SearchScreen from './screens/SearchScreen';
import FeedScreen from './screens/FeedScreen';
import ProfilePromoteur from './screens/ProfilePromoteurScreen';
import BottomTabNavigator from './screens/BottomTabNavigator';
import { AuthProvider } from './AuthContext';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
]);


const Stack = createNativeStackNavigator();

const theme = extendTheme({
  colors: {
    primary: {
      500: '#ffffff', 
      600: '#c77dff', 
      700: '#e5e5e5',
    },
    secondary: {
      500: '#000000',
    },
    darkBackground: '#0f0f0f', 
    darkText: '#ffffff',
  },
  config: {
    initialColorMode: 'dark',
  },
});

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <AuthProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.darkBackground }}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen
                name="Feed"
                component={FeedScreen}
                options={{ headerShown: false }}
              /> */}
              <Stack.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
              name="ProfilePromoteur"
              component={ProfilePromoteur}
              options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
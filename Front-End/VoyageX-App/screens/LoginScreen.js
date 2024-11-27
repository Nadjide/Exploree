import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from 'react-native'; 
import { Box, Heading, VStack, FormControl, Input, Button, Center, HStack, Text, useTheme } from 'native-base';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import { Image } from "react-native";
import { SERVER_IP } from '../config';


const LoginScreen = () => {
  const navigation = useNavigation();
  const { login: contextLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { colors } = useTheme();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_IP}/v1/user/login`, {
        email,
        password,
      });

      if (response.data) {
        contextLogin(response.data.user);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <Center flex={1} bg={colors.background}>
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          color={colors.secondary[500]}
          fontWeight="600"
          textAlign="center"
        >
          Se connecter
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label
              _text={{
                color: colors.secondary[500],
                fontSize: "sm",
                fontWeight: "medium"
              }}
            >
              Email
            </FormControl.Label>
            <Input
              variant="filled"
              bg={colors.primary[500]}
              color={colors.secondary[500]}
              placeholder="Entrez votre email"
              _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
              onChangeText={(text) => setEmail(text)}
            />
          </FormControl>

          <FormControl mb="5">
            <FormControl.Label
              _text={{
                color: colors.secondary[500],
                fontSize: "sm",
                fontWeight: "medium"
              }}
            >
              Mot de passe
            </FormControl.Label>
            <Input
              type="password"
              variant="filled"
              bg={colors.primary[500]}
              color={colors.secondary[500]}
              placeholder="Entrez votre mot de passe"
              _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
              onChangeText={(text) => setPassword(text)}
            />
          </FormControl>

          <Button
            mt="2"
            colorScheme="primary"
            borderColor={colors.secondary[500]}
            _text={{ color: colors.secondary[500] }}
            onPress={() => navigation.navigate("Home")}
          >
            Se connecter
          </Button>

          <HStack justifyContent="center" align="center" mt="4">
            <Button
              variant="link"
              _text={{ color: colors.secondary[500], fontWeight: 'medium', fontSize: "sm" }}
              onPress={() => navigation.navigate("Signup")}
            >
              S'inscrire
            </Button>

            <Text bold color={colors.secondary[500]} mx="2">
              ou
            </Text>

            <Button
              variant="link"
              _text={{ color: colors.secondary[500], fontWeight: 'medium', fontSize: "sm" }}
              onPress={() => navigation.navigate("SignupPro")}
            >
              Compte Pro ?
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Box, Heading, VStack, FormControl, Input, Button, Center, useTheme, Icon, Text } from 'native-base';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import { SERVER_IP } from '../config';
import { MaterialIcons } from '@expo/vector-icons';

const SignupScreen = () => {
    const navigation = useNavigation();
    const { signup } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [telephone, setTelephone] = useState('+33');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [dateError, setDateError] = useState('');
    const [telephoneError, setTelephoneError] = useState('');

    const { colors } = useTheme();

    const validateEmail = (text) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmail(text);
        setEmailError(emailRegex.test(text) ? '' : 'Email non valide');
    };

    const validatePassword = (text) => {
        setPassword(text);
        let error = '';
        if (text.length < 8) {
            error = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (!/\d/.test(text)) {
            error = 'Le mot de passe doit contenir au moins un chiffre';
        } else if (!/[!@#$%^&*]/.test(text)) {
            error = 'Le mot de passe doit contenir au moins un caractère spécial';
        }
        setPasswordError(error);
    };

    const formatDate = (text) => {
        let cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 2) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }
        if (cleaned.length >= 4) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
        }
        if (cleaned.length > 8) {
            formatted = formatted.slice(0, 10);
        }
        setDateNaissance(formatted);
        setDateError(cleaned.length === 8 ? '' : 'Date de naissance non valide');
    };

    const formatTelephone = (text) => {
        let cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.startsWith('33')) {
            cleaned = cleaned.slice(2);
        }
        let formatted = '+33' + cleaned;
        if (cleaned.length > 9) {
            formatted = formatted.slice(0, 12);
        }
        setTelephone(formatted);
        setTelephoneError(cleaned.length === 9 ? '' : 'Numéro de téléphone non valide');
    };

    const handleSignup = async () => {
        try {
            if (!username || !email || !password || !nom || !prenom || !dateNaissance || !telephone) {
                alert('Données manquantes');
                return;
            }
            if (passwordError || emailError || dateError || telephoneError) {
                alert('Corrigez les erreurs avant de soumettre');
                return;
            }

            const response = await axios.post(`${SERVER_IP}/v1/user/signup`, {
                username: `@${username}`,
                email,
                password,
                nom,
                prenom,
                dateNaissance,
                telephone,
            });

            if (response.data) {
                await signup(email, password);
                signup(response.data.user);
                navigation.navigate("Home");
            }
        } catch (error) {
            console.error(error);
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
                        S'inscrire
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
                                Nom d'utilisateur
                            </FormControl.Label>
                            <Input
                                InputLeftElement={<Icon as={MaterialIcons} name="person" size="sm" ml="2" />}
                                variant="filled"
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="Entrez votre nom d'utilisateur"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => setUsername(text)}
                                value={username}
                            />

                            <FormControl.Label
                                _text={{
                                    color: colors.secondary[500],
                                    fontSize: "sm",
                                    fontWeight: "medium"
                                }}
                            >
                                Prénom
                            </FormControl.Label>
                            <Input
                                variant="filled"
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="Entrez votre prénom"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => setPrenom(text)}
                                value={prenom}
                            />

                            <FormControl.Label
                                _text={{
                                    color: colors.secondary[500],
                                    fontSize: "sm",
                                    fontWeight: "medium"
                                }}
                            >
                                Nom
                            </FormControl.Label>
                            <Input
                                variant="filled"
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="Entrez votre nom"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => setNom(text)}
                                value={nom}
                            />

                            <FormControl.Label
                                _text={{
                                    color: colors.secondary[500],
                                    fontSize: "sm",
                                    fontWeight: "medium"
                                }}
                            >
                                Date de naissance
                            </FormControl.Label>
                            <Input
                                variant="filled"
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="JJ/MM/AAAA"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => formatDate(text)}
                                value={dateNaissance}
                                keyboardType="numeric"
                            />
                            {dateError ? <Text style={{ color: 'red' }}>{dateError}</Text> : null}

                            <FormControl.Label
                                _text={{
                                    color: colors.secondary[500],
                                    fontSize: "sm",
                                    fontWeight: "medium"
                                }}
                            >
                                Téléphone
                            </FormControl.Label>
                            <Input
                                variant="filled"
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="+33 6 12 34 56 78"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => formatTelephone(text)}
                                value={telephone}
                                keyboardType="phone-pad"
                            />
                            {telephoneError ? <Text style={{ color: 'red' }}>{telephoneError}</Text> : null}

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
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="Entrez votre email"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => validateEmail(text)}
                                value={email}
                                keyboardType="email-address"
                            />
                            {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}

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
                                bg={colors.primary[700]}
                                color={colors.secondary[500]}
                                placeholder="Entrez votre mot de passe"
                                _focus={{ borderColor: colors.secondary[500], color: colors.secondary[500] }}
                                onChangeText={(text) => validatePassword(text)}
                                value={password}
                            />
                            {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
                        </FormControl>
                        <Button
                            mt="2"
                            bg={colors.primary[600]}
                            _text={{ color: 'white' }}
                            onPress={handleSignup}
                        >
                            S'inscrire
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;
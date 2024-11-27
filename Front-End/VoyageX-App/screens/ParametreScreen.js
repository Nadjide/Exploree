import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Avatar } from 'native-base';
import axios from 'axios';
import { SERVER_IP } from '../config';
import { useAuth } from '../AuthContext';

export default function ParametreScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${SERVER_IP}/v1/user/${user.id}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Utilisateur non connecté</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
        <Avatar size="2xl" source={imageUri ? { uri: imageUri } : require('../assets/logo.png')} mb="4" />
            <Text style={styles.username}>{userData.username}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>
            <View style={styles.row}>
                <Text style={styles.rowText}>Email</Text>
                <Text style={styles.rowValue}>{userData.email}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Nom</Text>
                <Text style={styles.rowValue}>{userData.nom}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Prénom</Text>
                <Text style={styles.rowValue}>{userData.prenom}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Date de naissance</Text>
                <Text style={styles.rowValue}>{userData.dateNaissance}</Text>
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Préférences</Text>
            <View style={styles.row}>
                <Text style={styles.rowText}>Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Mode sombre</Text>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                />
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sécurité</Text>
            <View style={styles.row}>
                <Text style={styles.rowText}>Changer le mot de passe</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Activer la vérification en deux étapes</Text>
            </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.row}>
                <Text style={styles.rowText}>FAQ</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Contactez-nous</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Conditions d'utilisation</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.rowText}>Politique de confidentialité</Text>
            </View>
        </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 16,
  },
  rowValue: {
    fontSize: 16,
    color: '#666',
  },
});
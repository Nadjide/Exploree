import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, TextInput, Modal, StatusBar } from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_IP } from '../config';
import { Box, Button, VStack, HStack } from 'native-base';

const ListeScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activiteId, setActiviteId] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [dateHeure, setDateHeure] = useState(new Date());
  const [nombrePersonnes, setNombrePersonnes] = useState('');
  const { user } = useAuth();
  const userId = user?.id;
  const userName = user?.username;
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesResponse = await axios.get(`${SERVER_IP}/v1/activite`);
        setActivities(activitiesResponse.data);
        const restaurantsResponse = await axios.get(`${SERVER_IP}/v1/restaurant`);
        setRestaurants(restaurantsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleReservation = async () => {
    try {
      await axios.post(`${SERVER_IP}/v1/reservation`, {
        userId,
        activiteId: activiteId || null,
        restaurantId,
        dateHeure: dateHeure.toISOString(),
        nombrePersonnes: parseInt(nombrePersonnes),
        statut: 'En attente'
      });
      setModalVisible(false);
      alert('Reservation faite avec succès!');
    } catch (error) {
      console.error('Erreur lors de la reservation', error);
      alert('Error making reservation. Please try again later.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateHeure(selectedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Bienvenue, {userName}!</Text>
      </View>
      <View style={styles.categories}>
        <Text style={styles.categoryTitle}>Activities</Text>
        <View style={styles.cardContainer}>
          {activities.map(activity => (
            <Pressable
              key={activity.id}
              style={styles.card}
              onPress={() => {
                setActiviteId(activity.id);
                setRestaurantId('');
                setModalVisible(true);
              }}
            >
              <Image source={{ uri: activity.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{activity.titreAct}</Text>
                <Text style={styles.cardSubtitle}>{activity.adresse}</Text>
                <Text style={styles.cardSubtitle}>{activity.typeActivite}</Text>
                <Text style={styles.cardSubtitle}>{activity.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.categories}>
        <Text style={styles.categoryTitle}>Restaurants</Text>
        <View style={styles.cardContainer}>
          {restaurants.map(restaurant => (
            <Pressable
              key={restaurant.id}
              style={styles.card}
              onPress={() => {
                setRestaurantId(restaurant.id);
                setActiviteId('');
                setModalVisible(true);
              }}
            >
              <Image source={{ uri: restaurant.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{restaurant.nomRestaurant}</Text>
                <Text style={styles.cardSubtitle}>{restaurant.adresse}</Text>
                <Text style={styles.cardSubtitle}>{restaurant.typeCuisine}</Text>
                <Text style={styles.cardPrice}>Prix moyen {restaurant.prixMoyen} €</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Faire une reservation</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.modalInput}
                placeholder="Date et Heure"
                value={dateHeure.toLocaleString()}
                editable={false}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateHeure}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de personnes"
              onChangeText={setNombrePersonnes}
              value={nombrePersonnes}
              keyboardType="numeric"
            />
            <VStack space={2} mt={4}>
              <Button onPress={handleReservation} colorScheme="emerald">
                Envoyer
              </Button>
              <Button onPress={() => setModalVisible(false)} colorScheme="gray">
                Annuler
              </Button>
            </VStack>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfo: {
    marginTop: 50,
    padding: 10,
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  categories: {
    padding: 10,
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  cardPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
});

export default ListeScreen;
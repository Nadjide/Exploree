import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, TextInput, Modal, StatusBar } from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_IP } from '../config';
import { Box, Button, VStack, HStack } from 'native-base';

const hardcodedRestaurants = [
  {
    id: 1,
    nomRestaurant: "Dayou Pâtisserie",
    adresse: "42 rue Bréguet, 75011, Paris",
    typeCuisine: "Pâtisserie",
    bio: "Pâtisserie française raffinée dans un cadre élégant.",
    prixMoyen: 20,
    image: "https://www.le-bistro-restaurant-cassis.com/websites/3bea309896e4c43398fffa3adbc980bc/img/photo11_20210215150112.jpg",
    latitude: 48.8566,
    longitude: 2.3522,
    promoteurId: 1
  },
  {
    id: 2,
    nomRestaurant: "Marvelli",
    adresse: "56 Rue de Rivoli, 75004, Paris",
    typeCuisine: "Italien",
    bio: "Restaurant offrant une vue imprenable sur la ville.",
    prixMoyen: 30,
    image: "https://media-cdn.tripadvisor.com/media/photo-s/01/88/b0/07/salle-du-restaurant-pic.jpg",
    latitude: 48.8566,
    longitude: 2.3522,
    promoteurId: 2
  },
  {
    id: 3,
    nomRestaurant: "Jaipur Café",
    adresse: "12 Rue de la République, 75001, Paris",
    typeCuisine: "Indien",
    bio: "Restaurant chaleureux avec cuisine traditionnelle indienne.",
    prixMoyen: 25,
    image: "https://www.myboutiquehotel.com/photos/6918/maison-dhotes-du-cote-de-chez-anne-strasbourg-048-61467-1110x700.jpg",
    latitude: 48.8566,
    longitude: 2.3522,
    promoteurId: 3
  },
  {
    id: 4,
    nomRestaurant: "Sixta",
    adresse: "42 Rue de Bayard, 31000 Toulouse",
    typeCuisine: "Végétarien",
    bio: "Sixta est un restaurant végétarien.",
    prixMoyen: 15,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrFYTub1yNs6VsHlB2dHkpsKomt_-EvajLW_RSYLqWhw&s",
    latitude: 43.6045,
    longitude: 1.444,
    promoteurId: 4
  },
  {
    id: 5,
    nomRestaurant: "Baba",
    adresse: "34 Avenue des Champs-Élysées, 75008, Paris",
    typeCuisine: "Français",
    bio: "Baba convivial proposant une cuisine variée et de qualité.",
    prixMoyen: 35,
    image: "https://images.squarespace-cdn.com/content/v1/5f631fe01807e96e3404bd87/1643729887323-RE9D7AA7YM67JITBK9QB/IMG-20220125-WA0054.jpg",
    latitude: 48.8566,
    longitude: 2.3522,
    promoteurId: 5
  },
  {
    id: 6,
    nomRestaurant: "Chikinmos",
    adresse: "Calle del General Díaz Porlier, 38, Bajo Local, Salamanca, 28001 Madrid, Espagne",
    typeCuisine: "Coréen",
    bio: "Cuisine à base de Tapas Coréen.",
    prixMoyen: 20,
    image: "https://lh5.googleusercontent.com/p/AF1QipN0KAD2RdPgtfxXs52Vl4R_tTA_aQRvj-rO211N=w426-h240-k-no",
    latitude: 40.4168,
    longitude: -3.7038,
    promoteurId: 6
  }
];

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

  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const activitiesResponse = await axios.get(`${SERVER_IP}/v1/activite`);
  //       setActivities(activitiesResponse.data);
  //       const restaurantsResponse = await axios.get(`${SERVER_IP}/v1/restaurant`);
  //       // setRestaurants(restaurantsResponse.data);
        
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    // Simulate fetching data from an API
    setRestaurants(hardcodedRestaurants);
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
        <Text style={styles.userName}>Bienvenue, Nadjide{userName}!</Text>
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
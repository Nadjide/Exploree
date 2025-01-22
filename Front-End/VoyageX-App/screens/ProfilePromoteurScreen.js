import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { Box, VStack, Avatar, Divider } from 'native-base';
import axios from 'axios';
import { SERVER_IP } from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';

const hardcodedData = [
  {
    id: 5,
    role: "Promoteur",
    nomEntreprise: "Dayou Pâtisserie",
    siret: "45678901234567",
    adresse: "42 rue Bréguet, 75011, Paris",
    mail: "contact@Dayou.fr",
    codePostal: "75011",
    ville: "Paris",
    pays: "France",
    telephone: "0456789012",
    image: "https://www.le-bistro-restaurant-cassis.com/websites/3bea309896e4c43398fffa3adbc980bc/img/photo11_20210215150112.jpg",
    bio: "Pâtisserie française raffinée dans un cadre élégant.",
    createdDate: "2024-05-14T00:00:00.000Z",
    updatedDate: "2024-05-14T00:00:00.000Z",
    restaurants: [
      {
        nomRestaurant: "Dayou Pâtisserie",
        adresse: "42 rue Bréguet, 75011, Paris",
        typeCuisine: "Pâtisserie",
        bio: "Pâtisserie française raffinée dans un cadre élégant.",
        prixMoyen: 45,
        image: "https://www.le-bistro-restaurant-cassis.com/websites/3bea309896e4c43398fffa3adbc980bc/img/photo11_20210215150112.jpg",
        latitude: 48.85848790421277,
        longitude: 2.3761773396048196,
        promoteurId: "67629a0dd22d5742330c0d62",
      }
    ],
  },
  {
    id: 4,
    role: "Promoteur",
    nomEntreprise: "Marvelli",
    siret: "34567890123456",
    adresse: "56 Rue de Rivoli",
    mail: "contact@Marvelli.fr",
    codePostal: "75004",
    ville: "Paris",
    pays: "France",
    telephone: "0345678901",
    image: "https://media-cdn.tripadvisor.com/media/photo-s/01/88/b0/07/salle-du-restaurant-pic.jpg",
    bio: "Restaurant offrant une vue imprenable sur la ville.",
    createdDate: "2024-05-14T00:00:00.000Z",
    updatedDate: "2024-05-14T00:00:00.000Z",
    restaurants: [
      {
        nomRestaurant: "Marvelli",
        adresse: "56 Rue de Rivoli",
        typeCuisine: "Cuisine française",
        bio: "Restaurant offrant une vue imprenable sur la ville.",
        prixMoyen: 50,
        image: "https://media-cdn.tripadvisor.com/media/photo-s/01/88/b0/07/salle-du-restaurant-pic.jpg",
        latitude: 48.85735532599119,
        longitude: 2.353269997275561,
        promoteurId: "67629a0dd22d5742330c0d63",
      }
    ],
  },
  {
    id: 2,
    role: "Promoteur",
    nomEntreprise: "Jaipur Café",
    siret: "12345678901234",
    adresse: "12 Rue de la République",
    mail: "contact@JaipurCafé.fr",
    codePostal: "75001",
    ville: "Paris",
    pays: "France",
    telephone: "0123456789",
    image: "https://www.myboutiquehotel.com/photos/6918/maison-dhotes-du-cote-de-chez-anne-strasbourg-048-61467-1110x700.jpg",
    bio: "Restaurant chaleureux avec cuisine traditionnelle indienne.",
    createdDate: "2024-05-14T00:00:00.000Z",
    updatedDate: "2024-05-14T00:00:00.000Z",
    restaurants: [
      {
        nomRestaurant: "Jaipur Café",
        adresse: "12 Rue de la République",
        typeCuisine: "Cuisine traditionnelle indienne",
        bio: "Restaurant chaleureux avec cuisine traditionnelle indienne.",
        prixMoyen: 30,
        image: "https://www.myboutiquehotel.com/photos/6918/maison-dhotes-du-cote-de-chez-anne-strasbourg-048-61467-1110x700.jpg",
        latitude: 48.8666404187927,
        longitude: 2.3668062390331994,
        promoteurId: "67629a0dd22d5742330c0d64",
      }
    ],
  },
  {
    id: 1,
    role: "Promoteur",
    nomEntreprise: "Sixta",
    siret: "123456789012345",
    adresse: "42 Rue de Bayard, 31000 Toulouse",
    mail: "Sixta@gmail.fr",
    codePostal: "31000",
    ville: "Toulouse",
    pays: "France",
    telephone: "0102030405",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrFYTub1yNs6VsHlB2dHkpsKomt_-EvajLW_RSYLqWhw&s",
    bio: "Sixta est un restaurant vegetarien",
    createdDate: "2024-05-01T10:00:00.000Z",
    updatedDate: "2024-05-01T11:00:00.000Z",
    restaurants: [
      {
        nomRestaurant: "Sixta",
        adresse: "42 Rue de Bayard, 31000 Toulouse",
        typeCuisine: "Française",
        bio: "Sixta restaurant situé a 42 Rue de Bayard, 31000 Toulouse",
        prixMoyen: 50,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrFYTub1yNs6VsHlB2dHkpsKomt_-EvajLW_RSYLqWhw&s",
        latitude: 43.60994061387975,
        longitude: 1.4500124240383268,
        promoteurId: "67629a0dd22d5742330c0d65",
      }
    ],
  },
  {
    id: 3,
    role: "Promoteur",
    nomEntreprise: "Baba",
    siret: "23456789012345",
    adresse: "34 Avenue des Champs-Élysées",
    mail: "contact@Baba.fr",
    codePostal: "75008",
    ville: "Paris",
    pays: "France",
    telephone: "0234567890",
    image: "https://images.squarespace-cdn.com/content/v1/5b7b3f3b7e3c3a7b3f3b7e3c/1534800000000-3ZQZQZQZQZQZQZQZQZQZ/IMG_20180820_191013.jpg",
    bio: "Restaurant de cuisine traditionnelle turque.",
    createdDate: "2024-05-14T00:00:00.000Z",
    updatedDate: "2024-05-14T00:00:00.000Z",
    restaurants: [
      {
        nomRestaurant: "Baba",
        adresse: "34 Avenue des Champs-Élysées",
        typeCuisine: "Cuisine française",
        bio: "Bistrot convivial proposant une cuisine française de qualité.",
        prixMoyen: 40,
        image: "https://images.squarespace-cdn.com/content/v1/5f631fe01807e96e3404bd87/1643729887323-RE9D7AA7YM67JITBK9QB/IMG-20220125-WA0054.jpg",
        latitude: 48.870221355398286,
        longitude: 2.308149127959435,
        promoteurId: "67629a0dd22d5742330c0d66",
      }
    ],
  },
  {
    id: 6,
    role: "Promoteur",
    nomEntreprise: "Chikinmos",
    siret: "345266185358",
    adresse: "Calle del General Díaz Porlier, 38, Bajo Local, Salamanca, 28001 Madrid, Espagne",
    mail: "Chikinmos@contact.com",
    codePostal: "28001",
    ville: "Madrid",
    pays: "Espagne",
    telephone: "003457589294",
    image: "https://lh5.googleusercontent.com/p/AF1QipN0KAD2RdPgtfxXs52Vl4R_tTA_aQRvj-rO211N=w426-h240-k-no",
    bio: "Cuisine à base de Tapas Coréen",
    createdDate: "2024-05-15T10:00:00.000Z",
    updatedDate: "2024-05-15T10:00:00.000Z",
    restaurants: [
      {
        nomRestaurant: "Chikinmos",
        adresse: "Calle del General Díaz Porlier, 38, Bajo Local, Salamanca, 28001 Madrid, Espagne",
        typeCuisine: "Coréen",
        bio: "Cuisine à base de Tapas Coréen",
        prixMoyen: 70,
        image: "https://lh5.googleusercontent.com/p/AF1QipN0KAD2RdPgtfxXs52Vl4R_tTA_aQRvj-rO211N=w426-h240-k-no",
        latitude: 40.43555743610072,
        longitude: -3.678136151498584,
        promoteurId: "67629a0dd22d5742330c0d67",
      }
    ],
  },
];

const ProfilePromoteur = ({ route }) => {
  const { id } = route.params;
  const [promoteur, setPromoteur] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const fetchPromoteur = async () => {
      try {
        const promoteurData = hardcodedData.find((promoteur) => promoteur.id === id);
        if (promoteurData) {
          setPromoteur(promoteurData);
          setRestaurants(promoteurData.restaurants);

          if (promoteurData.restaurants.length > 0) {
            setInitialRegion({
              latitude: promoteurData.restaurants[0].latitude,
              longitude: promoteurData.restaurants[0].longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPromoteur();
  }, [id]);

  if (!promoteur) {
    return <Text>Chargement...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Box safeArea p="2" w="100%" mx="auto" py="8">
        <VStack space={4} alignItems="center">
          <Avatar size="2xl" source={{ uri: promoteur.image || 'https://example.com/default_avatar.png' }} />
          <Text style={styles.name}>{promoteur.nomEntreprise}</Text>
          <Text style={styles.bio}>{promoteur.bio}</Text>
        </VStack>
        <Divider my="4" />

        <View style={styles.mapContainer}>
          {initialRegion && (
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={true}
            >
              {restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  coordinate={{
                    latitude: restaurant.latitude,
                    longitude: restaurant.longitude,
                  }}
                  title={restaurant.nomRestaurant}
                  description={restaurant.adresse}
                />
              ))}
            </MapView>
          )}
        </View>

        <View style={styles.soonContainer}>
          <Text style={styles.soonText}>Prochainement...</Text>
          <View style={styles.gridContainer}>
            {[...Array(9)].map((_, index) => (
              <View key={index} style={styles.gridItem}>
                <Ionicons name="videocam" size={40} color="black" style={styles.iconStyle} />
                <View style={styles.gridOverlay}>
                  <Ionicons name="lock-closed" size={30} color="white" />
                </View>
              </View>
            ))}
          </View>
        </View>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  bio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    marginVertical: 20,
    width: '100%',
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  soonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  soonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4500',
    marginBottom: 10,
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    height: 100,
    backgroundColor: 'transparent',
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconStyle: {
    opacity: 0.3,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfilePromoteur;
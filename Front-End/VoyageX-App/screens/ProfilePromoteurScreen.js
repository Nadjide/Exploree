import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { Box, VStack, Avatar, Divider } from 'native-base';
import axios from 'axios';
import { SERVER_IP } from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';

const ProfilePromoteur = ({ route }) => {
  const { id } = route.params;
  const [promoteur, setPromoteur] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const fetchPromoteur = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/v1/promoteur/${id}`);
        setPromoteur(response.data);

        const restaurantsResponse = await axios.get(`${SERVER_IP}/v1/restaurants?promoteurId=${id}`);
        setRestaurants(restaurantsResponse.data);

        if (restaurantsResponse.data.length > 0) {
          setInitialRegion({
            latitude: restaurantsResponse.data[0].latitude,
            longitude: restaurantsResponse.data[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
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
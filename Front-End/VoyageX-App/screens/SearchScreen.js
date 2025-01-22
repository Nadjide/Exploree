import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SERVER_IP } from '../config';


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

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [activites, setActivites] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filteredActivites, setFilteredActivites] = useState([]);
  const [location, setLocation] = useState(null);
  const [userHasMovedMap, setUserHasMovedMap] = useState(false);
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  // useEffect(() => {
  //   const fetchRestaurantsAndActivites = async () => {
  //     try {
  //       const restaurantsResponse = await axios.get(`${SERVER_IP}/v1/restaurant`, { timeout: 5000 });
  //       setRestaurants(restaurantsResponse.data);
  //       setFilteredRestaurants(restaurantsResponse.data);

  //       const activitesResponse = await axios.get(`${SERVER_IP}/v1/activite`, { timeout: 5000 });
  //       setActivites(activitesResponse.data);
  //       setFilteredActivites(activitesResponse.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchRestaurantsAndActivites();
  // }, []);

  useEffect(() => {
    setRestaurants(hardcodedRestaurants);
    setFilteredRestaurants(hardcodedRestaurants);
  }, []);

  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 60000,
          distanceInterval: 0,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    };

    getLocationAsync();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredRestaurants(restaurants);
      setFilteredActivites(activites);
    } else {
      setFilteredRestaurants(
        restaurants.filter((restaurant) =>
          restaurant.nomRestaurant.toLowerCase().includes(text.toLowerCase()),
        )
      );
      setFilteredActivites(
        activites.filter((activite) =>
          activite.titreAct.toLowerCase().includes(text.toLowerCase()),
        )
      );
    }
  };

  const handleRestaurantPress = (restaurant) => {
    setUserHasMovedMap(true);
    mapRef.current.animateToRegion({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);

    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        style={styles.input}
        placeholder="Rechercher..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          onPanDrag={() => setUserHasMovedMap(true)}
          region={
            userHasMovedMap
              ? undefined
              : {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0522,
                  longitudeDelta: 0.0421,
                }
          }
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
            >
              <Image
                source={require("../assets/icon_map.png")}
                style={{ height: 15, width: 15 }}
              />
            </Marker>
          ))}
          {activites.map((activite) => (
            <Marker
              key={activite.id}
              coordinate={{
                latitude: activite.latitude,
                longitude: activite.longitude,
              }}
              title={activite.titreAct}
              description={activite.adresse}
            >
              <Image
                source={require("../assets/icon_map.png")}
                style={{ height: 15, width: 15 }}
              />
            </Marker>
          ))}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Restaurants:</Text>
        {filteredRestaurants.map((restaurant) => (
          <TouchableOpacity key={restaurant.id} style={styles.resultCard} onPress={() => handleRestaurantPress(restaurant)}>
            {restaurant.image && (
              <Image source={{ uri: restaurant.image }} style={styles.image} />
            )}
            <Text style={styles.resultTitle}>{restaurant.nomRestaurant}</Text>
            <Text>{restaurant.adresse}</Text>
            <Text>Type de cuisine: {restaurant.typeCuisine}</Text>
            <Text>{restaurant.bio}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.resultsTitle}>Activités:</Text>
        {filteredActivites.map((activite) => (
          <View key={activite.id} style={styles.resultCard}>
            {activite.image && (
              <Image source={{ uri: activite.image }} style={styles.image} />
            )}
            <Text style={styles.resultTitle}>{activite.titreAct}</Text>
            <Text>{activite.description}</Text>
            <Text>{activite.adresse}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    padding: 12,
    marginVertical: 20,
    marginHorizontal: 10,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: "transparent",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  resultsContainer: {
    padding: 10,
  },
  resultCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultsTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
});

export default SearchScreen;
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

  useEffect(() => {
    const fetchRestaurantsAndActivites = async () => {
      try {
        const restaurantsResponse = await axios.get(`${SERVER_IP}/v1/restaurant`, { timeout: 5000 });
        setRestaurants(restaurantsResponse.data);
        setFilteredRestaurants(restaurantsResponse.data);

        const activitesResponse = await axios.get(`${SERVER_IP}/v1/activite`, { timeout: 5000 });
        setActivites(activitesResponse.data);
        setFilteredActivites(activitesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRestaurantsAndActivites();
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
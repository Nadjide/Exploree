import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Box, VStack, Text, Button, Avatar, HStack, Input, Heading, useTheme, Modal } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { SERVER_IP } from '../config';
import { supabase } from '../supabase';
import * as FileSystem from 'expo-file-system';

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedReservation, setUpdatedReservation] = useState({});
  const [image, setImage] = useState(null);
  const [permissionCheck, setPermissionCheck] = useState(null);
  const isFocused = useIsFocused();
  const [imageUri, setImageUri] = useState(null);


  useEffect(() => {
    (async () => {
      const status = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!status.granted) {
        const newStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermissionCheck(newStatus);
      } else {
        setPermissionCheck(status);
      }
    })();
  }, []);

  const fetchReservations = async () => {
    try {
      if (!user || !user.id) {
        console.error('User is not authenticated');
        return;
      }
      const response = await axios.get(`${SERVER_IP}/v1/user/${user.id}/reservations`);
      const reservations = response.data;

      const detailedReservations = await Promise.all(
        reservations.map(async (reservation) => {
          if (reservation.restaurantId) {
            const restaurantResponse = await axios.get(`${SERVER_IP}/v1/restaurant/${reservation.restaurantId}`);
            return { ...reservation, restaurant: restaurantResponse.data };
          }
          if (reservation.activiteId) {
            const activiteResponse = await axios.get(`${SERVER_IP}/v1/activite/${reservation.activiteId}`);
            return { ...reservation, activite: activiteResponse.data };
          }
          return reservation;
        })
      );

      setReservations(detailedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchReservations();
      }
    }, [user, isFocused])
  );

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`${SERVER_IP}/v1/reservation/${reservationId}`);
      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleOpenModal = (reservation) => {
    setUpdatedReservation(reservation);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setUpdatedReservation({});
    setModalVisible(false);
  };

  const handleUpdateReservation = async () => {
    try {
      await axios.put(`${SERVER_IP}/v1/reservation/${updatedReservation.id}`, updatedReservation);
      setReservations(reservations.map((reservation) => reservation.id === updatedReservation.id ? updatedReservation : reservation));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  if (!permissionCheck) {
    return null;
  }

  if (permissionCheck && !permissionCheck.granted) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text color={colors.secondary[500]}>Permission denied</Text>
        <Text color={colors.secondary[500]}>Please allow access to your media library</Text>
        <Button color={colors.secondary[500]} onPress={() => setPermissionCheck(ImagePicker.requestMediaLibraryPermissionsAsync())}>Allow access</Button>
      </Box>
    );
  }

  return (
    <ScrollView bg={colors.darkBackground}>
      <VStack space={4} px="5" py="4" marginTop={20}>
        <Box bg={colors.primary[700]} p="5" rounded="md" alignItems="center">
        <Avatar size="2xl" source={imageUri ? { uri: imageUri } : require('../assets/logo.png')} mb="4" />
          <Heading size="lg" color={colors.secondary[500]}>{user?.username}</Heading>
          <Text color={colors.secondary[500]}>{user?.email}</Text>
        </Box>

        {reservations.length === 0 ? (
          <Text color={colors.secondary[500]}>Aucune réservation</Text>
        ) : (
          reservations.map((reservation, index) => (
            <Box key={index} bg={colors.primary[700]} p="5" rounded="md" mb="4">
              <VStack space={3}>
                <Image
                  source={{ uri: reservation.restaurant ? reservation.restaurant.image : 'https://via.placeholder.com/150' }}
                  style={{ width: '100%', height: 200, borderRadius: 10 }}
                />
                <Text color={colors.secondary[500]} bold fontSize="lg">
                  {reservation.restaurant ? reservation.restaurant.nomRestaurant : 'Activité'}
                </Text>
                <Text color={colors.secondary[500]}>
                  {reservation.restaurant ? reservation.restaurant.typeCuisine : ''}
                </Text>
                <Text color={colors.secondary[500]}>
                  {reservation.restaurant ? reservation.restaurant.adresse : ''}
                </Text>
                <Text color={colors.secondary[500]}>
                  {reservation.dateHeure ? new Date(reservation.dateHeure).toLocaleString() : 'Date inconnue'}
                </Text>
                <Text color={colors.secondary[500]}>
                  Nombre de personnes: {reservation.nombrePersonnes}
                </Text>
                <Text color={colors.secondary[500]}>
                  Statut: {reservation.statut}
                </Text>
                <HStack justifyContent="flex-end" space={2}>
                  <Button size="sm" colorScheme="red" onPress={() => handleDeleteReservation(reservation.id)}>Supprimer</Button>
                  <Button size="sm" colorScheme="emerald" onPress={() => handleOpenModal(reservation)}>Modifier</Button>
                </HStack>
              </VStack>
            </Box>
          ))
        )}

        <Button onPress={handleLogout} color={colors.secondary[500]} mt={4}>Se Déconnecter</Button>
      </VStack>

      <Modal isOpen={modalVisible} onClose={handleCloseModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Modifier la réservation</Modal.Header>
          <Modal.Body>
            <Input
              mt="3"
              placeholder="Date et heure"
              value={updatedReservation.dateHeure}
              onChangeText={(text) => setUpdatedReservation({ ...updatedReservation, dateHeure: text })}
            />
            <Input
              mt="3"
              placeholder="Nombre de personnes"
              value={`${updatedReservation.nombrePersonnes}`}
              onChangeText={(text) => setUpdatedReservation({ ...updatedReservation, nombrePersonnes: text })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={handleCloseModal}>
                Annuler
              </Button>
              <Button onPress={handleUpdateReservation}>
                Modifier
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Dimensions, FlatList, StyleSheet, Pressable, Text, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { SERVER_IP } from '../config';

const videos = [
  { id: 1, video: require('../video/video1.mp4'), likes: 5, comments: 0, shares: 0, restaurant: 'Sixta', title: 'Dégustation exceptionnelle' },
  { id: 2, video: require('../video/video2.mp4'), likes: 1, comments: 0, shares: 0, restaurant: 'Jaipur Café', title: 'Plats traditionnels' },
  { id: 3, video: require('../video/video3.mp4'), likes: 7, comments: 0, shares: 0, restaurant: 'Baba', title: 'Innovations culinaires' },
  { id: 4, video: require('../video/video4.mp4'), likes: 4, comments: 0, shares: 0, restaurant: 'Marvelli', title: 'Sommet de la gastronomie' },
  { id: 5, video: require('../video/video5.mp4'), likes: 11, comments: 0, shares: 0, restaurant: 'Dayou Pâtisserie', title: 'Ambiance cosy et plats délicieux' },
  { id: 6, video: require('../video/video6.mp4'), likes: 20, comments: 0, shares: 0, restaurant: 'Chikinmos', title: 'Cuisine à base de Tapas Coréen' },
];

export default function FeedScreen() {
  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height;
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const flatListRef = useRef(null);
  const [promoteurs, setPromoteurs] = useState({});
  const [likes, setLikes] = useState({});
  const [likedVideos, setLikedVideos] = useState({});

  useEffect(() => {
    async function setAudioMode() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    }
    setAudioMode();

    const initialLikes = {};
    const initialLikedVideos = {};
    videos.forEach(video => {
      initialLikes[video.id] = video.likes;
      initialLikedVideos[video.id] = false;
    });
    setLikes(initialLikes);
    setLikedVideos(initialLikedVideos);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleProfilePress = (id) => {
    navigation.navigate('ProfilePromoteur', { id: id });
  };

  const fetchPromoteurImage = async (id) => {
    try {
      const response = await axios.get(`${SERVER_IP}/v1/promoteur/${id}`);
      setPromoteurs(prevState => ({ ...prevState, [id]: response.data.image }));
    } catch (error) {
      console.error('Error fetching promoteur image:', error);
    }
  };

  useEffect(() => {
    videos.forEach(video => fetchPromoteurImage(video.id));
  }, []);

  const handleLikePress = (id) => {
    setLikedVideos(prevState => {
      const newLikedVideos = { ...prevState, [id]: !prevState[id] };
      setLikes(prevLikes => {
        const newLikes = { ...prevLikes };
        newLikes[id] = newLikedVideos[id] ? newLikes[id] + 1 : newLikes[id] - 1;
        return newLikes;
      });
      return newLikedVideos;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} />
      <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search" size={30} color="white" />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={({ item, index }) => (
          <Item
            item={item}
            shouldPlay={index === currentViewableItemIndex}
            videoHeight={windowHeight}
            handleProfilePress={handleProfilePress}
            promoteurImage={promoteurs[item.id]}
            isLiked={likedVideos[item.id]}
            likes={likes[item.id]}
            handleLikePress={handleLikePress}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.y / windowHeight);
          setCurrentViewableItemIndex(index);
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={windowHeight}
      />
    </View>
  );
}

const Item = ({ item, shouldPlay, videoHeight, handleProfilePress, promoteurImage, isLiked, likes, handleLikePress }) => {
  const video = useRef(null);
  const [status, setStatus] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function managePlayback() {
      if (shouldPlay && isFocused) {
        await video.current.playAsync();
        setIsPaused(false);
      } else {
        await video.current.pauseAsync();
        setIsPaused(true);
      }
    }
    managePlayback();
  }, [shouldPlay, isFocused]);

  return (
    <View style={[styles.videoContainer, { height: videoHeight }]}>
      <Pressable onPress={() => {
        if (status.isPlaying) {
          video.current.pauseAsync();
          setIsPaused(true);
        } else {
          video.current.playAsync();
          setIsPaused(false);
        }
      }}>
        <Video
          ref={video}
          source={item.video}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          volume={0.5}
          onPlaybackStatusUpdate={setStatus}
        />
        {isPaused && (
          <View style={styles.pauseIconContainer}>
            <Ionicons name="pause-circle" size={60} color="white" />
          </View>
        )}
      </Pressable>
      <View style={styles.actionIconsContainer}>
        <Pressable onPress={() => handleProfilePress(item.id)}>
          {promoteurImage ? (
            <Image source={{ uri: promoteurImage }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={40} color="white" />
          )}
        </Pressable>
        <View style={styles.iconButton}>
          <Pressable onPress={() => handleLikePress(item.id)}>
            <Ionicons name="heart" size={30} color={isLiked ? "red" : "white"} />
          </Pressable>
          <Text style={styles.iconText}>{likes}</Text>
        </View>
        <View style={styles.iconButton}>
          <Ionicons name="chatbubble-ellipses" size={30} color="white" />
          <Text style={styles.iconText}>{item.comments}</Text>
        </View>
        <View style={styles.iconButton}>
          <Ionicons name="arrow-redo" size={30} color="white" />
          <Text style={styles.iconText}>{item.shares}</Text>
        </View>
      </View>
      <View style={styles.bottomTextContainer}>
        <Text style={styles.restaurantName} onPress={() => handleProfilePress(item.id)}>@{item.restaurant}</Text>
        <Text style={styles.bottomText}>{item.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  pauseIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  actionIconsContainer: {
    position: 'absolute',
    right: 10,
    bottom: '20%',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
    width: 60,
  },
  iconText: {
    color: 'white',
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  bottomTextContainer: {
    position: 'absolute',
    left: 10,
    bottom: 120,
    paddingRight: '20%',
  },
  bottomText: {
    color: 'white',
    marginTop: 4,
  },
  restaurantName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1,
  },
});
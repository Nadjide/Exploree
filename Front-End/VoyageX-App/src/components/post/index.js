import React, { forwardRef, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { Video } from 'expo-av';
import Entypo from "react-native-vector-icons/Entypo";
import Antdesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";

export const PostSingle = forwardRef((props, parentRef) => {
  const ref = useRef(null);
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: Dimensions.get('window').height - 140
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    uiContainer: {
      height: '100%',
      justifyContent: 'flex-end'
    },
    bottomContainer: {
      padding: 10,
    },
    handle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10
    },
    description: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '300',
      marginBottom: 10,
    },
    songRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    songName: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 5,
    },
    rightContainer: {
      alignSelf: 'flex-end',
      height: 300,
      justifyContent: 'space-between',
      marginRight: 10, 
    },
    profilePicture: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#fff'
    },
    iconWithLabel: {
      alignItems: 'center', 
      marginBottom: 20, 
    },
    iconContainer: {
      alignItems: 'center' 
    },
    statsLabel: {
      color: '#fff',
      marginTop: 5, 
    }
  });

  const [paused, setPaused] = useState(false);

  const onPlayPausePress = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPlayPausePress}>
        <Video
          ref={ref}
          style={styles.video}
          source={require("../../../video/video_test.mp4")}
          resizeMode="cover"
          repeat={true}
          shouldPlay={!paused}
        />
      </TouchableWithoutFeedback>
      <View style={styles.uiContainer}>
        <View style={styles.rightContainer}>
          <Image
            style={styles.profilePicture}
            source={{ uri: "https://media.vogue.fr/photos/621f567e42cb113ca47921d9/2:3/w_1280,c_limit/MCDBATM_WB060.jpg" }}
          />
          <View style={styles.iconWithLabel}>
            <Antdesign name={'hearto'} size={40} color="white" />
            <Text style={styles.statsLabel}>123</Text>
          </View>
          <View style={styles.iconWithLabel}>
            <FontAwesome name={'commenting'} size={40} color="white" />
            <Text style={styles.statsLabel}>123</Text>
          </View>
          <View style={styles.iconWithLabel}>
            <Fontisto name={'share-a'} size={40} color="white" />
            <Text style={styles.statsLabel}>123</Text>
          </View>
          <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>side</Text>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.handle}>@nawfel06</Text>
          <Text style={styles.description}>Voici ma video tikto by @nawfel06</Text>
          <View style={styles.songRow}>
            <Entypo name={'beamed-note'} size={24} color="white" />
            <Text style={styles.songName}>The search</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PostSingle;

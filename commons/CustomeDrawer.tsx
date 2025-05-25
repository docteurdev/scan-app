import { StyleSheet, Text, View, Button, Alert, Dimensions, Image, ScrollView, Pressable, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios"
import { SCREEN_H } from './size';

const { height, width } = Dimensions.get("window");



const CustomeDrawer = ({ navigation }) => {



  //  console.log(userInfos);

  

  const cleanAsync = async () => {
    try {
      await AsyncStorage.clear()
    } catch (e) {

    }
  }


  
  

  useEffect(() => {
    //  getData();
    return () => {
     
    }
  }, [])
  
  

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return + match[1] + " " + match[2] + " " + match[3]
    }
    return null
  }



  // cleanAsync()

  const UserInfosItem = ({ title, icon }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 0,
        marginHorizontal:4,
        backgroundColor: "white",
        padding: 7,
        borderRadius: 4,
        borderWidth:0.5,
        borderColor: "gray"
      }}
    >
      <View

        style={{
          width: 30,
          height: 30,
          backgroundColor: "orange",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50
        }}
      >

        {icon}
      </View>
      <Text

        numberOfLines={1}
        style={{
          marginLeft: 10,
          fontFamily: "fontMedium",
          fontSize: 14,
          color: "gray",
          width: "80%"
        }}
      > {title}</Text>
    </View>
  )


  return (
    <Pressable
    
     onPress={() => navigation.navigate('sync')}
     style={{height: 50}}
    >

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 6,
          
        }}
      >

        <Image source={require("../assets/lunchicons/log1.png")} style={{width: 100, height: 100, alignSelf: "center", marginVertical: SCREEN_H * 0.1}}/>

        <UserInfosItem 
        title="Synchonisation"
        icon={<Feather name="activity" color="white" size={18} />}
        />
      </View>
    </Pressable>
  )
}

export default CustomeDrawer

const styles = StyleSheet.create({})
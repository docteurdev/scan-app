import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// export const baseURL = 'http://192.168.1.34:8990/';
export const baseURL = 'http://192.168.43.226:8990/';
export const appAxios = axios.create({
  baseURL,
  headers: {
     // Accept:'application/json',
      'Content-Type':'application/json'

  }
})

export  const storeData = async (key,value, callback) => {
    try {
      const jsonValue = JSON.stringify(value);
    let resp =  await AsyncStorage.setItem(key, jsonValue);
    callback()
    } catch (e) {
      // saving error
    }
  };

  export const getData = async (key) => {
    var infos = {}
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
         let valueWaited = JSON.parse(value);
         console.log(valueWaited);
        // infos = valueWaited
      }
    } catch (e) {
      console.log(e);
    }

    // return infos
  }
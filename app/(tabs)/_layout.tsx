import { Slot, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { setphoneInfo } from '@/redux/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

export default function TabLayout() {
  const colorScheme = useColorScheme();

    const dispatch = useDispatch();
    const router = useRouter();
        const getData = async () => {
          try {
              const value = await AsyncStorage.getItem('t_info')
              if (value !== null) {
                  let valueWaited = JSON.parse(value);
                  dispatch(setphoneInfo(valueWaited));
                  console.log("user_infos=================", valueWaited);
                  
              }else{
                router.push("/(tabs)/register");
              }
          } catch (e) {
              console.log(e);
          }
      }
  useEffect(() => {
    getData();
    return () => {
      // Cleanup if needed
    }
  }, []);

  return (
    <Slot />
  );
}

import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import * as SecureStorage from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uid, setUID] = useState(null);
  const [isAuth, setIsAuth] = useState(true);
  const [token, setToken] = useState('');

  const isWeb = Platform.OS === 'web';

  const setItem = async (key, value) => {
    if (isWeb) {
      try {
        await AsyncStorage.setItem(key, value);
      }
      catch(err) {
        console.error('async storage failed\n', err);
      }
    }
    else {
      try {
        await SecureStorage.setItemAsync(key, value);
      }
      catch(err) {
        console.error('secure storage failed\n', err);
      }
    }
  }

  const getItem = async (key) => {
    if (isWeb) {
      try {
        const value = await AsyncStorage.getItem(key);
        return value;
      }
      catch(err) {
        console.error('async storage failed\n', err);
      }
    }
    else {
      try {
        const value = await SecureStorage.getItemAsync(key);
        return value;
      }
      catch(err) {
        console.error('secure storage failed\n', err);
      }
    }
  }

  useEffect(() => {
    getItem('isAuth')
      .then((value) => {
        setIsAuth(value === 'true');
      })
      .catch((err) => console.error('Error al cargar el estado de autenticación:', err));
      
    getItem('token')
      .then((value) => {
        console.log('got value', value);
        setToken(value);
      })
      .catch((err) => console.error('Error al cargar el token:', err));    
      
    getItem('uid')
      .then((value) => {
        setUID(value);
      })
      .catch((err) => console.error('Error al cargar el uid:', err));
  }, []);

  useEffect(() => {
    if (isAuth) {
      setItem('isAuth', isAuth.toString());
    } else {
      setItem('isAuth', isAuth);
    }
  }, [isAuth]);

  useEffect(() => {
    if (token) {
      setItem('token', token.toString());
    } else {
      setItem('token', token);
    }
  }, [token]);

  useEffect(() => {
    if (uid) {
      setItem('uid', uid.toString());
    } else {
      setItem('uid', uid);
    }
  }, [uid]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, uid, setUID, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

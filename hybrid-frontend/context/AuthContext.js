import React, { createContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import * as SecureStorage from 'expo-secure-store';
import * as ActionCable from '@rails/actioncable';
import backendIp from '../ip';

global.addEventListener = () => {};
global.removeEventListener = () => {};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uid, setUID] = useState(null);
  const [isAuth, setIsAuth] = useState(true);
  const [token, setToken] = useState('');
  const [feedData, setFeedData] = useState([]);
  const cableRef = useRef(null);
  const subscriptionRef = useRef(null);

  const isWeb = Platform.OS === 'web';

  const setItem = async (key, value) => {
    if (value == null) {
      console.log(`Value { ${key}: ${value} } is null or undefined, cannot store in SecureStore.`);
      return;
    }

    value = typeof value === 'string' ? value : JSON.stringify(value);
    
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
      
    getItem('uid')
      .then((value) => {
        setUID(value);
      })
      .catch((err) => console.error('Error al cargar el uid:', err));
      
    getItem('token')
      .then((value) => {
        console.log('got value', value);
        setToken(value);
      })
      .catch((err) => console.error('Error al cargar el token:', err));
  }, []);

  useEffect(() => {
    if (isAuth) {
      setItem('isAuth', isAuth.toString());
    } else {
      setItem('isAuth', isAuth);
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      if (cableRef.current) cableRef.current.disconnect();
      subscriptionRef.current = null;
      cableRef.current = null;
    }
  }, [isAuth]);

  useEffect(() => {
    if (token) {
      setItem('token', token.toString());
      if ((subscriptionRef.current === null) || (cableRef.current === null)) {
        const encoded = encodeURI(`ws://${backendIp}:3001/cable?token=${JSON.parse(token)}`);
        cableRef.current = ActionCable.createConsumer(encoded);
        subscriptionRef.current = cableRef.current.subscriptions.create(
          { channel: "FeedChannel" },
          {
            received(data) {
              console.log(`
                New message: ${data.message}
                type: ${data.type}
                json: ${JSON.stringify(data.resource)}
                datatype: ${typeof data.resource[0]}
                first element: ${JSON.stringify(data.resource[0])}
              `);
              // console.log('feed data below:');
              // console.log(feedData);
              // if (data.type === 'mess') setFeedData([...feedData, ...data.resource]);
              // else setFeedData([...feedData, data.resource]);
              setFeedData(prevFeedData => [data.resource, ...prevFeedData]);
            },
          }
        );
        return () => {
          if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
          if (cableRef.current) cableRef.current.disconnect();
          subscriptionRef.current = null;
          cableRef.current = null;
        }
      }
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
    <AuthContext.Provider value={{ isAuth, setIsAuth, uid, setUID, token, setToken, feedData }}>
      {children}
    </AuthContext.Provider>
  );
};

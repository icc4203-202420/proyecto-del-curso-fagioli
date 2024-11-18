import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { Stack, useSegments } from 'expo-router';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext, useEffect } from "react";
import styles from '../styles';
import * as Notifications from 'expo-notifications';

const Noti = () => {
  useEffect(() => {
    const receivedListener = Notifications.addNotificationReceivedListener(async (notification) => {
      const { title, body , data } = notification.request.content;
      // const { imageUrl, username }  = data;

      // if (username === userData.username) {
      //   setItem("imageUrl", imageUrl);
      //   setImageUrl(imageUrl);
      // }
      
    });
  
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      switch (data.situation) {
        case 'create a friendship':
          console.log('we created a friendship and opened the notification');
          router.push('/')
          break;
        case 'attendance to event':
          console.log('user opened the notification attendance to event');
          console.log(`bar id: ${data.bar_id}, bar name: ${data.bar_name}`);
          // router.push(`/bars/${data.bar_id}/events`);
          setTimeout(() => {
            router.push(`/bars/${data.bar_id}/events`);
          }, 1000);
          break;
        case 'create a tag':
          console.log('tagged to event user opened the notification');
          console.log(`bar id: ${data.bar_id}, event id: ${data.event_id}`);
          setTimeout(() => {
            router.push(`/bars/${data.bar_id}/events/${data.event_id}`);
          }, 1000);
          break;
        default:
          console.log('no situation matched');
      }
      // if (data?.imageUrl) {
      //   Linking.openURL(data.imageUrl);
      // }
    });

    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  return (<View></View>);
}

function AppLay() {
  const { isAuth, setIsAuth, setToken } = useContext(AuthContext);
  const segment = useSegments();

  useEffect(() => {
    let notAuth = !isAuth;
    let notInLoginOrSignup = !(segment[0] === 'login' || segment[0] === 'signup');

    if (notAuth && notInLoginOrSignup) {
      router.push('/login');
    }
  }, [segment, isAuth]);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton} disabled={!isAuth}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{ ...styles.defaultText, fontSize: 20 }}>Bars App</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.iconButton}>
            <Ionicons name="home" size={20} color="white" />
          </TouchableOpacity>
          { isAuth ? (
            <TouchableOpacity onPress={() => { setIsAuth(false); setToken(''); }} style={styles.iconButton}>
              <Ionicons name="log-out" size={20} color="white" />
            </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => { router.push('/login'); }} style={styles.iconButton}>
                <Ionicons name="log-in" size={20} color="white" />
              </TouchableOpacity>
            )
          }
        </View>
      </SafeAreaView>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="users/index" />
      </Stack>
      <Noti />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  
  return (
    <AuthProvider>
      <AppLay/>
    </AuthProvider>
  );
}
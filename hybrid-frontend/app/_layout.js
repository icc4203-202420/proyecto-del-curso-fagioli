import { View, Text, Pressable, SafeAreaView } from "react-native";
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { Stack, useSegments } from 'expo-router';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext, useEffect } from "react";
import styles from '../styles';

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
    <>
      <SafeAreaView style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} disabled={!isAuth}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </Pressable>
        <Text style={{ ...styles.defaultText, fontSize: 20 }}>Bars App</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/')} style={styles.iconButton}>
            <Ionicons name="home" size={20} color="white" />
          </Pressable>
          { isAuth ? (
            <Pressable onPress={() => { setIsAuth(false); setToken(''); }} style={styles.iconButton}>
              <Ionicons name="log-out" size={20} color="white" />
            </Pressable>
            ) : (
              <Pressable onPress={() => { router.push('/login'); }} style={styles.iconButton}>
                <Ionicons name="log-in" size={20} color="white" />
              </Pressable>
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
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLay/>
    </AuthProvider>
  );
}
import { View, Text, Pressable, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { AuthProvider } from '../context/AuthContext';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from "react";

export default function RootLayout() {

  // useEffect(() => {
    // console.log('fetching');
    // fetch('https://ifconfig.me/all.json')
    //   .then((resp) => resp.json())
    //   .then((r) => console.log(r))
    //   .catch((err) => console.error(err));

    
    // console.log('now my api');
    // fetch('http://localhost:3001/api/v1')
    //   .then((resp) => resp.json())
    //   .then((r) => console.log(r))
    //   .catch((err) => console.error(err));

  // }, []);

  return (
    <AuthProvider>
      {/* Custom AppBar */}
      <SafeAreaView style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color="white" />
        </Pressable>
        <Text style={styles.title}>Bars App</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/')} style={styles.iconButton}>
            <Ionicons name="home" size={20} color="white" />
          </Pressable>
          <Pressable onPress={() => { console.log('Logout'); }} style={styles.iconButton}>
            <Ionicons name="log-out" size={20} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Stack Navigation */}
      <Stack
        screenOptions={{
          headerShown: false, // Ocultamos el header nativo del Stack
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="testroute" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  appBar: {
    // flex: 1,
    // height: 75,
    marginTop: StatusBar.currentHeight + 3,
    backgroundColor: '#462005',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)',
    shadowColor: "black",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 16, // Android
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    // fontWeight: 500,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 18,
    color: '#fff',
  },
});

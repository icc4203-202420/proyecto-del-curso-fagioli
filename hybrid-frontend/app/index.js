import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../styles';
import MyButton from '../MyButton';
import { router } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function App() {
  
  const { token } = useContext(AuthContext);
  
  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 48, textAlign: 'center'}} >Acciones</Text>
      <MyButton 
        label='BUSCAR BARES'
        variant='contained'
        OnClick={() => router.push('/bars')}
      />
      <MyButton 
        label='BUSCAR CERVEZAS'
        variant='contained'
        OnClick={() => router.push('/beers')}
      />
      <MyButton 
        label='BUSCAR USUARIOS'
        variant='contained'
        OnClick={() => router.push('/users')}
      />
      <MyButton 
        label='IR AL FEED'
        variant='contained'
        OnClick={() => router.push('/feed')}
      />
      <StatusBar style="auto" />
    </View>
  );
}



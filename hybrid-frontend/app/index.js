import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../styles';
import MyButton from '../MyButton';
import { router } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.1.87:3001/api/v1'; // reemplazar 192.168.1.87 por la ip del backend, en mi caso es la ip privada de mi pc donde estoy corriendo el /project/backend

export default function App() {
  
  const { token } = useContext(AuthContext);

  useEffect(() => {
    console.log('rendered app');
    console.log('sync token:', token);
    // getItem('token').then((val) => console.log('token:', val));
  });

  const testQuery = () => {
    axios.get('/bars')
    .then((data) => {
      console.log(data.data.bars);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 48, textAlign: 'center'}} >Acciones</Text>
      <MyButton 
        label='BUSCAR BARES'
        variant='contained'
        OnClick={() => console.log('works')}
      />
      <MyButton 
        label='MAPA-BÚSQUEDA DE BARES'
        variant='contained'
        OnClick={() => console.log('works')}
      />
      <MyButton 
        label='BUSCAR CERVEZAS'
        variant='contained'
        OnClick={() => router.push('/beers')}
      />
      <MyButton 
        label='BUSCAR USUARIOS'
        variant='contained'
        OnClick={() => console.log('works')}
      />
      <StatusBar style="auto" />
    </View>
  );
}



import { useLocalSearchParams } from "expo-router";
import MyButton from '../../../MyButton';
import styles from '../../../styles';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { FlatList, Text, View } from "react-native";


const Events = () => {
  const { id, bar_name } = useLocalSearchParams();
  const { token, setIsAuth } = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);

  const getResources = () => {
    setisLoading(true);
    axios.get(`/bars/${id}/events`,
      {
        headers: { Authorization: JSON.parse(token) }
      }
    )
      .then((resp) => {
        setisLoading(false);
        console.log(Object.values(resp.data)[0]);
        setData(Object.values(resp.data)[0]);
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 401) {
          setIsAuth(false);
        }
      });
  }

  useEffect(() => {
    getResources();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ 
      backgroundColor: '#320808',
      borderRadius: 20,
      elevation: 15,
      shadowColor: '#000',
      borderBottomWidth: 1,
      flex: 1,
      flexDirection: 'column',
      paddingVertical: 35,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      gap: 25
    }}>
      <View style={{ width: 'fit-content', gap: 5 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ ...styles.defaultText, fontSize: 30 }}>{item.name}</Text>
          <Text style={{ ...styles.defaultText, fontSize: 13 }}>
            {new Date(item.date).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' })}
          </Text>
          <Text style={{ ...styles.defaultText, fontSize: 20, marginBottom: 10 }}>{item.description}</Text>
          <Text style={{ ...styles.defaultText, fontSize: 22 }}>Asistentes</Text>
        </View>
        <FlatList
          style={{ width: '100%' }}
          data={item.attendances}
          keyExtractor={(attendee) => attendee.id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          ListEmptyComponent={<Text style={styles.defaultText}>No se encontraron asistentes para este evento.</Text>}
          renderItem={({ item: attendee }) => 
            <Text style={{ ...styles.defaultText, fontSize: 13 }}>@{attendee.user_handle} ({attendee.user_first_name})</Text>
          }
        />
      </View>
      <View style={{ width: 'fit-content', gap: 10 }}>
        <MyButton 
          variant='contained' 
          label='CONFIRMAR ASISTENCIA'
          OnClick={() => console.log('xd')} 
        />
        <MyButton 
          variant='outlined' 
          label='VER FOTOS'
          OnClick={() => console.log('xd')} 
        />
      </View>
    </View>
  );

  return (
    <View style={ styles.container }>
      <Text style={{ ...styles.defaultText, fontSize: 30 }}> Eventos del bar {bar_name} </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.defaultText}>No se encontraron eventos para este bar.</Text>}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        style={{width: '100%'}}
      />
    </View>
  );
}

export default Events;
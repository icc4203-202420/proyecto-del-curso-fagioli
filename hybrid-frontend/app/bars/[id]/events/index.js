import { router, useLocalSearchParams } from "expo-router";
import MyButton from '../../../../MyButton';
import styles from '../../../../styles';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { FlatList, Text, View, ActivityIndicator } from "react-native";

const Events = () => {
  const { id, bar_name } = useLocalSearchParams();
  const { token, setIsAuth, uid } = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState('');

  const getResources = () => {
    setisLoading(true);
    if (token) {
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
  }

  useEffect(() => {
    getResources();
  }, [reload, token, uid]);

  const handleConfirm = (ev_id) => {
    axios.post(`/bars/${id}/events/${ev_id}/attendances`, 
      { attendance: { event_id: ev_id } }, 
      { 
        headers: { Authorization: JSON.parse(token) },
      }
    ).then((resp) => {
      console.log('confirmed attendance');
      setReload('reload');
    }).catch((err) => console.error(err));
  }

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
          disabled={ item.attendances.some((att) => att.user_id.toString() === uid) }
          OnClick={() => handleConfirm(item.id)} 
        />
        <MyButton 
          variant='outlined' 
          label='VER FOTOS'
          OnClick={() => router.push(`/bars/${id}/events/${item.id}`)} 
        />
      </View>
    </View>
  );

  return (
    <View style={ styles.container }>
      <Text style={{ ...styles.defaultText, fontSize: 30 }}> Eventos del bar {bar_name} </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#D97A40" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.defaultText}>No se encontraron eventos para este bar.</Text>}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          style={{width: '100%'}}
        />
      )}
    </View>
  );
}

export default Events;
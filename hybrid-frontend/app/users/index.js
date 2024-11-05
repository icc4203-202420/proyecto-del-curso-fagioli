import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import MyButton from '../../MyButton';
import styles from '../../styles';
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';
import {Picker} from '@react-native-picker/picker';

const Users = () => {
  const { token, setIsAuth, uid } = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');
  const [userEvents, setUserEvents] = useState([{id: 1, name: 'ev1'}, {id: 2, name: 'ev2'}]);
  const [selectedEvents, setSelectedEvents] = useState({});

  const handleSelectEvent = (userId, event) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [userId]: event,
    }));
  };

  const getResources = () => {
    setisLoading(true);
    if (token) {
      axios.get(`/users`,
        {
          headers: { Authorization: JSON.parse(token) }
        }
      )
        .then((resp) => {
          axios.get('/events',
            {
              headers: { Authorization: JSON.parse(token) }
            })
            .then((resp_events) => {
              setUserEvents(resp_events.data.events);
              setisLoading(false);
            })
            .catch((error) => {
              console.error(error);
              if (error.status === 401) {
                setIsAuth(false);
              }
            });
          
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
  }, [token]);

  const handleInput = (event) => {
    console.log(event);
    setTerm(event);
  }

  const handleSearch = () => {
    const filtered = data.filter((elem) => (
      elem.handle.toLowerCase().includes(term.toLowerCase())
    ));
    setData(filtered);
  }

  const handleCreateFriendship = (future_friend_id) => {
    const selectedUserForEvent = selectedEvents[future_friend_id];
    axios.post(`/users/${uid}/friendships`,
      { 
        friendship: { 
          friend_id: future_friend_id, 
          event_id: selectedUserForEvent ? selectedUserForEvent.event.id : null, 
          bar_id: selectedUserForEvent ? selectedUserForEvent.event.bar_id : null
        } 
      },
      {
        headers: { Authorization: JSON.parse(token) }
      }
    )
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        getResources();
      })
      .catch((error) => {
        console.error("Error creando la amistad:", error);
        if (error.status === 401) {
          setIsAuth(false);
        }
      });
  }

  const renderItem = ({ item }) => {
    const selectedEvent = selectedEvents[item.id];
    
    return (
      item.id.toString() === uid ? (<View />) : (
        <>
        <View style={{ 
          backgroundColor: '#320808',
          borderRadius: 20,
          elevation: 15,
          shadowColor: '#000',
          borderBottomWidth: 1,
          flex: 1,
          flexDirection: 'row',
          paddingVertical: 20,
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}>
          <View style={{ width: '30%' }}>
            <Text style={{ ...styles.defaultText, fontSize: 16 }}>{item.handle}</Text>
            <Text style={{ ...styles.defaultText, fontSize: 11, color: '#D97A40' }}>{ item.is_friend ? ('Amigo') : ('') }</Text>
          </View>
          <View style={{ width: '40%', gap: 10 }}>
            <View style={{ borderWidth: 1, borderColor: '#200505', borderRadius: 10 }}>
              <Picker
                selectedValue={selectedEvent}
                onValueChange={(value) => handleSelectEvent(item.id, value)}
                style={{ color: '#D97A40', backgroundColor: 'transparent' }}
                disabled={ item.is_friend }
              >
                <Picker.Item label="Evento" value={null} />
                {userEvents.map((option) => (
                  <Picker.Item key={option.id} label={option.name} value={option.name} />
                ))}
              </Picker>
            </View>
            <MyButton 
              variant='outlined' 
              label='AGREGAR AMIGO'
              disabled={ item.is_friend }
              OnClick={() => handleCreateFriendship(item.id)} 
            />
          </View>
        </View>
        <View style={{height: 20}} />
        </>
      )
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 30}}>
        Buscar Usuario
      </Text>
      <TextInput 
        placeholder="Handle"
        placeholderTextColor='#D97A40'
        style={styles.input}
        onChangeText={handleInput} 
      />
      <MyButton variant="contained" label='BUSCAR' OnClick={handleSearch} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#D97A40" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No se encontraron resultados.</Text>}
          style={{width: '100%'}}
        />
      )}
    </View>
  );
}

export default Users;
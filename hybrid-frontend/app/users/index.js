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

  useEffect(() => {
    getResources();
  }, []);

  const handleInput = (event) => {
    console.log(event);
    setTerm(event);
  }

  const handleSearch = () => {
    const filtered = data.filter((elem) => (
      elem.name.toLowerCase().includes(term.toLowerCase())
    ));
    setData(filtered);
  }

  const handleCreateFriendship = (future_friend_id) => {
    // const selectedUserForEvent = selectedEvents.find(item => item.user_id === future_friend_id);
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
  )};

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
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          style={{width: '100%'}}
        />
      )}
    </View>
  );
}

export default Users;

// return (
//   <Stack 
//     spacing={2}
//     sx={{
//       padding: '20px',
//       justifyContent: "center",
//       alignItems: "flex-center",
//       margin: 'auto',
//     }} 
//   >
//     <Typography variant="h4" gutterBottom>
//       Buscar {`${resource.toLowerCase()}`}
//     </Typography>
//     <TextField label={`${resource}`} variant="filled" onChange={handleInput} autoFocus margin="normal" />
//     <Button variant="contained" color="primary" onClick={handleSearch} >
//       Buscar
//     </Button>

//     {isLoading ? (
//       <LinearProgress />
//     ) : (
//       data.length > 0 ? (
//         data.map((elem, id) => {
//           let the_elem = '';
//           if (resource === 'Usuario') {
//             the_elem = elem.handle.toLowerCase();
//           } else {
//             the_elem = elem.name.toLowerCase();
//           }
//           if (the_elem.includes(term.toLowerCase())) {
//             return (
//               <Stack
//                 key={elem.id || id}
//                 direction="row"
//                 spacing={2}
//                 sx={{
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   width: '100%',
//                 }}
//               >


// {
//   resource === 'Usuario' && elem.id != current_user_id && (
//     <Stack
//       key={elem.id}
//       direction='row'
//       // spacing={2}
//       sx={{ 
//         backgroundColor: "#320808",
//         padding: 2,
//         borderRadius: 5,
//         boxShadow: '1px 1px #1E0808',
//         filter: 'drop-shadow(1px 1px 0.3rem #150505)',
//         opacity: 1,
//         width: '100%',
//         justifyContent: 'space-evenly'
//       }}
//     >
//       <Stack sx={{ width: '40%', margin: 'auto 0' }}>
//         <Typography variant='body1' style={{ wordWrap: "break-word", width: '100%' }}>{elem.handle}</Typography>
//         <Typography variant='caption' sx={{ color: '#D97A40' }} >{ elem.is_friend ? ('Amigo') : ('') }</Typography>
//       </Stack>
//       <Stack spacing={1} sx={{ width: '40%' }}>
//         <Autocomplete 
//           disabled={elem.is_friend}
//           options={userEvents} 
//           getOptionLabel={(option) => option.name}
//           renderOption={(props, option) => (
//             <li {...props} key={option.id}
//               style={{ backgroundColor: '#320808', color: '#ddd' }}
//             >
//               {option.name}
//             </li>
//           )}
//           onChange={(event, newValue) => {
//             setSelectedEvent((prevSelectedEvents) => {
//               const existingEventIndex = prevSelectedEvents.findIndex(item => item.user_id === elem.id);
              
//               if (existingEventIndex !== -1) {
//                 const updatedEvents = [...prevSelectedEvents];
//                 updatedEvents[existingEventIndex].event = newValue;
//                 return updatedEvents;
//               } else {
//                 return [...prevSelectedEvents, { user_id: elem.id, event: newValue }];
//               }
//             });
//           }}
//           renderInput={(params) => <TextField {...params} label="Evento" />}
//         />
//         <Button 
//           onClick={() => handleCreateFriendship(elem.id)}
//           variant="outlined" 
//           disabled={elem.is_friend}
//           sx={{ marginLeft: '10px' }}
//         >
//           Agregar amigo
//         </Button>
//       </Stack>
//     </Stack>
//   )
// }})
// )
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useState, useRef, useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, FlatList, Image, TextInput } from 'react-native';
import MyButton from '../../../../MyButton';
import styles from '../../../../styles';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function Event() {
  const [inited, setInited] = useState(false);
  const [picted, setPicted] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [description, setDescription] = useState('');
  const [handles, setHandles] = useState('');
  const [facing, setFacing] = useState('back');
  const { token, setIsAuth, uid } = useContext(AuthContext);
  const [pictures, setPictures] = useState([]);
  const [users, setUsers] = useState([]);
  const [permission, requestPermission] = useCameraPermissions();
  const { id, eventId } = useLocalSearchParams();
  const cameraRef = useRef(null);

  console.log(`id: ${id}, eventid: ${eventId}`);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const getResources = async () => {
    // setisLoading(true);    
    try {
      const data = await axios.get(`/bars/${id}/events/${eventId}/event_pictures`,
        {
          headers: { Authorization: JSON.parse(token) }
        });
      const resp_users = await axios.get('/users',
        {
          headers: { Authorization: JSON.parse(token) }
        });
      console.log("Respuesta del servidor obteniendo event pictures", data.data.event_pictures);
      setPictures(data.data.event_pictures);
      setUsers(resp_users.data.users);
    } catch(error) {
      console.error(error);
      if (error.status === 401) setIsAuth(false);
    }
  }

  useEffect(() => {
    getResources();
  }, []);

  useEffect(() => console.log(description), [description]);

  const handleImageUpload = async () => {
    setInited(false);
    setPicted(false);
    try {
      let the_tags = [];
      for (const user of users) {
        if (handles.split(', ').includes(user.handle)) the_tags.push({ user_id: user.id })
      }
      const resp_ep = await axios.post(`/bars/${id}/events/${eventId}/event_pictures`,
        { event_picture: { 
            event_id: eventId, 
            user_id: uid, 
            image_base64: selectedImage, 
            description: description,
            tags_attributes: the_tags
          } 
        },
        {
          headers: { Authorization: JSON.parse(token) }
        }
      )
      console.log("Respuesta del server sobre crear la event picture", resp_ep.data);
      setHandles('')
      setDescription('')
      getResources();
    } catch(error) {
      console.error(error);
      if (error.status === 401) setIsAuth(false);
    }
  };

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setSelectedImage(`data:image/jpeg;base64,${photo.base64}`);
      setPicted(true);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.renderClassic}>
      <Text style={{...styles.defaultText, fontSize: 25}}><EvilIcons name="user" size={50} color="#fff" /> {item.handle}</Text>
      <Image
        style={styles.image}
        source={{
          uri: item.image_url,
        }}
      />
      <Text style={{...styles.defaultText, fontSize: 16}}>{item.description}</Text>
      <Text style={styles.defaultText}>Etiquetados:{item.tags.map((tag, index) => index>0 ? `, ${tag.handle}` : ` ${tag.handle}`)}</Text>
    </View>
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MyButton 
        label={inited ? 'VOLVER A VISTA' : 'INICIAR CAMARA'}
        variant='contained'
        OnClick={() => setInited(!inited)}
      />
      {inited ? (
          picted ? (
            <View style={{ ...styles.container, width: '100%' }}>
              <Text style={{ ...styles.defaultText, fontSize: 40 }}>Información de publicación</Text>
              <TextInput
                placeholder="Descripcion"
                placeholderTextColor="#D97A40"
                style={{ ...styles.input, width: '100%' }}
                onChangeText={setDescription}
              />
              <TextInput
                placeholder="Handles"
                placeholderTextColor="#D97A40"
                style={{ ...styles.input, width: '100%' }}
                onChangeText={setHandles}
              />
              <MyButton 
                label={'RE-TOMAR FOTO'}
                variant='outlined'
                OnClick={() => setPicted(!picted)}
              />
              <MyButton 
                label={'SUBIR FOTO'}
                variant='contained'
                OnClick={handleImageUpload}
              />
            </View>
          ) : (
            <View style={styless.container}>
              <CameraView style={styless.camera} facing={facing} ref={cameraRef}>
                <View style={styless.buttonContainer}>
                  <TouchableOpacity style={styless.button} onPress={toggleCameraFacing}>
                    <MaterialCommunityIcons name="camera-flip" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styless.button} onPress={takePicture}>
                    <MaterialCommunityIcons name="camera-iris" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          )
      ) : (
        <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
          <FlatList
            data={pictures.toReversed()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.defaultText}>No se encontraron imagenes de este evento.</Text>}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            style={{width: '100%'}}
            // contentContainerStyle={{flex: 1, alignItems: 'center', borderWidth: 2}}
          />
        </View>
      )}
    </View>
  );
}

const styless = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '10vh'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    height: '50%'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    gap: 10,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2
  },
});

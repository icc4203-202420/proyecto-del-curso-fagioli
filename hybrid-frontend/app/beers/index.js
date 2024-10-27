import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import MyButton from '../../MyButton';
import styles from '../../styles';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';

const Beers = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
   
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');

  const getResources = () => {
    setisLoading(true);
    axios.get(`/beers`,
      {
        headers: { Authorization: JSON.parse(isAuth) }
      }
    )
      .then((resp) => {
        setisLoading(false);
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

  const renderItem = ({ item }) => (
    <MyButton variant='outlined' label={item.name} OnClick={() => router.push(`/beers/${item.id}`)} />
  );
  
  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 30}}>
        Buscar Cerveza
      </Text>
      <TextInput 
        placeholder="Cerveza"
        style={styles.input}
        onChangeText={handleInput} 
        placeholderTextColor="#D97A40"
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
};

export default Beers
import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import MyButton from '../../MyButton';
import styles from '../../styles';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';

const Bars = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
   
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');

  const getResources = () => {
    setisLoading(true);
    axios.get(`/bars`,
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
      <View style={{ width: '30%', gap: 5 }}>
        <Text style={{ ...styles.defaultText, fontSize: 20 }}>{item.name} </Text>
        <Text style={{ ...styles.defaultText, fontSize: 14 }}>{`${item.address.city}, ${item.country.name}`} </Text>
        <Text style={{ ...styles.defaultText, fontSize: 14 }}>{item.address.line1} </Text>
        <Text style={{ ...styles.defaultText, fontSize: 11 }}>{item.address.line2} </Text>
      </View>
      <View style={{ width: 'fit-content', gap: 10 }}>
        <MyButton 
          variant='outlined' 
          label='VER EVENTOS'
          OnClick={() => router.push({ pathname: `/bars/${item.id}/events`, params: { bar_name: item.name } })} 
        />
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 30}}>
        Buscar Bar
      </Text>
      <TextInput 
        placeholder="Bar"
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

export default Bars;
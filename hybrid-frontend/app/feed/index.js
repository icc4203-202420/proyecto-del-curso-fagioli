import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MyButton from '../../MyButton';
import styles from '../../styles';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const Feed = () => {
  const { feedData } = useContext(AuthContext);
  const [filtering, setFiltering] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [friendship, setFriendship] = useState('');
  const [bar, setBar] = useState('');
  const [country, setCountry] = useState('');
  const [beer, setBeer] = useState('');
  const [filteredData, setFilteredData] = useState(feedData)

  // console.log(feedData);

  useEffect(() => {
    filtered ? handleFilter() : setFilteredData(feedData);
  }, [feedData]);

  const handleFilter = () => {
    setFilteredData(
      feedData.filter((elem) => {
        const matchFriendship = friendship ? elem.handle?.includes(friendship) : true;
        const matchBar = bar ? elem.bar_name?.includes(bar) : true;
        const matchCountry = country ? elem.country?.includes(country) : true;
        const matchBeer = beer ? elem.beer_name?.includes(beer) : true;

        return matchFriendship && matchBar && matchCountry && matchBeer;
      })
    );
    setFiltered(true);
  }

  const clearFilter = () => {
    setFiltered(false);
    setFilteredData(feedData);
    setFriendship('');
    setBar('');
    setCountry('');
    setBeer('');
  }

  const renderItem = ({ item }) => (
    <View>
      {
        item.publication_type === "review" ? (
          <TouchableOpacity style={styles.renderClassic} onPress={() => router.push(`/beers/${item.beer_id}`)}>
            <Text style={{...styles.defaultText, fontSize: 25}}><EvilIcons name="user" size={50} color="#fff" /> {item.handle}</Text>
            <Text style={{...styles.defaultText, fontSize: 10}}>{new Date(item.created_at).toLocaleDateString('es-CL', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</Text>
            <View>
              <Text style={{...styles.defaultText, fontSize: 16}}>Rating de la cerveza {item.beer_name}</Text>
              <Text style={{...styles.defaultText, fontSize: 16, color: '#D97A40'}}>{item.rating} Estrellas</Text>
            </View>
            {item.bar_address ? (
              <>
                <Text style={{...styles.defaultText, fontSize: 16}}>Servida en:</Text>
                <View>
                  <Text style={{...styles.defaultText, fontSize: 16}}>{item.bar_name}</Text>
                  <Text style={{ ...styles.defaultText, fontSize: 14 }}>{`${item.bar_address?.city}, ${item.country}`} </Text>
                  <Text style={{ ...styles.defaultText, fontSize: 14 }}>{item.bar_address?.line1} </Text>
                  <Text style={{ ...styles.defaultText, fontSize: 11 }}>{item.bar_address?.line2} </Text>
                </View>
              </>
            ) : <Text style={{...styles.defaultText, fontStyle: 'italic'}}>Esta cerveza no se sirve en ningún bar</Text>}
            <Text style={{...styles.defaultText, fontSize: 16}}>{item.text}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.renderClassic} onPress={() => router.push(`/bars/${item.bar_id}/events/${item.event_id}`)}>
            <Text style={{...styles.defaultText, fontSize: 25}}><EvilIcons name="user" size={50} color="#fff" /> {item.handle}</Text>
            <Text style={{...styles.defaultText, fontSize: 10}}>{new Date(item.created_at).toLocaleDateString('es-CL', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</Text>
            <Text style={{...styles.defaultText, fontSize: 16}}>En {item.event_name} del bar {item.bar_name}, {item.country}</Text>
            <Image
              style={styles.image}
              source={{
                uri: item.image_url,
              }}
            />
            <Text style={{...styles.defaultText, fontSize: 16}}>{item.description}</Text>
            <Text style={styles.defaultText}>Etiquetados:{item.tags.map((tag, index) => index>0 ? `, ${tag.handle}` : ` ${tag.handle}`)}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 30}}>
        Feed
      </Text>
      <MyButton 
        label={ filtering ? 'VOLVER' : 'FILTRAR' }
        variant='outlined'
        OnClick={() => setFiltering(!filtering)}
      />
      { filtering ? (
        <ScrollView>
        <View style={{ ...styles.container, width: '100%' }}>
          <Text style={{ ...styles.defaultText, fontSize: 24 }}>Preferencias de filtrado</Text>
          <TextInput
            placeholder="Amistad"
            placeholderTextColor="#D97A40"
            style={{ ...styles.input, width: '100%' }}
            onChangeText={setFriendship}
          />
          <TextInput
            placeholder="Bar"
            placeholderTextColor="#D97A40"
            style={{ ...styles.input, width: '100%' }}
            onChangeText={setBar}
          />
          <TextInput
            placeholder="Pais"
            placeholderTextColor="#D97A40"
            style={{ ...styles.input, width: '100%' }}
            onChangeText={setCountry}
          />
          <TextInput
            placeholder="Cerveza"
            placeholderTextColor="#D97A40"
            style={{ ...styles.input, width: '100%' }}
            onChangeText={setBeer}
          />
          <View style={{ flex: 1, gap: 5, flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
            <View style={{ width: '40%' }}>
              <MyButton 
                label={'QUITAR FILTRO'}
                variant='outlined'
                OnClick={clearFilter}
              />
            </View>
            <View style={{ width: '40%' }}>
              <MyButton 
                label={'FILTRAR'}
                variant='contained'
                OnClick={handleFilter}
                disabled={ !(friendship || bar || country || beer) }
              />
            </View>
          </View>
        </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.defaultText}>El feed aún se encuentra vacío.</Text>}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          style={{width: '100%'}}
        />
      ) }
      
    </View>
  );
};

export default Feed
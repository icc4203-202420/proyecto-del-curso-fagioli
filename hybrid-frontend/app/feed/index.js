import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import MyButton from '../../MyButton';
import styles from '../../styles';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { router } from 'expo-router';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const Feed = () => {
  const { feedData } = useContext(AuthContext);
  console.log(feedData);

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
      {/* <Text style={{...styles.defaultText, fontSize: 20}}>
        {JSON.stringify(feedData)}
      </Text> */}
      <FlatList
        data={feedData}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.defaultText}>El feed aún se encuentra vacío.</Text>}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        style={{width: '100%'}}
      />
      
    </View>
  );
};

export default Feed
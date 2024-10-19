import React, { useEffect, useState, useReducer, useContext } from 'react';
import { View, Text, ActivityIndicator, TextInput, StyleSheet, FlatList } from 'react-native';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Slider } from '@rneui/themed';  // Importando el Slider de RNEUI
import MyButton from '../../MyButton';
// import styles from '../../styles';
import { AuthContext } from '../../context/AuthContext';

const validationSchema = Yup.object({
  rating: Yup.number()  // Cambiamos de string a number para el rating
    .required('Rating requerido'),
  text: Yup.string()
    .required('El comentario es requerido')
    .test('n_words', 'El comentario debe tener como mínimo 15 palabras',
      (value) => value.split(' ').filter((word) => word !== '').length >= 15
    ),
});

const initialValues = {
  rating: 0,  // El rating comienza en 0
  text: '',
};

const BeerDetails = () => {
  const { id } = useLocalSearchParams();
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [beerData, setBeerData] = useState({});
  const [serverError, setServerError] = useState('');
  const [rev, setRev] = useState('');
  const [page, setPage] = useState(1);

  const storiesHookReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          stor: action.payload
        };
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }
  }

  const [hookStories, dispatchHookStories] = useReducer(
    storiesHookReducer,
    { stor: [], isLoading: false, isError: false }
  );

  useEffect(() => {
    const fetcher = async () => {
      try {
        const beerResp = await axios.get(`/api/v1/beers/${id}`);
        setBeerData(beerResp.data.beer);

        dispatchHookStories({ type: 'STORIES_FETCH_INIT' });
        const reviewResp = await axios.get(`/api/v1/beers/${id}/reviews`);
        dispatchHookStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: reviewResp.data.reviews,
        });
      } catch (err) {
        dispatchHookStories({ type: 'STORIES_FETCH_FAILURE' });
      }
    };

    fetcher();

  }, [serverError]);

  const handleSubmit = (vals, { setSubmitting }) => {
    axios
      .post(`/api/v1/beers/${id}/reviews`, { "review": vals }, {
        headers: { Authorization: JSON.parse(auth) },
      })
      .then((resp) => {
        setServerError('');
        setRev(JSON.stringify(vals));
      })
      .catch((err) => {
        setServerError(err.response.data);
        if (err.status === 401) {
          setIsAuth(false);
        }
      })
      .then(() => setSubmitting(false));
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewText}>{item.rating} Stars, {item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Detalles de la cerveza */}
      {beerData ? (
        <>
          <Text style={{ ...styles.defaultText, fontSize: 30 }}>{beerData.name}</Text>
          {
            Object.keys(beerData).map((item, index) => {
              if (!['id', 'beer_type', 'created_at', 'updated_at', 'brand_id', 'name'].includes(item)) {
                return (
                  <Text style={{ ...styles.defaultText, fontSize: 14 }} key={index}> {`${item}: ${beerData[item]}`}</Text>
                )
              }
            })
          }
        </>
      ) : (
        <Text>No se encontraron detalles para esta cerveza.</Text>
      )}

      {/* Formulario para agregar nueva review */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <View style={styles.formContainer}>
            {/* Slider para el rating */}
            <Text style={styles.defaultText}>Calificación: {values.rating}</Text>
            <Slider
              value={values.rating}
              onValueChange={(value) => setFieldValue('rating', value)}
              minimumValue={0}
              maximumValue={5}
              step={0.1}
              thumbStyle={styles.sliderThumb}
              trackStyle={styles.sliderTrack}
            />
            {touched.rating && errors.rating && (
              <Text style={styles.errorText}>{errors.rating}</Text>
            )}

            {/* Campo de texto para el comentario */}
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu comentario..."
              value={values.text}
              onChangeText={(text) => setFieldValue('text', text)}
              multiline
              numberOfLines={4}
            />
            {touched.text && errors.text && (
              <Text style={styles.errorText}>{errors.text}</Text>
            )}

            {/* Botón para enviar el formulario */}
            <MyButton
              label="Enviar Review"
              variant='contained'
              OnClick={handleSubmit}
              disabled={isSubmitting}
            />
            {serverError && (
              <Text style={styles.errorText}>
                {serverError}
              </Text>
            )}
          </View>
        )}
      </Formik>

      {/* Mostrar la review propia si existe */}
      {rev ? (
        <Text style={styles.reviewText}> Yo: {JSON.parse(rev).rating} Stars, {JSON.parse(rev).text} </Text>
      ) : null}

      {/* Comentarios */}
      <Text style={styles.defaultText}>Evaluaciones de la cerveza:</Text>
      {hookStories.isError && <Text style={styles.errorText}>Oh, oh, something went wrong</Text>}
      {hookStories.isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={hookStories.stor}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default BeerDetails;

// Estilos adicionales
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#3E0808',
  },
  defaultText: {
    fontSize: 18,
    color: 'white'
  },
  formContainer: {
    marginVertical: 20,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  errorText: {
    color: 'red',
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: 'white'
  },
  sliderThumb: {
    height: 20,
    width: 20,
    backgroundColor: '#000',
  },
  sliderTrack: {
    height: 10,
  },
});

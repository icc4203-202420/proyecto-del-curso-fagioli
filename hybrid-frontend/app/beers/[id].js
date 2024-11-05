import React, { useEffect, useState, useReducer, useContext } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Slider } from '@rneui/themed';
import MyButton from '../../MyButton';
import styles from '../../styles';
import { AuthContext } from '../../context/AuthContext';

const validationSchema = Yup.object({
  rating: Yup.number()
    .required('Rating requerido'),
  text: Yup.string()
    .required('El comentario es requerido')
    .test('n_words', 'El comentario debe tener como mínimo 15 palabras',
      (value) => value.split(' ').filter((word) => word !== '').length >= 15
    ),
});

const initialValues = {
  rating: 0,
  text: '',
};

const BeerDetails = () => {
  const { id } = useLocalSearchParams();
  const { setIsAuth, token } = useContext(AuthContext);
  const [beerData, setBeerData] = useState({});
  const [serverError, setServerError] = useState('');
  const [rev, setRev] = useState('');
  const [loadingToken, setLoadingToken] = useState(false);

  const reviewsHookReducer = (state, action) => {
    switch (action.type) {
      case 'REVIEWS_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          stor: action.payload
        };
      case 'REVIEWS_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case 'REVIEWS_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }
  }

  const [hookReviews, dispatchHookReviews] = useReducer(
    reviewsHookReducer,
    { stor: [], isLoading: false, isError: false }
  );

  useEffect(() => {
    const fetcher = async () => {
      try {
        const beerResp = await axios.get(`/beers/${id}`);
        setBeerData(beerResp.data.beer);

        dispatchHookReviews({ type: 'REVIEWS_FETCH_INIT' });
        const reviewResp = await axios.get(`/beers/${id}/reviews`);
        dispatchHookReviews({
          type: 'REVIEWS_FETCH_SUCCESS',
          payload: reviewResp.data.reviews,
        });
      } catch (err) {
        dispatchHookReviews({ type: 'REVIEWS_FETCH_FAILURE' });
      }
    };

    fetcher();

  }, [serverError]);

  const handleSubmit = (vals) => {
    axios
      .post(`/beers/${id}/reviews`, { "review": vals }, {
        headers: { Authorization: JSON.parse(token) },
      })
      .then((resp) => {
        setServerError('');
        setRev(JSON.stringify(vals));
      })
      .catch((err) => {
        console.error(err);
        setServerError((err.response.data.error));
        if (err.status === 401) {
          setIsAuth(false);
        }
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.defaultText}>{item.rating} Stars, {item.text}</Text>
    </View>
  );

  return loadingToken ? (<></>) : (
    <ScrollView style={styles.scrollContainer}>
      {beerData ? (
        <>
          <Text style={{ ...styles.defaultText, fontSize: 30 }}>{beerData.name}</Text>
          {
            Object.keys(beerData).map((item, index) => {
              if (!['id', 'beer_type', 'created_at', 'updated_at', 'brand_id', 'name'].includes(item)) {
                return (
                  <Text style={{ ...styles.defaultText, fontSize: 17 }} key={index}> {`${item}: ${beerData[item]}`}</Text>
                )
              }
            })
          }
        </>
      ) : (
        <Text>No se encontraron detalles para esta cerveza.</Text>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values, setFieldValue, handleSubmit }) => (
          <View style={styles.formContainer}>
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

            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu comentario..."
              placeholderTextColor="#D97A40"
              value={values.text}
              onChangeText={(text) => setFieldValue('text', text)}
              multiline
              rows={4}
            />
            {touched.text && errors.text && (
              <Text style={styles.errorText}>{errors.text}</Text>
            )}

            <MyButton
              label="Enviar Review"
              variant='contained'
              OnClick={handleSubmit}
              disabled={isSubmitting}
            />
            {
              serverError ? (
                <Text style={styles.errorText}>
                  {serverError}
                </Text>
              ) : (<Text></Text>)
            }
          </View>
        )}
      </Formik>

      <Text style={{ ...styles.defaultText, marginVertical: 5, fontSize: 24 }}>Evaluaciones de la cerveza:</Text>

      {rev ? (
        <Text style={{ ...styles.defaultText, marginVertical: 5, fontSize: 20 }}> Yo: {JSON.parse(rev).rating} Stars, {JSON.parse(rev).text} </Text>
      ) : null}

      {hookReviews.isError && <Text style={styles.errorText}>Oh, oh, something went wrong</Text>}
      {hookReviews.isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={hookReviews.stor}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
        />
      )}
      <View style={{marginTop: 100}}></View>
    </ScrollView>
  );
};

export default BeerDetails;
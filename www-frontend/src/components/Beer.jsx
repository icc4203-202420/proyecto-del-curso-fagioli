import { Typography, Stack, Slider, TextField, Button, Pagination } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object({
  rating: Yup.string()
    .required('Rating requerido'),
  text: Yup.string()
    .required('El comentario es requerido')
    .test('n_words', 'El comentario debe tener como mínimo 15 palabras',
      (value) => value.split(' ').filter((word) => word !== '').length >= 15
    ),
});

const initialValues = {
  rating: '',
  text: '',
};

const useStorageState = (key, defaultVal) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || defaultVal
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return (
    [value, setValue]
  );
};

const Beer = ( { auth, setIsAuth } ) => {
  const { id } = useParams();
  const [ beerData, setBeerData ] = useState({});
  const [serverError, setServerError] = useState('');
  const [rev, setRev] = useStorageState('bars-app-rev', '');
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  
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
    {stor: [], isLoading: false, isError: false}
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
        dispatchHookStories({type: 'STORIES_FETCH_FAILURE'});
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

  const handlePageChange = (x, value) => {
    setPage(value);
  };

  const startIndex = (page-1)*itemsPerPage;
  const endIndex = startIndex+itemsPerPage;
  const displayedRevs = hookStories.stor.slice(startIndex, endIndex);

  return (
    <Stack
      spacing={3}
      sx={{
        padding: '20px',
        justifyContent: "center",
        alignItems: "flex-center",
        width: 'fit-content',
        margin: 'auto',
      }} 
    >
      <Typography variant="h4" >{ beerData.name }</Typography>
      {
        Object.keys(beerData).map((item, index) => {
          if (!['id', 'beer_type', 'created_at', 'updated_at', 'brand_id', 'name'].includes(item)) {
            return (
              <Typography key={index} > { `${item}: ${beerData[item]}` } </Typography>
            )
          }
        })
      }
      
      <Typography variant="h4" >Evalúa la cerveza</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form>
            <Stack
              spacing={3}
              sx={{
                padding: '20px',
                justifyContent: "center",
                alignItems: "flex-center",
                margin: 'auto',
              }} 
            >
              <Slider
                value={values.rating || 0}
                onChange={(event, value) => setFieldValue('rating', value)}
                min={0}
                max={5}
                step={0.1}
                marks
              />
              {touched.rating && errors.rating && (
                <Typography color="error">{errors.rating}</Typography>
              )}
              <Field 
                as={TextField}
                label='Comentario'
                variant='filled'
                name='text'
                type='text'
                error={touched.text && Boolean(errors.text)}
                helperText={touched.text && errors.text}
              />
              <Button
                variant='contained'
                type='submit'
                disabled={isSubmitting}
              >
                Enviar
              </Button>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
      
      <Typography variant="h4" >Evaluaciones de la cerveza</Typography>
      <p> { `Yo: ${JSON.parse(rev).rating} Stars, ${JSON.parse(rev).text}` } </p>
      
      {hookStories.isError && <p>Oh, oh, something went wrong</p> }
      {hookStories.isLoading ? (
        <p>Loading, please wait...</p>
      ) : (
        displayedRevs.map((review, index) => (
          <p key={index} > { `${review.rating} Stars, ${review.text}` } </p>
        ))
      )}

      <Pagination
        count={Math.ceil(hookStories.stor.length / itemsPerPage)}
        siblingCount={0}
        page={page}
        onChange={handlePageChange}
      />
      
    </Stack>
  );
};

export default Beer;
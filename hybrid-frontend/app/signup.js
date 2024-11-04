import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, View, ScrollView, Text } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import styles from '../styles';
import MyButton from '../MyButton';
import { registerForPushNotificationsAsync } from '../notifications';

// axios.defaults.baseURL = 'http://172.22.86.91:3001';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('El email es requerido')
    .email('Email no válido')
    .matches(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/, 'Email no válido'),
  first_name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  handle: Yup.string()
    .required('El handle es requerido')
    .min(3, 'El handle debe tener al menos 3 caracteres'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: Yup.string()
    .required('La confirmación de contraseña es requerida')
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
});

const initialValues = {
  email: '',
  first_name: '',
  last_name: '',
  handle: '',
  password: '',
  password_confirmation: '',
};

const SignUp = () => {
  const { setToken, setIsAuth, setUID } = useContext(AuthContext);

  const [serverError, setServerError] = useState('');

  const handleSubmit = (vals, { setSubmitting }) => {
    console.log('enviando registro');
    registerForPushNotificationsAsync()
      .then((pushToken) => {
        axios
          .post(`/signup`, { "user": { ...vals, push_token: pushToken } })
          .then((resp) => {
            console.log('got resp de registro');
            console.log(resp.headers.authorization.length);
            console.log(resp.headers.authorization);
            const newAuth = JSON.stringify(resp.headers.authorization);
            console.log(newAuth);
            setToken(newAuth);
            setIsAuth(true);
            setUID(JSON.stringify(resp.data.data.id));
            setServerError('');
            router.push('/');
          })
          .catch((err) => {
            console.log('hubo un error de registro');
            console.log(err.response.data.status.message);
            setServerError(err.response.data.status.message);
          })
          .then(() => {setSubmitting(false)});
      });
  };

  return (
    <ScrollView style={{backgroundColor: styles.container.backgroundColor, paddingVertical: 20}}>
      <Text style={{...styles.defaultText, fontSize: 34, textAlign: 'center'}}>Registro de usuario</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.container}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('first_name')}
              onBlur={handleBlur('first_name')}
              value={values.first_name}
            />
            {touched.first_name && errors.first_name && (
              <Text style={styles.error}>{errors.first_name}</Text>
            )}

            <TextInput
              placeholder="Apellido"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('last_name')}
              onBlur={handleBlur('last_name')}
              value={values.last_name}
            />
            {touched.last_name && errors.last_name && (
              <Text style={styles.error}>{errors.last_name}</Text>
            )}
            
            <TextInput
              placeholder="Handle"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('handle')}
              onBlur={handleBlur('handle')}
              value={values.handle}
            />
            {touched.handle && errors.handle && (
              <Text style={styles.error}>{errors.handle}</Text>
            )}
            
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            
            <TextInput
              placeholder="Confirmación de Contraseña"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('password_confirmation')}
              onBlur={handleBlur('password_confirmation')}
              value={values.password_confirmation}
              secureTextEntry
            />
            {touched.password_confirmation && errors.password_confirmation && (
              <Text style={styles.error}>{errors.password_confirmation}</Text>
            )}

            <MyButton 
              label="REGISTRARME" 
              variant='contained'
              OnClick={handleSubmit} 
              disabled={isSubmitting} 
            />

            {serverError ? (
              <Text style={styles.error}>{serverError}</Text>
            ) : null}

            <MyButton
              label="¿YA TE REGISTRASTE? INICIA SESIÓN"
              variant='outlined'
              OnClick={() => router.push('/login')}  // Navegar a la pantalla de registro
            />
            <View style={{ marginTop: 5 }}></View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default SignUp
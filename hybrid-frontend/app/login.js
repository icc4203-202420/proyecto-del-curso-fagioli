import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, View, ScrollView, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import styles from '../styles';
import MyButton from '../MyButton';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('El email es requerido')
    .email('Email no válido')
    .matches(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/, 'Email no válido'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const { setToken, setIsAuth, setUID } = useContext(AuthContext);

  const [serverError, setServerError] = useState('');

  const handleSubmit = (vals, { setSubmitting }) => {
    // console.log({ "user": vals });
    axios
      .post(`/login`, { "user": vals })
      .then((resp) => {
        console.log(resp);
        const newAuth = JSON.stringify(resp.headers.authorization);
        console.log(newAuth);
        setToken(newAuth);
        setIsAuth(true);
        setUID(JSON.stringify(resp.data.status.data.user.id));
        setServerError('');
        router.push('/');  // Redirigir al usuario
      })
      .catch((err) => {
        console.log(err);
        // setServerError(err.response.data);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <ScrollView style={{backgroundColor: styles.container.backgroundColor, paddingVertical: 20}}>
      <Text style={{...styles.defaultText, fontSize: 34, textAlign: 'center'}}>Iniciar Sesión</Text>
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
              placeholder="Contraseña"
              placeholderTextColor="#D97A40"
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <View><Text style={styles.error}>{errors.password}</Text></View>
            )}

            <MyButton 
              label="INICIAR SESIÓN" 
              variant='contained'
              OnClick={handleSubmit} 
              disabled={isSubmitting} 
            />

            {serverError ? (
              <Text style={styles.error}>{serverError}</Text>
            ) : null}

            <MyButton
              label="¿AÚN NO ESTÁS REGISTRADO? REGÍSTRATE"
              variant='outlined'
              OnClick={() => router.push('/signup')}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styless = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;

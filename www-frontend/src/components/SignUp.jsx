import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Stack, Typography } from '@mui/material';
import useAxios from 'axios-hooks';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

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

const SignUp = ({ tokenSaver, setIsAuth, setUID }) => {
  const [serverError, setServerError] = useState('');
  const navi = useNavigate();
  const loginData = {
    "user": {
      "email": "lbfag@gmail.com",
      "password": "luq1234"
    }
  };

  const handleSubmit = (vals, { setSubmitting }) => {
    axios
      .post(`http://127.0.0.1:3001/api/v1/signup`, { "user": vals })
      .then((resp) => {
        // console.log(resp.headers.authorization.length);
        // console.log(resp.headers.authorization);
        const newAuth = JSON.stringify(resp.headers.authorization);
        // console.log(newAuth);
        tokenSaver(newAuth);
        setIsAuth(true);
        setUID(JSON.stringify(resp.data.data.id));
        setServerError('');
        navi('/');
      })
      .catch((err) => {
        console.log(err.response.data.status.message);
        setServerError(err.response.data.status.message);
      })
      .then(() => setSubmitting(false));
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align='center' sx={{ mt: 2, }} >
        Registro de usuario
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
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
              <Field 
                as={TextField}
                label='Email'
                variant='filled'
                autoFocus
                name='email'
                type='email'
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field 
                as={TextField}
                label='Nombre'
                variant='filled'
                name='first_name'
                type='text'
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
              <Field 
                as={TextField}
                label='Apellido'
                variant='filled'
                name='last_name'
                type='text'
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
              <Field 
                as={TextField}
                label='Handle'
                variant='filled'
                name='handle'
                type='text'
                error={touched.handle && Boolean(errors.handle)}
                helperText={touched.handle && errors.handle}
              />
              <Field 
                as={TextField}
                label='Contraseña'
                variant='filled'
                name='password'
                type='password'
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Field 
                as={TextField}
                label='Confirmación de Contraseña'
                variant='filled'
                name='password_confirmation'
                type='password'
                error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                helperText={touched.password_confirmation && errors.password_confirmation}
              />
              <Button
                variant='contained'
                type='submit'
                disabled={isSubmitting}
              >
                Registrarme
              </Button>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
              <Button
                variant='outlined'
                href='/login'
              >
                ¿Ya te registraste? Inicia sesión
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUp
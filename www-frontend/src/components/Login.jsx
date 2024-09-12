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
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const initialValues = {
  email: '',
  password: '',
};

const Login = ({ tokenSaver, setIsAuth, setUID }) => {
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
      .post(`/api/v1/login`, { "user": vals })
      .then((resp) => {
        // console.log(resp.headers.authorization.length);
        // console.log(resp.headers.authorization);
        const newAuth = JSON.stringify(resp.headers.authorization);
        // console.log(newAuth);
        tokenSaver(newAuth);
        setIsAuth(true);
        setUID(JSON.stringify(resp.data.status.data.user.id));
        setServerError('');
        navi('/');
      })
      .catch((err) => {
        setServerError(err.response.data);
      })
      .then(() => setSubmitting(false));
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align='center' sx={{ mt: 2, }} >
        Iniciar Sesión
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
                label='Contraseña'
                variant='filled'
                name='password'
                type='password'
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                variant='contained'
                type='submit'
                disabled={isSubmitting}
              >
                Iniciar Sesión
              </Button>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
              <Button
                variant='outlined'
                href='/signup'
              >
                ¿Aún no estás registrado? Regístrate
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login
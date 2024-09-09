import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
    ].join(','), // Definiendo Roboto como la fuente principal
    },
  palette: {
    primary: {
      main: '#D97A40',  // Un azul suave, cambia esto por el color que prefieras
      contrastText: '#000',
    },
    secondary: {
      main: '#d9d9d9',  // Un verde suave, cambia esto por el color que prefieras
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#3E0808',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#d9d9d9',  // Color para texto principal
      secondary: '#555555',  // Color para texto secundario
      link: '#1872cc',  // Puedes agregar esto para links
    },
  },
  components: {
    // Para botones específicos puedes hacer ajustes aquí
    MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#D97A40',  // Color de la etiqueta cuando no está enfocada
          },
        },
      },
    MuiButton: {
      styleOverrides: {
        root: {
          // Aplica estilos adicionales aquí si es necesario
          fontWeight: 'bold',
        },
      },
    },
    // Ajustes para AppBar, por ejemplo, la topbar
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          color: '#ffffff',  // Establece el color de la fuente a blanco
          backgroundColor: '#462005',  // Cambia esto por el color que desees para la topbar
        },
      },
    },
  },
});

export default theme;
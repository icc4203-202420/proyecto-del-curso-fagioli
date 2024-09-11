import { Link } from 'react-router-dom';
import { Typography, Button, Stack } from '@mui/material';

const Home = () => (
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
    <Typography align='center' variant="h3" gutterBottom>
      Página principal
    </Typography>
    <Button fullWidth component={Link} to='/bars' variant="contained">Buscar bares</Button>
    <Button fullWidth component={Link} to='/bars/map' variant="contained">Mapa-búsqueda de bares</Button>
    <Button fullWidth component={Link} to='/beers' variant="contained">Buscar cervezas</Button>
    <Button fullWidth component={Link} to='/usersearch' variant="contained">Buscar usuarios</Button>
  </Stack>
);

export default Home
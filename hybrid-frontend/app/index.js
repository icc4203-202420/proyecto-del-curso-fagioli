import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styles from '../styles';
import MyButton from '../MyButton';
import { router } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// function App() {
//   const [heads, setHeads] = useStorageState('bars-app-auth', '');
//   const [isAuthenticated, setIsAuthenticated] = useStorageState('bars_isAuth', false);
//   const [userId, setUserId] = useStorageState('bars_user_id', null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const isAuth = (isAuthenticated === 'true') || (isAuthenticated === true);

//     if (!isAuth && location.pathname !== '/login' && location.pathname !== '/signup') {
//       navigate('/login');
//     }
//   });

//   const handleSave = (headers) => {
//     setHeads(headers);
//   };

//   const handleSetAuth = (boli) => {
//     setIsAuthenticated(boli);
//   };

//   const handleLogout = () => {
//     setHeads('');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };
// }

export default function App() {
  console.log("home renders");

  const { token, isAuth } = useContext(AuthContext);
  if (isAuth) {
    console.log('token:',token);
  } else {
    console.log('not auth');
  }

  const testQuery = () => {
    fetch('http://172.22.86.91:3001/api/v1/bars')
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data.bars);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={{...styles.defaultText, fontSize: 48, textAlign: 'center'}} >Página principal</Text>
      <MyButton 
        label='BUSCAR BARES'
        variant='contained'
        OnClick={() => console.log('works')}
      />
      <MyButton 
        label='MAPA-BÚSQUEDA DE BARES'
        variant='contained'
        OnClick={() => console.log('works')}
      />
      <MyButton 
        label='BUSCAR CERVEZAS'
        variant='contained'
        OnClick={() => router.push('/beers')}
      />
      <MyButton 
        label='BUSCAR USUARIOS'
        variant='contained'
        OnClick={() => console.log('works')}
      />
      <MyButton 
        label={'LOGIN'}
        variant={'contained'}
        OnClick={() => router.push('/login')}
      />
      <StatusBar style="auto" />
    </View>
  );
}



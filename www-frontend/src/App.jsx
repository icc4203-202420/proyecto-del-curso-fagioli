import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Home from './components/Home';
import SearchResource from './components/SearchResource';
import EventsBar from './components/EventsBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import axios from 'axios';
import Beer from './components/Beer';
import BarMap from './components/BarMap';
// import SearchResource from './components/Bars';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

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

function App() {
  const [heads, setHeads] = useStorageState('bars-app-auth', '');
  const [isAuthenticated, setIsAuthenticated] = useStorageState('bars_isAuth', false);
  const [userId, setUserId] = useStorageState('bars_user_id', null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = (isAuthenticated === 'true') || (isAuthenticated === true);

    if (!isAuth && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  });

  const handleSave = (headers) => {
    setHeads(headers);
  };

  const handleSetAuth = (boli) => {
    setIsAuthenticated(boli);
  };

  const handleLogout = () => {
    setHeads('');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  }

  // useEffect(() => {
  //   axios
  //     .get('/api/v1/users/1/friendships', { 
  //       headers: { Authorization: JSON.parse(heads) },
  //     })
  //     .then((resp) => console.log(resp.data.friendships))
  //     .catch((err) => {
  //       console.log(err);
  //       if (err.status === 401) {
  //         setIsAuthenticated(false);
  //       }
  //     });
  // }, [heads]);

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ width: 'fit-content', margin: 'auto' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Bars App
          </Typography>
          <List sx={{ display: 'flex', flexDirection: 'row', marginLeft: 5, gap: 0 }}>
            <ListItem component={Link} to="/">
              <ListItemIcon>
                <HomeIcon color='secondary' />
              </ListItemIcon>
            </ListItem>
            <ListItem onClick={() => { handleLogout() }}>
              <ListItemIcon>
                <LogoutIcon color='secondary' />
              </ListItemIcon>
              {/* <ListItemText primary="Cerrar Sesión" /> */}
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bars' element={<SearchResource endpoint={'bars'} resource={'Bar'} />} />
        <Route path='/bars/:id/events' element={<EventsBar auth={heads} setIsAuth={handleSetAuth} current_user_id={userId} />} />
        <Route path='/beers' element={<SearchResource endpoint={'beers'} resource={'Cerveza'} />} />
        <Route path='/beers/:id' element={<Beer auth={heads} setIsAuth={handleSetAuth} />} />
        <Route path='/usersearch' element={<SearchResource endpoint={'usersearch'} resource={'Usuario'} />} />
        <Route path='/login' element={<Login tokenSaver={handleSave} setIsAuth={handleSetAuth} setUID={setUserId} />} />
        <Route path='/signup' element={<SignUp tokenSaver={handleSave} setIsAuth={handleSetAuth} setUID={setUserId} />} />
        <Route path='/bars/map' element={<BarMap />} />
      </Routes>
    </div>
  )
}

export default App

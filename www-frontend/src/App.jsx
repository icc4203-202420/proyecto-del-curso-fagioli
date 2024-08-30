import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Home from './components/Home';
import SearchResource from './components/SearchResource';
import EventsBar from './components/EventsBar';
// import SearchResource from './components/Bars';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ width: 'fit-content', margin: 'auto' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Bars App
          </Typography>
          <List sx={{ marginLeft: 12 }}>
            <ListItem component={Link} to="/">
              <ListItemIcon>
                <HomeIcon color='secondary' />
              </ListItemIcon>
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bars' element={<SearchResource endpoint={'bars'} resource={'Bar'} />} />
        <Route path='/bars/:id/events' element={<EventsBar />} />
        <Route path='/beers' element={<SearchResource endpoint={'beers'} resource={'Beer'} />} />
        <Route path='/usersearch' element={<SearchResource endpoint={'usersearch'} resource={'User'} />} />
      </Routes>
    </div>
  )
}

export default App

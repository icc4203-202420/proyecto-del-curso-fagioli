import { Link } from 'react-router-dom';
import { Typography, TextField, Button, Stack, ListItem, ListItemButton, ListItemText, LinearProgress, Autocomplete, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchResource = ({ endpoint, resource, auth, setIsAuth, current_user_id }) => {
   
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getResources = () => {
    setisLoading(true);
    axios.get(`/api/v1/${endpoint}`,
      {
        headers: { Authorization: JSON.parse(auth) }
      }
    )
      .then((resp) => {
        if (resource === 'Usuario') {
          axios.get('/api/v1/events',
            {
              headers: { Authorization: JSON.parse(auth) }
            })
            .then((resp_events) => {
              setUserEvents(resp_events.data.events);
            })
            .catch((error) => {
              console.error(error);
              if (error.status === 401) {
                setIsAuth(false);
              }
            });
        }
        setisLoading(false);
        setData(Object.values(resp.data)[0]);
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 401) {
          setIsAuth(false);
        }
      });
  }

  useEffect(() => {
    getResources();
  }, []);

  const handleInput = (event) => {
    setTerm(event.target.value);
  }

  const handleSearch = () => {
    const filtered = data.filter((elem) => (
      elem.name.toLowerCase().includes(term.toLowerCase())
    ));
    setData(filtered);
  }

  const handleCreateFriendship = (future_friend_id) => {
    axios.post(`/api/v1/users/${current_user_id}/friendships`,
      { 
        friendship: { 
          friend_id: future_friend_id, 
          event_id: selectedEvent ? selectedEvent.id : null, 
          bar_id: selectedEvent ? selectedEvent.bar_id : null
        } 
      },
      {
        headers: { Authorization: JSON.parse(auth) }
      }
    )
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        getResources();
      })
      .catch((error) => {
        console.error("Error creando la amistad:", error);
        if (error.status === 401) {
          setIsAuth(false);
        }
      });
  }
  
  return (
    <Stack 
      spacing={2}
      sx={{
        padding: '20px',
        justifyContent: "center",
        alignItems: "flex-center",
        // width: 'fit-content',
        margin: 'auto',
      }} 
    >
      <Typography variant="h4" gutterBottom>
        Buscar {`${resource.toLowerCase()}`}
      </Typography>
      <TextField label={`${resource}`} variant="filled" onChange={handleInput} autoFocus margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSearch} >
        Buscar
      </Button>

      {isLoading ? (
        // <Box sx={{ display: 'flex' }}>
        //   <CircularProgress />
        // </Box>
        <LinearProgress />
      ) : (
        data.length > 0 ? (
          data.map((elem, id) => {
            let the_elem = '';
            if (resource === 'Usuario') {
              the_elem = elem.handle.toLowerCase();
            } else {
              the_elem = elem.name.toLowerCase();
            }
            if (the_elem.includes(term.toLowerCase())) {
              return (
                <Stack
                  key={elem.id || id}
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: '100%',
                  }}
                >
                  {
                    resource === 'Cerveza' && (
                      <ListItem key={id}>
                        <ListItemButton 
                          component='a' 
                          href={`/beers/${elem.id}`}
                          sx={{ 
                            backgroundColor: 'background.default', 
                            color: 'primary.main', 
                            border: 1,
                            borderRadius: 1,
                            borderColor: 'primary.main',
                            // '&:hover': {
                            //   backgroundColor: 'secondary.dark',
                            // }
                          }}
                        >
                          <ListItemText primary={elem.name} />
                        </ListItemButton>
                      </ListItem>
                    )
                  }
                  {
                    resource === 'Bar' && (
                      <>
                        <Stack>
                          <Typography variant='h6'>{elem.name}</Typography>
                          <Typography variant='body2'>{`${elem.address.city}, ${elem.country.name}`}</Typography>
                          <Typography variant='caption'>{elem.address.line1}</Typography>
                          <Typography variant='caption'>{elem.address.line2}</Typography>
                        </Stack>
                        <Button 
                          component={Link} 
                          to={`/bars/${elem.id}/events`} 
                          state={{ bar_name: elem.name }}
                          variant="outlined" 
                          sx={{ marginLeft: '10px' }}
                        >
                          Ver eventos
                        </Button>
                      </>
                    )
                  }
                  {
                    resource === 'Usuario' && elem.id != current_user_id && (
                      <Stack
                        key={elem.id}
                        direction='row'
                        // spacing={2}
                        sx={{ 
                          backgroundColor: "#320808",
                          padding: 2,
                          borderRadius: 5,
                          boxShadow: '1px 1px #1E0808',
                          filter: 'drop-shadow(1px 1px 0.3rem #150505)',
                          opacity: 1,
                          width: '100%',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <Stack sx={{ width: '40%', margin: 'auto 0' }}>
                          <Typography variant='body1' style={{ wordWrap: "break-word", width: '100%' }}>{elem.handle}</Typography>
                          <Typography variant='caption' sx={{ color: '#D97A40' }} >{ elem.is_friend ? ('Amigo') : ('') }</Typography>
                        </Stack>
                        <Stack spacing={1} sx={{ width: '40%' }}>
                          <Autocomplete 
                            disabled={elem.is_friend}
                            options={userEvents} 
                            getOptionLabel={(option) => option.name}
                            renderOption={(props, option) => (
                              <li {...props} key={option.id}
                                style={{ backgroundColor: '#320808', color: '#ddd' }}
                              >
                                {option.name}
                              </li>
                            )}
                            onChange={(event, newValue) => {
                              setSelectedEvent(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Evento" />}
                          />
                          <Button 
                            onClick={() => handleCreateFriendship(elem.id)}
                            variant="outlined" 
                            disabled={elem.is_friend}
                            sx={{ marginLeft: '10px' }}
                          >
                            Agregar amigo
                          </Button>
                        </Stack>
                      </Stack>
                    )
                  }
                </Stack>
              )
            }
          })
        ) : (
          <Typography variant='p'>No resources were found.</Typography>
        )
      )}
      
    </Stack>
  );
};

export default SearchResource
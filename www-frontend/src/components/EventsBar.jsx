import { useLocation, useParams } from 'react-router-dom';
import { Typography, CircularProgress, Stack, Box, Divider, Button } from '@mui/material';
import { useState, useEffect, Fragment, useCallback } from 'react';
import axios from 'axios';

const EventsBar = ({ auth, setIsAuth, current_user_id }) => {
  const { id } = useParams();
  const location = useLocation();
  const { bar_name } = location.state || {};

  const [isLoading, setisLoading] = useState(true);
  const [events, setEvents] = useState([]);
  // const [confirmed, setConfirmed] = useState({});

  const getEvents = useCallback(() => {
    setisLoading(true);
    console.log(current_user_id);
    axios.get(`/api/v1/bars/${id}/events`, { 
      headers: { Authorization: JSON.parse(auth) },
    })
      .then((resp) => {
        // console.log(resp.data);
        // console.log(Object.values(resp)[0]);
        setisLoading(false);
        // setEvents(Object.values(resp)[0]);
        const evs = resp.data.events.map((event) => {
          let confirmed = false;
          event.attendances.forEach((attendance) => {
            if (attendance.user_id === parseInt(current_user_id)) {
              confirmed = true;
            }
          });
          return ({...event, confirmed: confirmed});
        });
        console.log('evs:', evs);
        setEvents(evs);
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 401) {
          setIsAuth(false);
        }
      });
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const handleAttend = (ev_id) => {
    axios.post(`/api/v1/bars/${id}/events/${ev_id}/attendances`, 
      { attendance: { event_id: ev_id } }, 
      { 
        headers: { Authorization: JSON.parse(auth) },
      }
    )
      .then((resp) =>{
        console.log(resp);
        const updatedEvents = events.map((event) => {
          if (event.id === ev_id) {
            return {...event, confirmed: true};
          }
          return event;
        });
        setEvents(updatedEvents);
        getEvents();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Stack
      spacing={2}
      sx={{
        padding: '20px',
        justifyContent: "center",
        alignItems: "center",
        width: 'fit-content',
        margin: 'auto',
      }} 
    >
      <Typography variant='h4'>Eventos del bar "{bar_name}" </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        events.length > 0 ? (
          events.map((elem) => (
            <Box
              key={elem.id}
              sx={{ 
                backgroundColor: "#320808",
                padding: 5,
                borderRadius: 5,
                boxShadow: '1px 2px #1E0808',
                filter: 'drop-shadow(3px 3px 0.75rem #150505)',
                opacity: 1,
                width: '100%'
              }}
            >
              <Typography variant='h5'>Evento {elem.name}</Typography>
              <Typography variant='caption'>{`${elem.date.split('T')[0]}, a las ${elem.date.split('T')[1].split('.')[0].slice(0,5)} hrs`}</Typography>
              <Typography variant='subtitle1'>{elem.description}</Typography>
              <br />
              <Typography variant='subtitle1'>Asistentes: </Typography>
              <Divider />
              {
                elem.attendances.sort((a,b) => {
                  console.log('a', a);
                  console.log('b', b);
                  if (!a.is_friend) {
                    return 1
                  }
                  return -1
                }).map((attendance, index) => (
                  <Fragment key={index}>
                    <Typography variant='caption' sx={{ my: 1 }} >
                      {`@${attendance.user_handle} (${attendance.user_first_name} ${attendance.user_last_name}) `}
                      <Typography variant='caption' sx={{ color: '#D97A40' }} >{ attendance.is_friend ? ('Amigo') : ('') }</Typography>
                    </Typography>
                    <Divider />
                  </Fragment>
                ))
              }
              <Button 
                variant='contained' 
                sx={{ mt: 2 }} 
                event_id={elem.id}
                onClick={() => handleAttend(elem.id)}
                disabled={elem.confirmed}
              >
                {elem.confirmed ? ('Asistencia confirmada') : ('Confirmar asistencia')}
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant='p'>No events found.</Typography>
        )
      )}
    </Stack>
)};

export default EventsBar
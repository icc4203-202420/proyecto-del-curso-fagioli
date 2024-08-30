import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Stack } from '@mui/material';
import { useState, useEffect } from 'react';

const EventsBar = () => {
  const { id } = useParams();

  const [isLoading, setisLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setisLoading(true);
    fetch(`http://127.0.0.1:3001/api/v1/bars/${id}/events`)
      .then((response) => response.json())
      .then((resp) => {
        // console.log(resp);
        // console.log(Object.values(resp)[0]);
        setisLoading(false);
        setEvents(Object.values(resp)[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Stack
      spacing={2}
      sx={{
        padding: '20px',
        justifyContent: "center",
        alignItems: "flex-start",
        width: 'fit-content',
        margin: 'auto',
      }} 
    >
      <Typography variant='h4'>Events for Bar {id} </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        events.length > 0 ? (
          events.map((elem) => (
            <Typography variant='p' key={elem.id}>{elem.name}: {elem.description}</Typography>
          ))
        ) : (
          <Typography variant='p'>No events found.</Typography>
        )
      )}
    </Stack>
)};

export default EventsBar
import { Link } from 'react-router-dom';
import { Typography, CircularProgress, TextField, Button, Stack, ListItem, ListItemButton, ListItemText, LinearProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchResource = ({ endpoint, resource }) => {
   
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (resource === 'Usuario') return;
    setisLoading(true);
    axios.get(`/api/v1/${endpoint}`)
      .then((resp) => {
        setisLoading(false);
        setData(Object.values(resp.data)[0]);
      })
      .catch((err) => console.log(err));
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
            if (elem.name.toLowerCase().includes(term.toLowerCase())){
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
                      <Button component={Link} to={`/bars/${elem.id}/events`} variant="outlined" sx={{ marginLeft: '10px' }}>Ver eventos</Button>
                    </>
                  )
                }
              </Stack>
          )}})
        ) : (
          <Typography variant='p'>No resources were found.</Typography>
        )
      )}
      
    </Stack>
  );
};

export default SearchResource
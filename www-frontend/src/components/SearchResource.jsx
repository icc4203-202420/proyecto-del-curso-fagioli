import { Link } from 'react-router-dom';
import { Typography, CircularProgress, TextField, Button, Stack } from '@mui/material';
import { useState, useEffect } from 'react';

const SearchResource = ({ endpoint, resource }) => {
   
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (resource === 'User') return;
    setisLoading(true);
    fetch(`http://127.0.0.1:3001/api/v1/${endpoint}`)
      .then((response) => response.json())
      .then((resp) => {
        // console.log(resp);
        // console.log(Object.values(resp)[0]);
        setisLoading(false);
        setData(Object.values(resp)[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInput = (event) => {
    setTerm(event.target.value);
  }

  const handleSearch = () => {
    // console.log(term);
    // console.log(data);
    const filtered = data.filter((elem) => (
      elem.name.toLowerCase().includes(term.toLowerCase())
    ));
    // console.log(filtered);
    setData(filtered);
  }
  
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
      <Typography variant="h4" gutterBottom>
        Search {`${resource}`}
      </Typography>
      <TextField label={`${resource}`} variant="filled" onChange={handleInput} autoFocus margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSearch} >
        search
      </Button>
      {isLoading ? (
        <CircularProgress />
      ) : (
        data.length > 0 ? (
          data.map((elem) => {
            if (elem.name.toLowerCase().includes(term.toLowerCase())){
            return (
              <>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: '100%',
                  }}
                >
                  <Typography variant='span' key={elem.id}>{elem.name}</Typography>
                  {
                    resource === 'Bar' && (
                      <Button component={Link} to={`/bars/${elem.id}/events`} variant="outlined" sx={{ marginLeft: '10px' }}>See events</Button>
                    )
                  }
                </Stack>
              </>
          )}})
        ) : (
          <p>No bars found.</p>
        )
      )}
      
    </Stack>
  );
};

export default SearchResource
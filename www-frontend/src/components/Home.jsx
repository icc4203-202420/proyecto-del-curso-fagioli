import { Link } from 'react-router-dom';
import { Typography, Button, Stack } from '@mui/material';

const Home = () => (
    <>
        <Stack
            spacing={3}
            sx={{
                padding: '20px',
                justifyContent: "center",
                alignItems: "flex-start",
                width: 'fit-content',
                margin: 'auto',
            }} 
        >
            <Typography variant="h3" gutterBottom>
                Home
            </Typography>
            <Button component={Link} to='/bars' variant="contained">Search for bars</Button>
            <Button component={Link} to='/beers' variant="contained">Search for beers</Button>
            <Button component={Link} to='/usersearch' variant="contained">Search for user</Button>
        </Stack>

    </>
);

export default Home
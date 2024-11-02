import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Button, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { pink } from '@mui/material/colors';

const containerStyle = {
  width: '80vw',
  height: '50vh',
  margin: 'auto',
  marginTop: 20,
  borderRadius: 10,
  opacity: 0.8
};

const center = {
  lat: -33.40,
  lng: -70.623
};

function BarMap() {
  const mapRef = useRef();
  const mapNodeRef = useRef();
  const [bars, setBars] = useState([]);
  const [term, setTerm] = useState('');
  const [MarkerClass, setMarkerClass] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    const fetchLibs = async () => {

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement: Marker, PinElement } = await loader.importLibrary('marker');

      mapRef.current = new Map(mapNodeRef.current, {
        mapId: 'DEMO_MAP_ID',
        center: center,
        zoom: 11,
      });

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userCo = { lat: latitude, lng: longitude };
        const pin = new PinElement();
        pin.glyph = 'Yo';
        pin.glyphColor = 'White';
        pin.borderColor = '#67abfa';
        pin.background = '#67abfa';
        const marker = new Marker({ position: userCo, content: pin.element });
        marker.setMap(mapRef.current);
        mapRef.current.panTo(userCo);
      });

      const response = await axios.get('http://127.0.0.1:3001/api/v1/bars');
      setBars(response.data.bars);
      setMarkerClass(() => Marker);
      
    }

    fetchLibs();

  }, []);

  const handleSearch = (event) => {
    setTerm(event.target.value);
  }

  useEffect(() => {
    if (!MarkerClass || bars.length === 0) return
  
    markers.map((marker) => marker.setMap(null));

    const newmarks = bars
      .filter((bar) => (
        bar.name.toLowerCase().includes(term.toLowerCase())
      ))
        .map((bar, index) => {
          return new MarkerClass({
            map: mapRef.current,
            position: { lat: bar.latitude, lng: bar.longitude }
          })
        });
    
    setMarkers(newmarks);

  }, [MarkerClass, bars, term]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBars = bars.filter((bar) => (
        bar.name.toLowerCase().includes(term.toLowerCase())
      ));

    mapRef.current.panTo({ lat: newBars[0].latitude, lng: newBars[0].longitude });
  }

  return (
    <Stack
      spacing={2}
      sx={{
        width: 'fit-content',
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Typography variant='h5' gutterBottom>Buscar bar en el mapa</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', margin: 'auto', alignItems: 'center', gap: 10, marginTop: 10 }}>
        <TextField variant='filled' label='Nombre del bar' onChange={handleSearch} />
        <Button type='submit' variant='contained'>Localizar</Button>
      </form>
      <div ref={mapNodeRef} style={containerStyle} />
    </Stack>
  );
}

export default BarMap;
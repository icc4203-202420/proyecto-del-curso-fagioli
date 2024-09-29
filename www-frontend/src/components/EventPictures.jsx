import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Stack, Box, Button, Card, CardMedia, CardContent } from '@mui/material';

const EventPictures = ({ auth, setIsAuth, current_user_id }) => {
  const { bar_id, event_id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const getPictures = () => {
    axios.get(`http://127.0.0.1:3001/api/v1/bars/${bar_id}/events/${event_id}/event_pictures`,
      {
        headers: { Authorization: JSON.parse(auth) }
      }
    )
      .then((data) => {
        console.log("Respuesta del servidor:", data.data.event_pictures);
        setPictures(data.data.event_pictures);
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 401) {
          setIsAuth(false);
        }
      });
  }
  
  useEffect(() => {
    getPictures();
  }, []);

  const handleImageUpload = () => {
    if (selectedImage) {
      axios.post(`http://127.0.0.1:3001/api/v1/bars/${bar_id}/events/${event_id}/event_pictures`,
        { event_picture: { event_id: event_id, user_id: current_user_id, image_base64: selectedImage } },
        {
          headers: { Authorization: JSON.parse(auth) }
        }
      )
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          getPictures();
        })
        .catch((error) => {
          console.error("Error subiendo la imagen:", error);
          if (error.status === 401) {
            setIsAuth(false);
          }
        });
    } else {
      console.error("No hay imagen seleccionada.");
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.style.maxHeight = '300px';
      }
    } catch (error) {
      console.error("Error accediendo a la cámara: ", error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };
  return (
    <Stack
      spacing={4}
      sx={{
        padding: '20px',
        justifyContent: "center",
        alignItems: "center",
        maxWidth: '600px',
        margin: 'auto',
      }}
    >
      <Typography variant="h4" textAlign="center">
        Fotos del evento
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {!selectedImage ? (
          <>
            <Box
              component="video"
              ref={videoRef}
              autoPlay
              sx={{
                width: '100%',
                maxHeight: 300,
                backgroundColor: '#200505',
                borderRadius: '3%'
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={startCamera}>
                Iniciar cámara
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={capturePhoto}
                disabled={!stream}
              >
                Capturar foto
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography variant="h6">Imagen capturada:</Typography>
            <Box
              component="img"
              src={selectedImage}
              alt="captured"
              sx={{
                width: '100%',
                maxHeight: '300px',
                borderRadius: '10px',
                border: 'solid 2px black',
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" onClick={handleImageUpload}>
                Subir imagen
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setSelectedImage(null)}>
                Reiniciar
              </Button>
            </Stack>
          </>
        )}
      </Box>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <Stack spacing={4} sx={{ width: '100%' }}>
        {pictures.toReversed().map((pic, index) => (
          <Card key={index} sx={{ maxWidth: 345, margin: 'auto', boxShadow: 4, backgroundColor: "#320808" }}>
            <CardMedia
              component="img"
              height="200"
              image={pic.image_url}
              alt={`Event picture ${index + 1}`}
              sx={{
                opacity: 0.9,
                transition: "0.3s",
                '&:hover': { opacity: 1, transform: 'scale(1.05)' },
              }}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                @{pic.handle}
              </Typography>
              <Typography variant="body2" color="#ccc">
                {new Date(pic.created_at).toLocaleTimeString('es-CL')}
              </Typography>
              <Typography variant="body2" color="#ccc">
                {new Date(pic.created_at).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
              { (pic.tags.length > 0) ? (
                <>
                  <br />
                  <Typography variant="body2" color="#ccc">
                    Etiquetados: { pic.tags.map((tag) => (`@${tag.handle} `)) }
                  </Typography>
                </>
              ) : (null) }
            </CardContent>
          </Card>
        ))}
      </Stack>
      </Stack>
  );
}

export default EventPictures;
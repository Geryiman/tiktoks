const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const videoRoutes = require('./routes/video.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de TikTok App');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

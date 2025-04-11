require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const db = require('./src/db'); // conexión a MySQL
const videoRoutes = require('./src/routes/video.routes');
const authRoutes = require('./src/routes/auth.routes');
const likeRoutes = require('./src/routes/like.routes');
const commentRoutes = require('./src/routes/comment.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(morgan('dev'));
app.use(cors());

// 🚨 Aquí está la corrección
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 100000 }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo
} = require('../controllers/video.controller');

// Configuración de Multer para guardar los archivos temporalmente
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Endpoints
router.post('/upload', upload.single('video'), uploadVideo); // ✅ Subir video
router.get('/', getAllVideos);                                // ✅ Obtener todos los videos
router.get('/:id', getVideoById);                             // ✅ Obtener video por ID
router.delete('/:id', deleteVideo);                           // ✅ Eliminar video

module.exports = router;

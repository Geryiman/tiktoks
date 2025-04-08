
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const db = require('../db');
const uploadToCloudflare = require('../services/cloudflare.service');

const uploadVideo = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Obtener duración del video usando ffmpeg
    ffmpeg.ffprobe(filePath, async (err, metadata) => {
      if (err) return res.status(500).json({ error: '❌ Error al analizar el video' });

      const duration = metadata.format.duration;
      console.log(`⏱️ Duración del video: ${duration}`);

      console.log(`📤 Subiendo video a Cloudflare: ${filePath}`);
      const result = await uploadToCloudflare(filePath);

      if (!result.success) {
        console.error('❌ Error al subir video a Cloudflare:', result.error);
        return res.status(500).json({ error: 'Error al subir video a Cloudflare', result });
      }

      const { uid } = result.result;

      // Guardar metadata en la base de datos
      await db.execute(
        'INSERT INTO videos (cloudflare_uid, title, description, user_id) VALUES (?, ?, ?, ?)',
        [uid, req.body.title || '', req.body.description || '', req.body.user_id || null]
      );

      return res.status(200).json({ message: '✅ Video subido correctamente', uid });
    });
  } catch (error) {
    console.error('❌ Error en uploadVideo:', error);
    res.status(500).json({ error: 'Error general al subir video', details: error.message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM videos ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al obtener videos:', error);
    res.status(500).json({ error: 'Error al obtener videos' });
  }
};

const getVideoById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM videos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Video no encontrado' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener video por ID:', error);
    res.status(500).json({ error: 'Error al obtener video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    await db.execute('DELETE FROM videos WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: '🗑️ Video eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar video:', error);
    res.status(500).json({ error: 'Error al eliminar video' });
  }
};

module.exports = {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo
};

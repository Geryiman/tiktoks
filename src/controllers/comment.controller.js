const db = require('../db');
const moment = require('moment');
moment.locale('es'); // Para mostrar "hace 5 minutos", etc.

exports.addComment = async (req, res) => {
  const { video_id, user_id, content } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO comments (video_id, user_id, content) VALUES (?, ?, ?)',
      [video_id, user_id, content]
    );
    res.status(201).json({ id: result.insertId, video_id, user_id, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
};

exports.getCommentsByVideo = async (req, res) => {
  const { video_id } = req.params;
  try {
    const [comments] = await db.query(
      'SELECT c.id, c.content, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE video_id = ? ORDER BY c.created_at DESC',
      [video_id]
    );

    const comentariosConFecha = comments.map(com => ({
      ...com,
      fecha_relativa: moment(com.created_at).fromNow()
    }));

    res.json({ comentarios: comentariosConFecha });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

exports.deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  try {
    await db.query('DELETE FROM comments WHERE id = ?', [comment_id]);
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
};

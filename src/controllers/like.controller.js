const db = require('../db');

exports.toggleLike = async (req, res) => {
  const { video_id, user_id } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT * FROM likes WHERE video_id = ? AND user_id = ?',
      [video_id, user_id]
    );
    if (existing.length > 0) {
      await db.query('DELETE FROM likes WHERE video_id = ? AND user_id = ?', [video_id, user_id]);
      return res.json({ liked: false });
    } else {
      await db.query('INSERT INTO likes (video_id, user_id) VALUES (?, ?)', [video_id, user_id]);
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar like' });
  }
};

exports.getLikesCount = async (req, res) => {
  const { video_id } = req.params;
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM likes WHERE video_id = ?', [video_id]);
    res.json({ likes: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: 'Error al contar likes' });
  }
};
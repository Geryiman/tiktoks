const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');

router.post('/toggle', likeController.toggleLike);
router.get('/count/:video_id', likeController.getLikesCount);
router.get('/', likeController.userLikedVideo);

module.exports = router;
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.post('/', commentController.addComment);
router.get('/:video_id', commentController.getCommentsByVideo);

module.exports = router;
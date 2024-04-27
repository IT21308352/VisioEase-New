// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const {
    getAllCommentsWithReplies,
    createComment,
    createReply,
    editReply, // Add the editReply method
    updateComment,
    deleteComment,
    deleteReply,
} = require('../controllers/commentController');
const { protect } = require('../Middlewares/authMiddleware');

// GET all comments with replies
router.get('/comments', getAllCommentsWithReplies);

// POST create a new comment
router.post('/comments', createComment);

// POST create a new reply to a comment
router.post('/comments/:commentId/replies', createReply);

// PUT update a comment
router.put('/comments/:commentId', updateComment);

// DELETE delete a comment
router.delete('/comments/:commentId', deleteComment);

// DELETE delete a reply
router.delete('/comments/:commentId/replies/:replyIndex', deleteReply); // Correct parameter name

// PUT edit a reply
router.put('/comments/:commentId/replies/:replyIndex', editReply); // Add the editReply route

module.exports = router;

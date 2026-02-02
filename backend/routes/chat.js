const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { auth } = require('../middleware/auth');

// @route   GET /api/chat/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId
    })
      .populate('participants', 'name email phone')
      .populate('job', 'title location salary')
      .sort({ lastMessage: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/chat/:chatId
// @desc    Get chat messages
// @access  Private
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name email phone')
      .populate('job', 'title location salary');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Check if user is a participant
    const isParticipant = chat.participants.some(
      p => p._id.toString() === req.userId
    );
    
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized to view this chat' });
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/chat/create
// @desc    Create or get existing chat
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { otherUserId, jobId } = req.body;
    
    if (!otherUserId) {
      return res.status(400).json({ error: 'Other user ID is required' });
    }
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, otherUserId] },
      job: jobId || null
    });
    
    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.userId, otherUserId],
        job: jobId || null,
        messages: []
      });
      await chat.save();
    }
    
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email phone')
      .populate('job', 'title location salary');
    
    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/chat/:chatId/message
// @desc    Send a message
// @access  Private
router.post('/:chatId/message', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Check if user is a participant
    const isParticipant = chat.participants.some(
      p => p.toString() === req.userId
    );
    
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized to send messages in this chat' });
    }
    
    // Add message
    chat.messages.push({
      sender: req.userId,
      text: text.trim(),
      timestamp: new Date()
    });
    
    chat.lastMessage = new Date();
    await chat.save();
    
    const updatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email phone')
      .populate('job', 'title location salary');
    
    res.status(201).json(updatedChat);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

import express from 'express';
import Complaint from '../models/Complaint.js';
import { newComplaint } from '../controllers/complaintsController.js';
import { authenticateToken } from '../middleware/auth.js';


const complaintRoutes = express.Router();

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', authenticateToken, upload.array('attachments', 5), newComplaint );

// @route   GET /api/complaints
// @desc    Get all complaints for the logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get complaint by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('comments.user', 'name email role')
      .populate('statusUpdates.by', 'name');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if the user is authorized to view this complaint
    if (complaint.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }
    
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/complaints/track/:trackingId
// @desc    Get complaint by tracking ID (public route for tracking)
// @access  Public
router.get('/track/:trackingId', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId });
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/complaints/:id/comments
// @desc    Add a comment to a complaint
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if the user is authorized to comment on this complaint
    if (complaint.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to comment on this complaint' });
    }
    
    // Add comment
    complaint.comments.push({
      text: req.body.text,
      user: req.user._id
    });
    
    await complaint.save();
    
    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default complaintRoutes;
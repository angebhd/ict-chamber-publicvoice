import express from 'express';
import { addComment, getAllComplaints, getComplaint, getTracking, newComplaint } from '../controllers/complaintsController.js';
import { authenticateToken } from '../middleware/auth.js';


const complaintRoutes = express.Router();

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', authenticateToken, upload.array('attachments', 5), newComplaint );

// @route   GET /api/complaints
// @desc    Get all complaints for the logged in user
// @access  Private
router.get('/', authenticateToken, getAllComplaints );

// @route   GET /api/complaints/:id
// @desc    Get complaint by ID
// @access  Private
router.get('/:id', authenticateToken, getComplaint );

// @route   GET /api/complaints/track/:trackingId
// @desc    Get complaint by tracking ID (public route for tracking)
// @access  Public
router.get('/track/:trackingId', getTracking );

// @route   POST /api/complaints/:id/comments
// @desc    Add a comment to a complaint
// @access  Private
router.post('/:id/comments', authenticateToken, addComment );

export default complaintRoutes;

import express from 'express';
import { 
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getCommentsByComplaintId,
  addComment,
  getDashboardStats,
  getDepartmentComplaints
} from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware to all routes
router.use(authenticateToken, isAdmin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/complaints', getComplaints);
router.get('/department/complaints', getDepartmentComplaints);

// Complaint management routes
router.get('/complaints/:id', getComplaintById);
router.put('/complaints/:id', updateComplaintStatus);
router.put('/complaints/:id/assign', assignComplaint);

// Comment routes
router.get('/complaints/:id/comments', getCommentsByComplaintId);
router.post('/complaints/:id/comments', addComment);

export default router;
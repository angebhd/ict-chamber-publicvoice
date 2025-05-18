import express from 'express';
import { addComment, getAllComplaints, getComplaint, getTracking, newComplaint } from '../controllers/complaintsController.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Set up file storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: function (req, file, cb) {
        const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images, PDFs, and Word documents are allowed'));
        }
    }
});

const router = express.Router();

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

export default router;
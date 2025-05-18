import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Complaint from '../models/Complaint';


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

export const newComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    
    // Create complaint object
    const complaint = new Complaint({
      title,
      description,
      category,
      location,
      user: req.user._id
    });
    
    // Add attachments if any
    if (req.files && req.files.length > 0) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      complaint.attachments = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        url: `${baseUrl}/uploads/${file.filename}`,
        contentType: file.mimetype
      }));
    }
    
    // Add initial status update
    complaint.statusUpdates.push({
      status: 'new',
      note: 'Complaint submitted'
    });
    
    await complaint.save();
    
    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create complaint' });
  }
}

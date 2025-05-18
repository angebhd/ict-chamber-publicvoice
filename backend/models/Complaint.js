import mongoose from 'mongoose';

// Generate tracking ID
const generateTrackingId = () => {
  const prefix = 'CMP';
  const randomPart = Math.floor(10000 + Math.random() * 90000); // 5-digit number
  return `${prefix}-${randomPart}`;
};

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
});

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const statusUpdateSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [ 'pending', 'in_progress', 'resolved', 'rejected'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const complaintSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true,
    default: generateTrackingId
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'pending', 'in_progress', 'under_review', 'resolved', 'rejected', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String
  },
  attachments: [attachmentSchema],
  comments: [commentSchema],
  statusUpdates: [statusUpdateSchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedResolutionTime: {
    type: String
  },
  publicDisplay: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add initial status update on creation
complaintSchema.pre('save', function(next) {
  if (this.isNew && this.statusUpdates.length === 0) {
    this.statusUpdates.push({
      status: this.status,
      date: new Date(),
      note: 'Complaint submitted'
    });
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
// import Department from '../models/departmentModel.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  const total = await Complaint.countDocuments({});
  const pending = await Complaint.countDocuments({ status: 'pending' });
  const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
  const resolved = await Complaint.countDocuments({ status: 'resolved' });
  const rejected = await Complaint.countDocuments({ status: 'rejected' });

  console.log("Total "+total);
  
  const stats = {
    total,
    pending,
    inProgress,
    resolved,
    rejected,
    // Add more analytics as needed
    responseTime: '24 hrs', // This would be calculated in a real implementation
    resolutionRate: '78%',
    satisfaction: '4.2/5',
    newComplaints: 43,
  };

  res.json(stats);
};

/**
 * @desc    Get all complaints (with pagination and filtering)
 * @route   GET /api/admin/complaints
 * @access  Private/Admin
 */
const getComplaints = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object based on query parameters
  const filter = {};

  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
  }

  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category;
  }

  if (req.query.department && req.query.department !== 'all') {
    filter.department = req.query.department;
  }

  if (req.query.priority && req.query.priority !== 'all') {
    filter.priority = req.query.priority;
  }

  // Search functionality
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const complaints = await Complaint.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Complaint.countDocuments(filter);

  res.json({
    complaints,
    page,
    pages: Math.ceil(total / limit),
    total
  });
};

/**
 * @desc    Get complaints for a specific department
 * @route   GET /api/admin/department/complaints
 * @access  Private/Admin
 */
const getDepartmentComplaints = async (req, res) => {
  const adminDept = req.user.department;

  if (!adminDept) {
    res.status(400);
    throw new Error('Admin is not assigned to any department');
  }

  const complaints = await Complaint.find({ department: adminDept })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json(complaints);
};

/**
 * @desc    Get a specific complaint by ID
 * @route   GET /api/admin/complaints/:id
 * @access  Private/Admin
 */
const getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('user', 'name email phone address')
    .populate('comments.user', 'name email');

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Check if admin has access to this complaint
  // If admin is not a superadmin, they should only access complaints in their department
  if (req.user.role !== 'superadmin' && complaint.department !== req.user.department) {
    res.status(403);
    throw new Error('Not authorized to access this complaint');
  }

  res.json(complaint);
};

/**
 * @desc    Update complaint status, priority, and department
 * @route   PUT /api/admin/complaints/:id
 * @access  Private/Admin
 */
const updateComplaintStatus = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Check if admin has access to this complaint
  if (req.user.role !== 'superadmin' && complaint.department !== req.user.department) {
    res.status(403);
    throw new Error('Not authorized to update this complaint');
  }

  // Update fields if provided
  if (req.body.status) {
    complaint.status = req.body.status;

    // Add status update to history
    complaint.statusUpdates.push({
      status: req.body.status,
      date: new Date(),
      note: req.body.note || `Status updated to ${req.body.status}`,
      by: req.user._id
    });
  }

  if (req.body.priority) {
    complaint.priority = req.body.priority;
  }

  if (req.body.department) {
    complaint.department = req.body.department;
  }

  const updatedComplaint = await complaint.save();
  res.json(updatedComplaint);
};

/**
 * @desc    Assign complaint to an admin
 * @route   PUT /api/admin/complaints/:id/assign
 * @access  Private/Admin
 */
const assignComplaint = async (req, res) => {
  const { adminId } = req.body;

  if (!adminId) {
    res.status(400);
    throw new Error('Admin ID is required');
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Check if admin exists and has the right role
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== 'admin') {
    res.status(400);
    throw new Error('Invalid admin user');
  }

  // Update the complaint
  complaint.assignedTo = adminId;

  // If not already in progress, update status
  if (complaint.status === 'pending') {
    complaint.status = 'in_progress';

    // Add status update to history
    complaint.statusUpdates.push({
      status: 'in_progress',
      date: new Date(),
      note: `Assigned to ${admin.name}`,
      by: req.user._id
    });
  }

  const updatedComplaint = await complaint.save();
  res.json(updatedComplaint);
};

/**
 * @desc    Get comments for a specific complaint
 * @route   GET /api/admin/complaints/:id/comments
 * @access  Private/Admin
 */
const getCommentsByComplaintId = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('comments.user', 'name email role');

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Return comments from the complaint document
  res.json(complaint.comments);
};

/**
 * @desc    Add a comment to a complaint
 * @route   POST /api/admin/complaints/:id/comments
 * @access  Private/Admin
 */
const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Create a new comment and add it to the complaint
  const newComment = {
    text,
    user: req.user._id,
    createdAt: new Date()
  };

  complaint.comments.push(newComment);

  // If complaint is in pending status, update to in_progress
  if (complaint.status === 'pending') {
    complaint.status = 'in_progress';
    complaint.statusUpdates.push({
      status: 'in_progress',
      date: new Date(),
      note: 'Admin responded to complaint',
      by: req.user._id
    });
  }

  await complaint.save();

  // For response, return the newly added comment with populated user
  const updatedComplaint = await Complaint.findById(req.params.id)
    .populate('comments.user', 'name email');
  const addedComment = updatedComplaint.comments[updatedComplaint.comments.length - 1];

  res.status(201).json(addedComment);
};

export {
  getDashboardStats,
  getComplaints,
  getDepartmentComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getCommentsByComplaintId,
  addComment
};
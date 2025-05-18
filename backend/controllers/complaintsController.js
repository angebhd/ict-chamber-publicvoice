import Complaint from '../models/Complaint.js';

export const newComplaint = async (req, res) => {
    try {
        const { title, description, category, location, department, publicDisplay } = req.body;

        // Create complaint object
        const complaint = new Complaint({
            title,
            description,
            category,
            location,
            department,
            publicDisplay: publicDisplay || false,
            user: req.user._id,
            status: 'pending'
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

        await complaint.save();

        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create complaint' });
    }
}

export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email');

        res.json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('comments.user', 'name email role')
            .populate('statusUpdates.by', 'name')
            .populate('assignedTo', 'name email role');

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
}

export const getTracking = async (req, res) => {
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
}

export const addComment = async (req, res) => {
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

        // Populate the new comment with user data
        const updatedComplaint = await Complaint.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('comments.user', 'name email role')
            .populate('statusUpdates.by', 'name');

        res.status(201).json(updatedComplaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only admin/superadmin can update status
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized to update complaint status' });
        }

        // Update the complaint status
        complaint.status = status;
        
        // Add status update entry
        complaint.statusUpdates.push({
            status,
            note,
            by: req.user._id
        });

        await complaint.save();

        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const assignComplaint = async (req, res) => {
    try {
        const { assignedTo, estimatedResolutionTime } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only admin/superadmin can assign complaints
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized to assign complaints' });
        }

        complaint.assignedTo = assignedTo;
        if (estimatedResolutionTime) {
            complaint.estimatedResolutionTime = estimatedResolutionTime;
        }

        // Add status update if complaint is being assigned for the first time
        if (!complaint.assignedTo) {
            complaint.statusUpdates.push({
                status: 'in_progress',
                note: 'Complaint assigned to staff',
                by: req.user._id
            });
            complaint.status = 'in_progress';
        }

        await complaint.save();

        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

/*** 
import Complaint from '../models/Complaint.js';


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

export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email');

        res.json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getComplaint = async (req, res) => {
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
}

export const getTracking = async (req, res) => {
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
}

export const addComment = async (req, res) => {
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
}

*****/
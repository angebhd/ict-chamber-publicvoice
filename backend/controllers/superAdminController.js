import User from '../models/User.js';
import Department from '../models/Department.js';

// Department Management
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    const departmentExists = await Department.findOne({ 
      $or: [{ name }, { code }] 
    });
    
    if (departmentExists) {
      return res.status(400).json({ 
        message: 'Department already exists with this name or code' 
      });
    }
    
    const department = await Department.create({
      name,
      code,
      description
    });
    
    res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Management
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, department, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const departmentExists = await Department.findOne({ code: department });
    if (!departmentExists) {
      return res.status(400).json({ message: 'Invalid department' });
    }
    
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      department,
      phone
    });
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort('-createdAt');
    
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const admin = await User.findOneAndUpdate(
      { _id: id, role: 'admin' },
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard Statistics
export const getAdminStats = async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalDepartments = await Department.countDocuments();
    const activeAdmins = await User.countDocuments({ role: 'admin', isActive: true });
    
    res.status(200).json({
      totalAdmins,
      totalDepartments,
      activeAdmins
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// System Initialization
// export const initializeSystem = async (req, res) => {
export const initializeSystem = async () => {
  try {
    // Check if system is already initialized
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    if (superAdminExists) {
      console.log("System is already initialized");
      
      return
      // return res.status(400).json({ message: 'System is already initialized' });
    }

    // Create departments
    const departments = [
      { name: 'Public Works Department', code: 'public_works', description: 'Handles infrastructure and maintenance' },
      { name: 'Water Utility', code: 'water_utility', description: 'Manages water supply and quality' },
      { name: 'Electricity Utility', code: 'electricity_utility', description: 'Manages power distribution' },
      { name: 'Sanitation Department', code: 'sanitation', description: 'Handles waste management and cleaning' },
      { name: 'Transportation Department', code: 'transportation', description: 'Manages public transport and traffic' },
      { name: 'Parks & Recreation', code: 'parks_recreation', description: 'Maintains parks and recreational facilities' },
      { name: 'Police Department', code: 'police', description: 'Handles law enforcement and public safety' },
      { name: 'Animal Control', code: 'animal_control', description: 'Manages animal-related issues' }
    ];

    await Department.insertMany(departments);

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@publicvoice.rw',
      password: 'superadmin123',
      role: 'superadmin',
      isActive: true
    });

    // Create department admins
    const admins = [
      {
        name: 'Public Works Admin',
        email: 'works@publicvoice.rw',
        password: 'admin123',
        role: 'admin',
        department: 'public_works',
        isActive: true
      },
      {
        name: 'Water Utility Admin',
        email: 'water@publicvoice.rw',
        password: 'admin123',
        role: 'admin',
        department: 'water_utility',
        isActive: true
      }
    ];

    admins.forEach(async (admin) => {
      await User.create(admin);
    });
    

  
    return

    res.status(200).json({
      message: 'System initialized successfully',
      superAdmin: {
        email: superAdmin.email,
        password: 'superadmin123'
      }
    });
  } catch (error) {
    console.error('System initialization error:', error);
    return
    // res.status(500).json({ message: 'Server error during initialization' });
  }
};
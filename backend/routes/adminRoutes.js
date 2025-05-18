import express from 'express';
import { 
  createDepartment, 
  getDepartments,
  createAdmin,
  getAdmins,
  updateAdminStatus,
  getAdminStats,
  initializeSystem
} from '../controllers/adminController.js';
import { authenticateToken, isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public initialization route (should be disabled in production)
// router.get('/initialize', initializeSystem);

// Super Admin Routes
router.use(authenticateToken, isSuperAdmin);

router.post('/departments', createDepartment);
router.get('/departments', getDepartments);

router.post('/admins', createAdmin);
router.get('/admins', getAdmins);
router.patch('/admins/:id/status', updateAdminStatus);

router.get('/stats', getAdminStats);

export default router;
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// const adminController = require('./controllers/adminController');
import { initializeSystem } from './controllers/superAdminController.js';
import complaintRoutes from './routes/complaintsRoute.js';

import corsMiddleware from './config/cors.js';

// Load environment variables
dotenv.config();


// Connect to MongoDB
connectDB();


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/complaints', complaintRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

await initializeSystem();
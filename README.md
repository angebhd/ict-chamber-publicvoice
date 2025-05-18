# PublicVoice - Citizen Engagement Platform
### MVP for a Citizen Complaints and Engagement System 


A modern web platform that empowers citizens to voice their concerns and engage directly with government departments for efficient issue resolution and tracking.

## Features

### For Citizens
- Submit and track complaints
- Real-time status updates
- Direct communication with department officials
- Attachment support for evidence
- Public/private complaint visibility options

### For Department Admins
- Department-specific complaint management
- Status updates and priority management
- Direct citizen communication
- Analytics and performance tracking
- Response time monitoring

### For Super Admins
- Department management
- Admin user management
- System-wide analytics
- Configuration control
- Performance monitoring

## User Guide

### For Citizens

#### Submitting a Complaint
1. Log in to your account
2. Click "Submit Complaint" in the navigation menu
3. Fill out the complaint form:
   - Provide a clear title
   - Select the relevant category
   - Describe the issue in detail
   - Add your location
   - Upload supporting documents (optional)
   - Choose whether to make the complaint public
4. Submit the form

#### Tracking Your Complaints
1. Navigate to your dashboard
2. View all your complaints in the list
3. Click on any complaint to see:
   - Current status
   - Official responses
   - Timeline of actions
   - Department assignments
4. Add comments or provide additional information
5. Receive notifications on status changes

### For Department Admins

#### Managing Complaints
1. Access the admin dashboard
2. View complaints assigned to your department
3. Sort and filter by:
   - Status
   - Priority
   - Date
   - Category
4. Click on a complaint to:
   - Update status
   - Change priority
   - Add official responses
   - Request additional information
   - Mark as resolved

#### Performance Monitoring
- Track response times
- View department statistics
- Monitor citizen satisfaction
- Generate reports

### For Super Admins

#### Department Management
1. Access the super admin dashboard
2. Create new departments:
   - Set department name
   - Assign department code
   - Define responsibilities
3. Manage existing departments:
   - Update information
   - Activate/deactivate
   - Monitor performance

#### Admin User Management
1. Create department admins:
   - Set user details
   - Assign to departments
   - Set permissions
2. Monitor admin activities
3. Manage admin access

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Icons**: React Icons
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/angebhd/ict-chamber-publicvoice
   cd ict-chamber-publicvoice
   ```

2. Install dependencies:
   ```bash
   npm install-all
   ```

3. Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/public-voice
   JWT_SECRET=secretKey
   PORT=5000
   ```
4. Create a `.env` file in the frontend directory:
    ```env
   VITE_API_URL=http://localhost:5000/api
   ```



### Running the Application

Development mode with hot-reload:
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

## Default Users

After initialization, you can log in with these accounts:

### Super Admin
- Email: superadmin@publicvoice.rw
- Password: superadmin123

### Department Admin
- Email: works@publicvoice.rw
- Password: admin123

## Project Structure

```
public-voice/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   └── services/          # API services
├── server/                # Backend source code
│   ├── config/           # Server configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   └── routes/           # API routes
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new citizen
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - List complaints
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id` - Update complaint
- `POST /api/complaints/:id/comments` - Add comment

### Admin
- `POST /api/admin/departments` - Create department
- `GET /api/admin/complaints` - List complaints
- `GET /api/admin/complaints/:id` - Get complaint by ID
- `PUT /api/admin/complaints/:id` - Update complaint
- `PUT /api/admin/complaints/:id/assign'` - Assign complaint to department
- `GET /api/admin/department/complaints` - List complaints for department of the admin
- `GET /api/admin/complaints/:id/comments` - List comments by complaints
- `POST /api/admin//complaints/:id/comments` - Add  comment
- `GET /api/admin/dashboard/stats` - Get admin statistics

### Super admin
- `POST /api/superadmin/departments` - Create department
- `GET /api/superadmin/departments` - List departments
- `POST /api/superadmin/admins` - Create admin
- `GET /api/superadmin/admins` - List admins
- `PATCH /api/superadmin/admins/:id/status` - Update admin status
- `GET /api/superadmin/stats` - Get admin statistics

### Demo

- [Live Demo](https://publicvoice.netlify.app/)

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

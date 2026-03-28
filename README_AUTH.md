# IEEE Student Branch Website - Authentication System

A complete authentication system for the IEEE Student Branch website with separate admin and student roles.

## Features

### Student Features
- User registration and login
- View and register for events
- Download certificates after event completion
- Profile management (name, email, phone, department, year)
- Track registered events and attendance

### Admin Features
- Admin dashboard with statistics
- Create, edit, and delete events
- Upload certificates for students
- Manage users (view, update roles, delete)
- View event attendees

### Technical Features
- JWT-based authentication
- Role-based access control (Admin/Student)
- Protected routes
- MongoDB database
- RESTful API
- Form validation
- Error and success state handling
- Responsive design
- Dark mode support

## Tech Stack

### Frontend
- React 19.2.4
- Vite 8.0.3
- React Router DOM 7.13.2
- Tailwind CSS 3.4.19
- Framer Motion 12.38.0
- Axios for API calls
- Lucide React for icons

### Backend
- Express 5.2.1
- MongoDB with Mongoose 9.3.3
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/saheed-11/web2.git
cd web2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ieee-website
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ieee-website

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_secure_jwt_secret_here

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Admin Credentials (for initial admin setup)
ADMIN_EMAIL=admin@ieee.edu
ADMIN_PASSWORD=Admin@123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file for Vite (optional, uses default if not created):
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

### 4. Start MongoDB

If using local MongoDB:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu
sudo systemctl start mongod

# On Windows
# MongoDB should start automatically as a service
```

### 5. Create Initial Admin User

You can create an admin user in MongoDB or use the signup and then manually update the role:

Option 1: Using MongoDB Shell
```bash
mongo
use ieee-website
db.users.insertOne({
  name: "Admin",
  email: "admin@ieee.edu",
  password: "$2a$10$YourHashedPasswordHere", // Hash the password first
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Option 2: Sign up as student, then update role manually in MongoDB Compass or shell:
```bash
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### 6. Run the Application

Start both frontend and backend concurrently:
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/register` - Register for event (protected)
- `DELETE /api/events/:id/register` - Unregister from event (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get user by ID (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `POST /api/admin/events/:eventId/certificate/:userId` - Upload certificate (admin only)

## Project Structure

```
web2/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded files
│   └── server.js         # Entry point
├── src/                   # Frontend
│   ├── components/       # React components
│   │   ├── admin/       # Admin components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React context
│   │   └── AuthContext.jsx
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   │   ├── admin/      # Admin pages
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Profile.jsx
│   │   └── ...
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env.example          # Example environment variables
├── package.json
└── README.md
```

## Usage

### For Students
1. Sign up at `/signup`
2. Login at `/login`
3. Browse events at `/events`
4. Register for events (requires login)
5. View profile and registered events at `/profile`
6. Download certificates when available

### For Admins
1. Login at `/login` with admin credentials
2. Access admin dashboard at `/admin/dashboard`
3. Create, edit, or delete events
4. Upload certificates for students
5. Manage users and roles

## Security Features

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected API routes
- Role-based access control
- Input validation
- CORS configured
- Environment variables for sensitive data

## Development

```bash
# Run frontend only
npm run client

# Run backend only
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify network connection for MongoDB Atlas

### CORS Error
- Check FRONTEND_URL in backend `.env`
- Ensure both servers are running

### JWT Error
- Check JWT_SECRET is set in `.env`
- Clear browser local storage and re-login

### Port Already in Use
- Change PORT in `.env` (backend)
- Change port in `vite.config.js` (frontend)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

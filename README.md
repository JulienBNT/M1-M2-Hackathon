# M1-M2-Hackathon

# React + Vite

## Whispr - Social Media Application

Whispr is a full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to share posts, interact with others through likes, comments, and bookmarks, and receive real-time notifications.

### Trello

https://trello.com/invite/b/67ceb79501a9b5bea8f391a7/ATTI81c008bf6f68d9bdd85265cb788f4a20FA8BC35E/api

### Tech Stack

#### Backend
- Node.js with Express.js - Server framework
- MongoDB - Database (using MongoDB Compass)
- JWT - Authentication
- Socket.io - Real-time notifications
- Multer - File uploads

#### Frontend
- React 19 (built with Vite)
- React Router v7 - Navigation
- Tailwind CSS - Styling
- Socket.io Client - Real-time communication
- Axios - HTTP requests
- date-fns - Date formatting

### Project Structure

whispr/
├── backend/              # Node.js Express server
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── public/           # Static files
│   └── server.js         # Server entry point
│
└── frontend/             # React Vite application
    ├── public/           # Static assets
    └── src/
        ├── assets/       # Images and resources
        ├── components/   # React components
        │   ├── common/   # Shared components
        │   ├── contexts/ # React contexts
        │   ├── hooks/    # Custom hooks
        │   ├── layout/   # Layout components
        │   ├── pages/    # Page components
        │   ├── post/     # Post-related components
        │   └── utils/    # Utility functions
        ├── App.jsx       # Main App component
        └── main.jsx      # Entry point

### Installation

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas URI)

#### Setup
1. Clone the repository

git clone https://github.com/yourusername/whispr.git
cd whispr

2. Install backend dependencies

cd backend
npm install

3. Install frontend dependencies

cd ../frontend
npm install

4. Set up environment variables
    - Backend: Create .env file in the backend folder

JWT_SECRET=yourjwtsecret
JWT_EXPIRES_IN=1d
MONGODB_URI=your_mongodb_connection_string

    - Frontend: Create .env file in the frontend folder

VITE_API_URL=http://localhost:8080/

### Running the Application

#### Backend

cd backend
npm start  # Uses nodemon for development

The server will run on http://localhost:8080

#### Frontend

cd frontend
npm run dev

The application will be available at http://localhost:5173

### Features


#### User Authentication
- Register/Login
- JWT-based authentication
- Profile management

#### Posts
Currently,
- Create, read, update, delete posts
- Add hashtags
- View posts feed

#### Social Interactions
- Like/unlike posts
- Bookmark posts
- Comment on posts
- Reply to comments

#### Real-time Notifications
- Receive notifications when someone likes or bookmarks your posts
- WebSocket-based real-time updates

#### Profile Management
- Update profile information
- Upload profile pictures
- View personal posts
- View saved/bookmarked posts

### API Endpoints

#### Authentication
- POST /user/register - Register a new user
- POST /user/login - Login
- GET /user/verify - Verify JWT token

#### User Profile
- GET /user/me - Get current user profile
- PUT /user/me - Update user profile
- PUT /user/me/password - Update password
- DELETE /user/me - Delete account

#### Posts
- GET /posts - Get all posts
- POST /posts - Create a new post
- GET /posts/:id - Get a specific post
- PUT /posts/:id - Update a post
- DELETE /posts/:id - Delete a post
- GET /posts/get-all-posts/:userId - Get all posts by a user

#### Interactions
- POST /likes - Like a post
- DELETE /likes - Unlike a post
- POST /bookmarks/:postId - Bookmark a post
- DELETE /bookmarks/:postId - Remove a bookmark
- POST /comments - Add a comment
- GET /comments - Get all comments

### WebSocket Events
- register - Register a client for notifications
- notification - Receive real-time notifications

### Contributors
- Your Name
- Other Contributors

### License
This project is licensed under the MIT License - see the LICENSE file for details. two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

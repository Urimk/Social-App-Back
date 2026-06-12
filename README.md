# Real-Time Chat Application (Backend)

A robust, secure, and scalable Node.js server that powers the Real-Time Chat Application. It provides RESTful APIs for user authentication and data management, alongside real-time WebSocket communication for instant messaging.

[Live API URL](https://social-app-back-2bsl.onrender.com) | [Frontend Repository](https://github.com/Urimk/Social-App-Front)

##  Key Features

* **Real-Time Engine:** Built with `socket.io` utilizing private rooms (`io.to(userId)`) to ensure targeted and efficient message delivery.
* **Authentication & Security:** Secure user registration and login flows using **JSON Web Tokens (JWT)** for session management and **Bcrypt.js** for password hashing.
* **Cloud Media Storage:** Integrated **Cloudinary** via **Multer** for secure, efficient, and persistent storage of user profile images, ensuring fast delivery and zero data loss on server restarts.
* **Database Integration:** Seamlessly connected to **MongoDB Atlas** using Mongoose ODM for structured, schema-based data modeling.
* **Protected Routes:** Custom Express middleware to verify JWTs and protect sensitive user endpoints.
* **CORS Configured:** Safely configured to communicate strictly with the authorized frontend origin.

##  Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas & Mongoose
* **WebSockets:** Socket.io
* **Security & Utilities:** JWT, bcryptjs, cors, dotenv, multer, cloudinary
* 
##  Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000 # Change this to your Vercel URL in production

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
🚀 Run Locally
1. Clone the project:
```bash
git clone [https://github.com/Urimk/Social-App-Back](https://github.com/Urimk/Social-App-Back)
```
2. Navigate to the directory and install dependencies:
```bash
cd your-backend-repo-name
npm install
```
3. Start the development server:

```bash
npm run dev
```
📡 API Reference (Core Endpoints)
Authentication:
* GET /api/auth/check - Check server status
* POST /api/auth/login - Authenticate user and return JWT

Users:
* POST /api/users/register - Create a new User
* POST /api/users/:display/request - Send friend request to a user (Protected)
* GET /api/users/requests - Get all of the friend request to the user (Protected)
* DELETE /api/users/:display/request - Delete a friend request to a user (Protected)
* DELETE /api/users/ - Delete user account and associated data (Protected)

Profile Images:
* GET /api/image/ - Retrieve the user's current profile picture (Protected)
* POST /api/image/ - Upload a new profile picture
* PATCH /api/image/ - Update/Change the existing profile picture (Protected)

Chats & Messages:
* GET /api/chat/ - Get all active chats for the authenticated user (Protected)
* POST /api/chat/:display/acceptRequest - Accept a friend request and initialize a new chat room (Protected)
* GET /api/chat/:id/messages - Retrieve the message history for a specific chat (Protected)
* POST /api/chat/:id/message - Send a new message to a specific chat (Protected)
* GET /api/chat/:id/lastMessage - Fetch the most recent message of a specific chat (Protected)



🗺️ Roadmap (Upcoming Features)
[Add future backend features here]
---

Created by Uri Knoll

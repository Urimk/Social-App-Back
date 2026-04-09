# Real-Time Chat Application (Backend) ⚙️

A robust, secure, and scalable Node.js server that powers the Real-Time Chat Application. It provides RESTful APIs for user authentication and data management, alongside real-time WebSocket communication for instant messaging.

[Live API URL](#) | [Frontend Repository](#)

## ✨ Key Features

* **Real-Time Engine:** Built with `socket.io` utilizing private rooms (`io.to(userId)`) to ensure targeted and efficient message delivery.
* **Authentication & Security:** Secure user registration and login flows using **JSON Web Tokens (JWT)** for session management and **Bcrypt.js** for password hashing.
* **Cloud Media Storage:** Integrated **Cloudinary** via **Multer** for secure, efficient, and persistent storage of user profile images, ensuring fast delivery and zero data loss on server restarts.
* **Database Integration:** Seamlessly connected to **MongoDB Atlas** using Mongoose ODM for structured, schema-based data modeling.
* **Protected Routes:** Custom Express middleware to verify JWTs and protect sensitive user endpoints.
* **CORS Configured:** Safely configured to communicate strictly with the authorized frontend origin.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas & Mongoose
* **WebSockets:** Socket.io
* **Security & Utilities:** JWT, bcryptjs, cors, dotenv, multer, cloudinary
* 
## ⚙️ Environment Variables

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
git clone [https://github.com/Urimk/your-backend-repo-name.git](https://github.com/Urimk/your-backend-repo-name.git)
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
* POST /api/auth/register - Create a new user account
* POST /api/auth/login - Authenticate user and return JWT

Users:
* GET /api/users - Search for friends/users (Protected)
* PUT /api/users/profile - Update display name or avatar (Protected)
* DELETE /api/users/me - Delete user account and associated data (Protected)

Chat & Messages:
* POST /api/messages - Save a new message to the database (Protected)
* GET /api/messages/:chatId - Retrieve conversation history (Protected)

🗺️ Roadmap (Upcoming Features)
[Add future backend features here, e.g., image upload to Cloudinary/S3, message encryption, group chats]

Created by Uri Knoll

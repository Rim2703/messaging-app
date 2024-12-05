# Branch Messaging App

A scalable messaging web application designed to handle high volumes of customer inquiries. This app enables a team of agents to efficiently respond to messages and manage customer service workflows.

## Features
- Real-time updates for incoming customer queries.
- Agents can view customer messages, respond to them.
- Simple user interface for message management using React.
- RESTful API for seamless communication with the database.
- MongoDB as the database for storing customer messages.
- Scalable backend using Node.js and Express.js.

---

## Technologies Used

### **Frontend**
- **React**: For building the user interface.
- **Axios**: For making API requests.

### **Backend**
- **Node.js**: JavaScript runtime for server-side code.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database for storing customer messages.
- **Mongoose**: ODM for MongoDB integration.

---

## Setup and Installation

### **Backend Setup**
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start MongoDB (if not running):
   ```bash
   mongod
   ```
4. Import the sample data (CSV file) into MongoDB:
  
5. Run the backend server:
   ```bash
   node server.js
   ```
   The server will run at `http://localhost:8080`.

### **3. Frontend Setup**
1. Navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The app will run at `http://localhost:3000`.

---

## Usage
1. Start the backend and frontend servers.
2. Open the application in your browser at `http://localhost:3000`.
3. Agents can:
   - View all incoming messages.
   - Filter messages by status.
   - Respond to messages and mark them as resolved.

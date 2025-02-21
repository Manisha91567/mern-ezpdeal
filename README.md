# MERN EZPDeal (PostgreSQL Edition)

MERN EZPDeal is a full-stack application using React, Node.js, Express, and PostgreSQL, featuring secure session management with Redis, OTP-based authentication via Twilio, role-based access control, and production-grade security, with Axios for API integration, Redux Toolkit for state management, and React Router for navigation.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)

## Features

- **Full-Stack Application:**  
  Built with React (frontend) and Node.js/Express (backend).

- **PostgreSQL Database:**  
  Uses PostgreSQL for structured data storage.

- **Session & OTP Management:**  
  Implements Redis for session storage and OTP caching with expiration.

- **SMS Verification:**  
  Integrated with Twilio to send OTPs (with a mock option for development/testing).

- **Security Best Practices:**  
  - Sensitive credentials are managed with environment variables.
  - Rate limiting on OTP endpoints prevents abuse.
  - Cookies are secured with `httpOnly` and `secure` flags in production.

## Project Structure

mern-ezpdeal/ 
        ├── backend/ # Express backend code 
            │ 
            ├── controllers/ # Business logic and controllers 
            │
            ├── middlwares/  # Verify token middlware
            │ 
            ├── routes/ # API route definitions 
            │  
            ├── services/ # services functions (e.g. otp creation/verification)
            │    
            ├── utility/ # Utility functions (e.g., redisClient) 
            │ 
            ├── config/ # Configuration files (database, etc.) 
            │ 
            ├── .env.example # Example environment configuration file 
            │ 
            ├── package.json # Backend dependencies and scripts 
            │ 
            └── README.md # Backend-specific documentation (if needed) 
        ├── frontend/ # React frontend code 
            │ 
            ├── public/ # Static assets 
            │ 
            ├── src/ # React components and services 
                │    
                ├── features # authslice
                │
                └── pages 
            ├── package.json # Frontend dependencies and scripts 
            │ 
            └── README.md # Frontend-specific documentation (if needed) 
        ├── .gitignore # Git ignore rules 
        └── README.md # Project documentation (this file)


## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js (v14 or above)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (local or hosted, e.g., via Heroku)
- Redis server (local or hosted)
- [Twilio Account](https://www.twilio.com/) for sending SMS (or use a mock SMS service for development)

## Installation

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/mern-ezpdeal.git
   cd mern-ezpdeal/backend

2. **Install Dependencies**

   npm install

3. **Add .env file**
   
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your_session_secret
   DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password  
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+919999999999

4. **Database Setup**

   Ensure PostgreSQL is running.
   Create a database (if not already created) using your PostgreSQL client or command line.
   If using an ORM like Sequelize or node-postgres, follow their setup instructions to connect to your database using the DATABASE_URL provided.

5. **Run Database Migrations (if applicable)**

   If your project uses migrations, run:
   
   npm run migrate

6. **Setting Up Redis with Docker**
   Running Redis with Docker :
       Run the following command to start a Redis container:
       
       docker run --name redis-container -p 6379:6379 -d redis
       
       This will:
       
       Pull the latest Redis image (if not already available).
       Run a Redis container named redis-container.
       Expose Redis on port 6379.
   
   Connecting Redis in Node.js :
       Ensure you have Redis installed in your backend project:
       
       npm install ioredis
   
   Verify Redis is Running :
       Run the following command inside the running Redis container:
       
       docker exec -it redis-container redis-cli ping
       Expected output:
       
       PONG

   To get otp in Redis :
       Run the following command inside the running Redis container:
       GET otp:phone-number


### Frontend Setup

1. **Navigate to the Frontend Directory**
    
   cd mern-ezpdeal/backend

2. **Install Dependencies**

   npm install


## Running the Project

### Development Mode
   Backend:
   Use 'npm run dev' (or nodemon for auto-reload) in the backend directory.
   
   Frontend:
   Run 'npm start' in the frontend directory to launch the React development server.

### Production Build
 
1.  **Build the Frontend**
    
    From the frontend directory, run:
    
    npm run build
    This will generate a production-ready build in the build/ folder.
    
2. **Serve the Frontend**
    
    You can serve the static build files using the backend server. For example, in your Express server:
    
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
    
3. **Start the Production Server**
    
    Ensure NODE_ENV is set to production and start your backend server.

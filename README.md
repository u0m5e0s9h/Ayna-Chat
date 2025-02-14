# Ayna Chat Application

A real-time chat application built with React, TypeScript, and Strapi, featuring WebSocket communication and JWT authentication.

## 🚀 Technologies Used

- **Frontend:**
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Zustand for state management
  - Lucide React for icons
  - Socket.IO client for real-time communication
  - @strapi/client for API communication

- **Backend:**
  - Strapi v4 Headless CMS
  - SQLite database (default)
  - Socket.IO for WebSocket communication
  - Built-in JWT authentication
  - Built-in user management

## 🏗️ Strapi Setup

1. Create a new Strapi project:
```bash
npx create-strapi-app@latest ayna-chat-backend --quickstart
```

2. Create Content Types:

   **Session:**
   - Fields:
     - user (Relation with User, one-to-many)
     - messages (Relation with Message, one-to-many)
     - createdAt (DateTime)

   **Message:**
   - Fields:
     - content (Text, required)
     - session (Relation with Session, many-to-one)
     - user (Relation with User, many-to-one)
     - createdAt (DateTime)

3. Configure Permissions:
   - Go to Settings → Users & Permissions → Roles
   - Configure Authenticated role:
     - Session: find, findOne, create
     - Message: find, create
     - User: me

4. Install Socket.IO plugin:
```bash
cd ayna-chat-backend
npm install socket.io
```

5. Create WebSocket middleware (config/middlewares/socket.js):
```javascript


## 🚀 Running the Project

1. **Start Strapi Backend:**
```bash
cd server
npm run dev
```

2. **Start Frontend:**
```bash
cd src
npm install
npm run dev
```

3. **Access the Application:**
   - Frontend: http://localhost:5173
   - Strapi Admin: http://localhost:1337/admin

## 🔒 Security Features

1. **Authentication:**
   - Built-in Strapi authentication
   - JWT tokens for session management
   - Secure password hashing

2. **API Security:**
   - Role-based access control
   - API token authentication
   - CORS configuration

3. **WebSocket Security:**
   - JWT authentication for socket connections
   - Message validation
   - Error handling

## 📱 Responsive Design

The application is fully responsive using Tailwind CSS:
- Flexible layouts
- Mobile-first approach
- Adaptive UI components

## 🔄 State Management

Uses Zustand for state management:
- User authentication state
- Chat sessions
- Real-time messages
- WebSocket connection

## 🔍 Future Improvements

1. **Features:**
   - File attachments
   - User profiles
   - Message reactions
   - Read receipts

2. **Technical:**
   - WebSocket reconnection
   - Offline support
   - Message encryption
   - Performance optimization

## 📄 License

MIT License
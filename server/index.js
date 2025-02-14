import express from 'express';
import { WebSocketServer } from 'ws';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const wss = new WebSocketServer({ port: 8081 });
const PORT = 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'e7b99f2739e13e21a5c85cbd764f4f3a7e2c8dffecbc1135d39c9b7816a9a786';

// MongoDB setup
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://surya:merndemo1@mernapp.v2wxp.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp';
let db;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongo();

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);
    const token = jwt.sign({ id: result.insertedId }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: result.insertedId,
        email,
        username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Sessions routes
app.get('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await db.collection('sessions')
      .find({ userId: req.user.id })
      .toArray();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sessions' });
  }
});

app.post('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const session = {
      ...req.body,
      userId: req.user.id,
    };
    await db.collection('sessions').insertOne(session);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error creating session' });
  }
});

// Messages routes
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const message = {
      ...req.body,
      userId: req.user.id,
    };
    await db.collection('messages').insertOne(message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error saving message' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      // Echo the message back with server as sender
      const response = {
        ...message,
        id: crypto.randomUUID(),
        sender: 'server',
        timestamp: Date.now(),
      };
      
      ws.send(JSON.stringify(response));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
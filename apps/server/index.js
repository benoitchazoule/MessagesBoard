require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();

// Environment variables
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'messagesboard';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const JSON_LIMIT = process.env.JSON_LIMIT || '10mb';

// Middleware
const corsOptions = {
  origin: CORS_ORIGIN,
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
  credentials: true,
  enablePreflight: true
};
app.use(cors());
//app.options('*', cors(corsOptions));
app.use(express.json({ limit: JSON_LIMIT }));

console.log(`CORS_ORIGIN is set to: ${CORS_ORIGIN}`);
console.log(`JSON_LIMIT is set to: ${JSON_LIMIT}`);

let messagesCollection;

// MongoDB Atlas connection with options
const client = new MongoClient(MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connect to MongoDB Atlas
    await client.connect();
    
    // Verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas!");
    
    // Set up database and collection
    const db = client.db(DB_NAME);
    messagesCollection = db.collection('messages');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Connected to database: ${DB_NAME}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
    process.exit(1);
  }
}

// Connect to database
connectToDatabase();

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

app.post('/messages', async (req, res) => {
  const { recipient, sender, content, image } = req.body;
  if (!recipient || !content) {
    return res.status(400).json({ error: 'Recipient and content are required.' });
  }
  try {
    const result = await messagesCollection.insertOne({
      recipient,
      sender,
      content,
      image,
      created_at: new Date()
    });
    res.json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/messages/:recipient', async (req, res) => {
  const { recipient } = req.params;
  try {
    const messages = await messagesCollection
      .find({ recipient })
      .sort({ created_at: -1 })
      .toArray();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: messagesCollection ? 'connected' : 'disconnected' 
  });
});
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import './config/database.js'; // Initialize Drizzle / in-memory store
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-hub-signature-256', 'x-bypass-signature-for-demo'],
  })
);

// Express body parser with rawBody capture for Meta WhatsApp HMAC signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString('utf-8');
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded documents and blackboard snaps
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve compiled React frontend if built
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Mount API v1 router
app.use('/api/v1', apiRoutes);

// Welcome Root route & SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({
        name: 'SchoolOS Enterprise Core Gateway',
        version: '2.0.0',
        documentation: '/api/v1/health',
        agent_matrix: '/api/v1/agents/matrix',
        knowledge_graph: '/api/v1/ontology/graph',
        status: 'ONLINE',
      });
    }
  });
});

// Centralized error pipeline
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SchoolOS Enterprise Operating System Core Active`);
  console.log(`🌐 Server Port: ${config.port}`);
  console.log(`📡 Meta WhatsApp Webhook: /api/v1/admissions/whatsapp-webhook`);
  console.log(`💳 Razorpay Route Fee Split: /api/v1/finance/process-fee-split`);
  console.log(`🤖 Autonomous Agent Matrix: /api/v1/agents/matrix`);
  console.log(`=======================================================`);
});

export default app;

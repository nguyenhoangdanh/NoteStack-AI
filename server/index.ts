import express from 'express';
import cors from 'cors';
import path from 'path';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../spa')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../spa/index.html'));
    });
  }

  return app;
}

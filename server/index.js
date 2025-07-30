require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Fallback environment variables for development
if (!process.env.PORT) process.env.PORT = '5000';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'development_jwt_secret_key_change_in_production';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_ANON_KEY) process.env.SUPABASE_ANON_KEY = 'placeholder_anon_key';

// Debug environment variables
console.log('Environment variables loaded:');
console.log('- PORT:', process.env.PORT);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Import routes and middleware
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const gameRoutes = require('./routes/game');
const classRoutes = require('./routes/class');
const curriculumRoutes = require('./routes/curriculum');
const reportRoutes = require('./routes/reports');
const evaluationRoutes = require('./routes/evaluation');
const oaRoutes = require('./routes/oa');
const questionBankRoutes = require('./routes/questionBank');
const notificationRoutes = require('./routes/notifications'); // New import
const labRoutes = require('./routes/lab'); // Importar rutas de laboratorio
const { authenticateToken } = require('./middleware/auth');
const { rateLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const { initializeDatabase } = require('./database/init');
const { setupLocalDevelopment } = require('./database/local-config');
const gameSocketHandler = require('./sockets/gameHandler');
const JobScheduler = require('./jobs/scheduler');
const { mockGameData } = require('./services/mockGameData');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      "http://localhost:3000",
      "https://plataforma-edu21-grlcir15d-lukasbustosfs-projects.vercel.app",
      "https://plataforma-edu21.vercel.app",
      "https://*.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    "http://localhost:3000",
    "https://plataforma-edu21-grlcir15d-lukasbustosfs-projects.vercel.app",
    "https://plataforma-edu21.vercel.app",
    "https://*.vercel.app"
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', authenticateToken, quizRoutes);
app.use('/api/game', authenticateToken, gameRoutes);
app.use('/api/class', authenticateToken, classRoutes);
app.use('/api/curriculum', authenticateToken, curriculumRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/evaluation', authenticateToken, evaluationRoutes);
app.use('/api/oa', authenticateToken, oaRoutes);
app.use('/api/question-bank', authenticateToken, questionBankRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes); // New route
app.use('/api/lab', labRoutes); // Registrar rutas de laboratorio
app.use('/api/demo', authenticateToken, require('./routes/demo'));
app.use('/api/skins', require('./routes/skins'));
app.use('/api/security', require('./routes/security'));
app.use('/api/my-evaluations', authenticateToken, require('./routes/myEvaluations'));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  // Handle game-related socket events
  gameSocketHandler(socket, io);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404
    }
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize database tables
    await initializeDatabase();
    
    // Check if we're in mock mode
    const hasRealDatabase = process.env.SUPABASE_URL && 
                           process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (hasRealDatabase) {
      logger.info('Database initialized successfully');
      
      // Initialize job scheduler for auto-grading
      JobScheduler.init();
    } else {
      logger.info('Server started in mock database mode');
      
      // Configurar desarrollo local automáticamente
      const localData = setupLocalDevelopment();
      if (localData) {
        logger.info('🎮 Datos demo cargados automáticamente para desarrollo');
        logger.info(`📚 ${localData.games.length} juegos demo disponibles (DEMO001-DEMO024)`);
        logger.info(`👥 ${localData.users.length} usuarios demo disponibles`);
        logger.info('🔐 Credenciales demo: teacher@demo.edu21.cl / demo123');
        
        // Sincronizar datos demo con MockGameDataService
        mockGameData.syncWithLocalDemoData();
      }
      
      // Log mock game data status
      mockGameData.logStatus();
    }
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`EDU21 Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

startServer(); 

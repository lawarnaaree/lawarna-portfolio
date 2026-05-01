import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { globalLimiter } from './middlewares/rateLimiter.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import lifestyleRoutes from './routes/lifestyleRoutes.js';
import generalRoutes from './routes/generalRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

// Serve Static Files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Lawarna Portfolio API is running' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
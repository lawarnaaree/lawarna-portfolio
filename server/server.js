import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import lifestyleRoutes from './routes/lifestyleRoutes.js';
import generalRoutes from './routes/generalRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/general', generalRoutes);

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
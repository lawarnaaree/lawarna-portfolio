import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

// Starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
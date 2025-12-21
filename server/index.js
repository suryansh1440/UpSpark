import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/auth.route.js';
import startupRoutes from './routes/startup.routes.js';
import adminRoutes from './routes/admin.routes.js';
import investorRoutes from './routes/investor.routes.js';
import fundingRoutes from './routes/funding.routes.js';
import userRoutes from './routes/user.routes.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/auth',authRoutes);
// serve uploaded assets
app.use('/uploads', express.static('uploads'));

// startup and admin routes
app.use('/api/startups', startupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.send('Express server is running');
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });


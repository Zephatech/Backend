import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/authMiddleware';
import authRoutes from './routes/auth';
import myDataSource from "./config/dataSource";

const app = express();

// establish connection to database
// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  exposedHeaders: 'set-cookie',
  credentials: true,
  origin: 'http://localhost:3000',
}));

// Error handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err); // store error event to some lg file
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Routes
app.use('/auth', authRoutes);
// app.use('')

// Temporary routes
app.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'Profile Page' });
});
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
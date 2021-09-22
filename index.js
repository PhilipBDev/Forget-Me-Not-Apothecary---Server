const express = require('express');
const connectDB = require('./config/db');
const productRouter = require('./routers/productRouter');
const userRouter = require('./routers/userRouter');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// .env Access
dotenv.config();

// DB Access
connectDB();

// Express Setup
const app = express();
app.use(express.json());

// Cors + Cookie Parser
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://forget-me-not-apothecary.netlify.app/',
    ],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
    maxAge: 600,
  })
);

app.use(cookieParser());

// Port Access
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Router Setup
app.use('/api/products', productRouter);
app.use('/auth', userRouter);

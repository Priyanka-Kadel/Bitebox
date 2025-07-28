require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const connectDb = require("./config/db");
const AuthRouter = require("./routes/authRoutes");
const MobileRouter = require("./routes/mobileRoutes");
const protectedRouter = require("./routes/protectedRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const emailRoutes = require('./routes/emailRoutes');
const contactRoutes = require('./routes/contactRoutes');
const esewaRoutes = require('./routes/esewaRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();

connectDb();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(cors({
  origin: 'https://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Route handling
app.use("/api/auth", AuthRouter);
app.use("/api/v1/", MobileRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/recipes", recipeRoutes);
app.use("/api/user", userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', wishlistRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', contactRoutes);
app.use('/api/esewa', esewaRoutes);
app.use('/api/orders', orderRoutes);
app.use("/uploads", express.static("uploads"));

// Load HTTPS credentials
const sslOptions = {
  key: fs.readFileSync(path.join("./ssl/localhost-key.pem")),
  cert: fs.readFileSync(path.join("./ssl/localhost-cert.crt")),
};

// Start HTTPS server
const port = 3000; 
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS server running at https://localhost:${port}`);
});
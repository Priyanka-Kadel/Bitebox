const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const connectDb = require("./config/db");
// const AuthRouter = require("./routes/authRoutes");
// const MobileRouter = require("./routes/mobileRoutes");
// const protectedRouter = require("./routes/protectedRoutes");
// const recipeRoutes = require("./routes/recipeRoutes"); 
// const userRoutes = require("./routes/userRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const emailRoutes = require('./routes/emailRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const esewaRoutes = require('./routes/esewaRoutes');
// require('dotenv').config();

// const app = express();

// connectDb();

// app.use(cors({
//   origin: 'https://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.use(express.json());

// // Route handling
// app.use("/api/auth", AuthRouter);
// app.use("/api/v1/", MobileRouter);
// app.use("/api/protected", protectedRouter);
// app.use("/api/recipes", recipeRoutes);  // Updated route path
// app.use("/api/user", userRoutes);
// app.use('/api/cart', cartRoutes); // New cart routes
// app.use('/api', wishlistRoutes);
// app.use('/api/email', emailRoutes);
// app.use('/api', contactRoutes);
// app.use('/api/esewa', esewaRoutes);
// app.use("/uploads", express.static("uploads"));

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running at https://localhost:${port}`);
// });







// const express = require("express");
// const cors = require("cors");
// const https = require("https");
// const fs = require("fs");
// const connectDb = require("./config/db");
// const AuthRouter = require("./routes/authRoutes");
// const MobileRouter = require("./routes/mobileRoutes");
// const protectedRouter = require("./routes/protectedRoutes");
// const recipeRoutes = require("./routes/recipeRoutes");
// const userRoutes = require("./routes/userRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const emailRoutes = require('./routes/emailRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const esewaRoutes = require('./routes/esewaRoutes');
// require('dotenv').config();

// const app = express();

// connectDb();

// app.use(cors({
//   origin: 'https://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.use(express.json());

// // Route handling
// app.use("/api/auth", AuthRouter);
// app.use("/api/v1/", MobileRouter);
// app.use("/api/protected", protectedRouter);
// app.use("/api/recipes", recipeRoutes);
// app.use("/api/user", userRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api', wishlistRoutes);
// app.use('/api/email', emailRoutes);
// app.use('/api', contactRoutes);
// app.use('/api/esewa', esewaRoutes);
// app.use("/uploads", express.static("uploads"));

// // HTTPS options
// const httpsOptions = {
//   key: fs.readFileSync("C:/Users/kadel/Desktop/Bitebox/backend-Bitebox/localhost-key.pem"),
//   cert: fs.readFileSync("C:/Users/kadel/Desktop/Bitebox/backend-Bitebox/localhost-cert.pem"),
// };

// const port = 3000;

// https.createServer(httpsOptions, app).listen(port, () => {
//   console.log(`HTTPS Server running at https://localhost:${port}`);
// });




const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
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
require('dotenv').config();

const app = express();

connectDb();

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
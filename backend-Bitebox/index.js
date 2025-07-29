require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDb = require("./config/db");

const AuthRouter = require("./routes/authRoutes");
const MobileRouter = require("./routes/mobileRoutes");
const protectedRouter = require("./routes/protectedRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const emailRoutes = require("./routes/emailRoutes");
const contactRoutes = require("./routes/contactRoutes");
const esewaRoutes = require("./routes/esewaRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


connectDb();


app.use(helmet());

// Sanitize inputs
app.use(xss());
app.use(mongoSanitize());

// Express JSON parser
app.use(express.json());

// CORS setup
app.use(
  cors({
    origin: "https://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.set("trust proxy", 1); 

app.use(
  session({
    name: 'bitebox_session',
    secret: process.env.SESSION_SECRET || 'yourSuperSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 60 * 60, 
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    }
  })
);


app.use("/api/auth", AuthRouter);
app.use("/api/v1", MobileRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/recipes", recipeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", wishlistRoutes);
app.use("/api/email", emailRoutes);
app.use("/api", contactRoutes);
app.use("/api/esewa", esewaRoutes);
app.use("/api/orders", orderRoutes);


app.use("/uploads", express.static("uploads"));


const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "localhost-cert.crt")),
};

const port = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS server running at https://localhost:${port}`);
});

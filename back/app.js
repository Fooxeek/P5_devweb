const express = require("express");
const path = require("path");
const cors = require("cors");

const productRoutes = require("./routes/product");

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://kanap.loganben.com",
  "http://seckanap.loganben.com:5500",
]; // Add other allowed origins as needed

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the list of allowed origins
      if (!allowedOrigins.includes(origin)) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Handle OPTIONS requests for preflight
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
    res.end();
  } else {
    next();
  }
});

// Static directories
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static("images"));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API routes
app.use("/api/products", productRoutes);

// Export the app
module.exports = app;

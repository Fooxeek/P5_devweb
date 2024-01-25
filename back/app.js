const express = require("express");
const path = require("path");

const productRoutes = require("./routes/product");

const app = express();

app.use((req, res, next) => {
  // Define a list of origins you want to allow
  const allowedOrigins = ["https://kanap.loganben.com"];
  const origin = req.headers.origin;

  // Check if the origin is in your allowedOrigins list
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true); // Allow credentials
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static("images"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRoutes);

module.exports = app;

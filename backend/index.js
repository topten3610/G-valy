const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const connectDB = require('./config/db')
const router = require('./routes');

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure methods include OPTIONS
  })

);

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", router);
app.get("/test", (req, res) => {
  res.send("Server is running 🟢");
});


const PORT = process.env.PORT || 8080;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("connect to DB successfully");
    console.log("Server is running " + PORT);
  });
});


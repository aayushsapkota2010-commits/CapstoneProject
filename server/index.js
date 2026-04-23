require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const pollRoutes = require("./routes/poll");

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/poll", pollRoutes);

function logMongoConnectionHelp(error) {
  if (!error) {
    return;
  }

  if (error.code === "ECONNREFUSED" && String(error.hostname || "").includes("_mongodb._tcp")) {
    console.error("\nMongoDB Atlas SRV lookup failed.");
    console.error("Your network or DNS resolver is blocking the `mongodb+srv://` lookup.");
    console.error("Fix options:");
    console.error("1. Try another network or disable any VPN / DNS filter.");
    console.error("2. Change `MONGO_URI` from `mongodb+srv://...` to the standard `mongodb://...` Atlas connection string.");
    console.error("3. Use a local MongoDB instance for development.");
    console.error("");
  }
}

async function startServer() {
  if (!mongoUri) {
    console.error("Missing MONGO_URI in server/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error);
    logMongoConnectionHelp(error);
    process.exit(1);
  }
}

app.get("/test-db", async (req, res) => {
  try {
    const User = require("./models/User");

    const user = new User({
      name: "TestUser",
      email: "testcheck@gmail.com",
      password: "1234",
      role: "student"
    });

    await user.save();

    res.send("✅ DB SAVE WORKED");
  } catch (err) {
    console.log("❌ DB TEST ERROR:", err);
    res.send("❌ DB SAVE FAILED: " + err.message);
  }
});

startServer();

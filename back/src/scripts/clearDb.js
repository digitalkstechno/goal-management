const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/User");
const Goal = require("../models/Goal");
const Action = require("../models/Action");
const Task = require("../models/Task");

const clearDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("Error: MONGO_URI environment variable is not set");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected for clearing...");

    await User.deleteMany({});
    await Goal.deleteMany({});
    await Action.deleteMany({});
    await Task.deleteMany({});

    console.log("✅ Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();

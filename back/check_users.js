const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/User");

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({}).select("+password");
    console.log(`Found ${users.length} users.`);

    users.forEach((u) => {
      console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkUsers();

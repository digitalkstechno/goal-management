const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/User");
const Staff = require("./src/models/Staff");
const bcrypt = require("bcryptjs");

async function debugLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "staff@test.com";
    const password = "123456";

    console.log(`Debug Login for: ${email}`);

    let user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    let userType = "user";

    if (!user) {
      console.log(`Not found in User, checking Staff...`);
      user = await Staff.findOne({ email: email.toLowerCase() }).select("+password");
      userType = "staff";
    }

    if (!user) {
      console.log(`User NOT found in both collections`);
      process.exit(1);
    }

    console.log(`Found ${userType}: ${user.email}. Role: ${user.role}`);
    
    const isMatch = await user.comparePassword(password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log("Password mismatch!");
    } else {
      console.log("Password match!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

debugLogin();

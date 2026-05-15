const mongoose = require("mongoose");
require("dotenv").config();
const Staff = require("./src/models/Staff");

async function checkStaff() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const staff = await Staff.find({}).select("+password");
    console.log(`Found ${staff.length} staff members.`);

    staff.forEach((s) => {
      const isHashed = s.password && (s.password.startsWith("$2a$") || s.password.startsWith("$2b$"));
      console.log(`Name: ${s.name}, Email: ${s.email}, Password Hashed: ${isHashed}, Role: ${s.role}`);
      if (!isHashed) {
        console.log(`WARNING: Password for ${s.email} is NOT hashed! Value: ${s.password}`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkStaff();

const mongoose = require("mongoose");
require("dotenv").config();
const Staff = require("./src/models/Staff");

async function updateStaffPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "staff@test.com";
    const staff = await Staff.findOne({ email });
    if (!staff) {
      console.log(`Staff ${email} not found.`);
      process.exit(1);
    }

    staff.password = "123456";
    await staff.save();
    console.log(`Updated password for ${email} to "123456"`);

    // Verify it works with the model method
    const staff2 = await Staff.findOne({ email }).select("+password");
    const isMatch = await staff2.comparePassword("123456");
    console.log(`Verification with model method: ${isMatch}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateStaffPassword();

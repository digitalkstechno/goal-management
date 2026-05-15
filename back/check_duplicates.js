const mongoose = require("mongoose");
require("dotenv").config();
const Staff = require("./src/models/Staff");

async function checkDuplicates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const duplicates = await Staff.aggregate([
      {
        $group: {
          _id: "$email",
          count: { $sum: 1 },
          ids: { $push: "$_id" },
          admins: { $push: "$adminId" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length === 0) {
      console.log("No duplicate emails found in Staff collection.");
    } else {
      console.log(`Found ${duplicates.length} duplicate emails:`);
      duplicates.forEach(d => {
        console.log(`Email: ${d._id}, Count: ${d.count}, Admins: ${d.admins}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkDuplicates();

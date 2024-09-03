const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URL );
  } catch (err) {
    console.log(err);
  }
}
// async function connectDB() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/testing");
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = connectDB;

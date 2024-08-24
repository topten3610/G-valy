const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://topten3610:yDCJTpSoQYrnxe3e@cluster1.5weez.mongodb.net/ecommerceMernDB"
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;

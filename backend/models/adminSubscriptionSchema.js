const mongoose = require("mongoose");


const adminSubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});

const AdminSubscription = mongoose.model(
  "AdminSubscription",
  adminSubscriptionSchema
);



module.exports = AdminSubscription;
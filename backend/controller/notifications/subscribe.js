const AdminSubscription = require("../../models/adminSubscriptionSchema");

const subscribeController = async (req, res) => {
  const subscription = req.body;
  const authKey = subscription.keys.auth;
  try {
    // Check if the subscription already exists
    const existingSubscription = await AdminSubscription.findOne({
      "keys.auth": authKey,
    });

    if (existingSubscription) {
      // If the subscription exists, do not create a new one
      console.log("Subscription already exists with this auth key.");
      return res.status(200).json({ message: "Subscription already exists." });
    }

    // Save the new subscription to the database
    await AdminSubscription.create(subscription);
    res.status(201).json({ message: "Subscription created successfully." });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the subscription.",error });
  }
};

module.exports = subscribeController
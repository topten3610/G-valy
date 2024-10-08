const AdminSubscription = require("../models/adminSubscriptionSchema");
const webPushNotification = require("../secret");
const webPush = require("web-push");

webPush.setVapidDetails(
  "mailto:https://www.esalerbd.com",
  webPushNotification.publicKey,
  webPushNotification.privateKey
);

const adminNotification = async (orderDetails) => {
  try {
    console.log(orderDetails);
    const subscriptions = await AdminSubscription.find();

    // Prepare the payload
    const payload = JSON.stringify({
      title: "New Order Created",
      body: `Order has been created By ${orderDetails.customer.name} .`,
      icon: "https://www.shutterstock.com/shutterstock/photos/2122476482/display_1500/stock-vector-yummy-smile-emoji-with-tongue-lick-mouth-delicious-tasty-food-symbol-for-social-network-yummy-and-2122476482.jpg",
      data: {
        url: "/admin-panel/all-orders",
      },
    });

    // Send notifications to all admin subscriptions
    subscriptions.forEach((subscription) => {
      webPush
        .sendNotification(subscription, payload)
        .catch((error) => console.error("Error sending notification:", error));
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};
module.exports = adminNotification;

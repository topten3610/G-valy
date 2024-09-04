import { backendDomain } from "../common";

const SERVER_URL = backendDomain;

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("Service Worker registered");

    const vapidPublicKey =
      "BHJY-xFOsgMKe6ERVtwgiyM6cnYYN29p_oXaweoEjq7JzPK47PUOOb4YmjkHAAdsLdFqAXNwx51eaZjOUW19LAw";
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Check for an existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // If a subscription exists, check if the current applicationServerKey matches the one used
      const currentKey = subscription.options.applicationServerKey;
      const currentKeyArray = new Uint8Array(currentKey);

      // Compare the current key with the new key
      if (compareUint8Arrays(currentKeyArray, convertedVapidKey)) {
        console.log(
          "Existing subscription with matching applicationServerKey found."
        );
      } else {
        // Unsubscribe from the existing subscription if the keys don't match
        await subscription.unsubscribe();
        console.log("Unsubscribed from the existing push subscription.");

        // Resubscribe with the new applicationServerKey
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        console.log("New push subscription created.");
      }
    } else {
      // No existing subscription, create a new one
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log("New push subscription created.");
    }

    await fetch(`${SERVER_URL}/api/subscribe`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Push subscription sent to server");
  } catch (error) {
    console.error("Error registering service worker or subscribing:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function compareUint8Arrays(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export default registerServiceWorker;

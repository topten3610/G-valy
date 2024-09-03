self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("Push event data:", data);

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    data: {
      url: data.url, // URL to redirect when notification is clicked
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.preventDefault(); // Prevent the default action of the notification click

  // Get the URL from the notification data
  const url = event.notification.data.url;
  console.log("Notification click URL:", url);

  event.notification.close(); // Close the notification

  event.waitUntil(
    (async () => {
      // Check if the URL is already open
      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          console.log("Focusing existing client:", client.url);
          return client.focus();
        }
      }

      // Open a new window if the URL is not open
      if (clients.openWindow) {
        console.log("Opening new window with URL:", url);
        return clients.openWindow(url);
      }
    })()
  );
});

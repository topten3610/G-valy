self.addEventListener("push", (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    data: {
      url: data.data.url, // URL to redirect when notification is clicked
    },
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  // Ensure clients API is used in the service worker context
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const urlToOpen = new URL(
          event.notification.data.url,
          self.location.origin
        ).href;

        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          // If the URL is already open, focus the window
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // If the URL is not already open, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    data: {
      url: data.data.url,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.url;

  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});

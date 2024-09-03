import  { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";


const OrderNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  console.log(socket)
  useEffect(() => {

    if (socket) {
      socket.on("newOrder", (data) => {
        console.log(data)
        setNotifications((prevNotifications) => [...prevNotifications, data]);
      });
    }

    return () => {
      if (socket) {
        socket.off("newOrder");
      }
    };
  }, [socket]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            {notification.message}: Order ID {notification.order._id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderNotifications;

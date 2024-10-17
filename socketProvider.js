import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

// MAKES SAME SOCKET AVAILABLE THROUGHOUT APP
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // add host to .env file
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    // Cleanup socket connection on unmount
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };

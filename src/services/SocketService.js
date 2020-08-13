export const sockedURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://new-battleship-socket.herokuapp.com";

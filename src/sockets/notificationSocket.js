export const registerNotificationSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_role", (role) => {
      socket.join(role);
      console.log(`User joined role room: ${role}`);
    });

    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User joined user room: user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

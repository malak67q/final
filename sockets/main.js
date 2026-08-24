// Import function to save socket.io instance
import { setIo } from "./ioInstance.js";

// Main function to set up all socket events
export default function setupSockets(io) {
  setIo(io);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // When a passenger joins a station room
    socket.on("joinStation", async (stationId) => {
      try {
        await socket.join(`station:${stationId}`);

        const room = io.sockets.adapter.rooms.get(`station:${stationId}`);
        const viewerCount = room ? room.size : 0;

        io.to(`station:${stationId}`).emit("viewerCount", {
          stationId,
          count: viewerCount,
        });
      } catch (err) {
        console.error("Error joining station:", err);
      }
    });

    // When a passenger leaves a station room
    socket.on("leaveStation", async (stationId) => {
      try {
        await socket.leave(`station:${stationId}`);

        const room = io.sockets.adapter.rooms.get(`station:${stationId}`);
        const viewerCount = room ? room.size : 0;

        io.to(`station:${stationId}`).emit("viewerCount", {
          stationId,
          count: viewerCount,
        });
      } catch (err) {
        console.error("Error leaving station:", err);
      }
    });

    // When socket disconnects
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

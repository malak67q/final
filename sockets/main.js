// Import function to save Socket.IO instance
import { setIo } from "./ioInstance.js";

// Main function to set up all Socket.IO events
export default function setupSockets(io) {
  // Save Socket.IO instance so other files can use it
  setIo(io);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Keep track of the station this socket is currently viewing
    let currentStationId = null;

    // Send the current number of viewers to a station room
    function emitPresence(stationId) {
      if (!stationId) return;

      const room = io.sockets.adapter.rooms.get(`station:${stationId}`);
      const count = room ? room.size : 0;

      io.to(`station:${stationId}`).emit("presenceUpdate", {
        stationId,
        count,
      });
    }

    // Passenger joins a station
    socket.on("joinStation", async (stationId) => {
      try {
        if (!stationId) return;

        // If the socket was already watching another station,
        // remove it from the old room first
        if (currentStationId && currentStationId !== stationId) {
          const oldStationId = currentStationId;

          await socket.leave(`station:${oldStationId}`);

          // Update viewers of the old station
          emitPresence(oldStationId);
        }

        // Join the new station room
        await socket.join(`station:${stationId}`);

        // Remember the current station
        currentStationId = stationId;

        // Update viewers of the new station
        emitPresence(stationId);
      } catch (err) {
        console.error("Error joining station:", err);
      }
    });

    // Passenger leaves a station
    socket.on("leaveStation", async (stationId) => {
      try {
        if (!stationId) return;

        await socket.leave(`station:${stationId}`);

        // If this was the current station, clear it
        if (currentStationId === stationId) {
          currentStationId = null;
        }

        // Update viewer count
        emitPresence(stationId);
      } catch (err) {
        console.error("Error leaving station:", err);
      }
    });

    // Socket disconnects
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      // Socket.IO automatically removes the socket from rooms
      // before the disconnect event is fully completed.
      if (currentStationId) {
        const stationId = currentStationId;

        // Wait until Socket.IO finishes removing the socket,
        // then calculate the new viewer count.
        setTimeout(() => {
          emitPresence(stationId);
        }, 0);
      }
    });
  });
}

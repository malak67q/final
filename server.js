// Import packages we need
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureAdminSeed } from "./services/authService.js";
import setupSockets from "./sockets/main.js";

// Create HTTP server using our Express app
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server);

// Set up socket events
setupSockets(io);

// Connect to MongoDB and create default admin user
async function startServer() {
  try {
    await connectDB();
    await ensureAdminSeed();

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`MetroSync Live running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

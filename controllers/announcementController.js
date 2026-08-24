import { createAnnouncement } from "../services/announcementService.js";
import { getIo } from "../sockets/ioInstance.js";

// Handle creating new announcement
export async function createAnnouncementController(req, res, next) {
  try {
    // Get station ID from URL parameter
    const { id } = req.params;

    // Get announcement text from request body
    const { text } = req.body;

    // Check if text was provided
    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Announcement text is required",
      });
    }

    // Create announcement in database
    const announcement = await createAnnouncement(id, text.trim());

    // Get Socket.IO instance
    const io = getIo();

    // Send announcement to everyone watching this station
    if (io) {
      io.to(`station:${id}`).emit("newAnnouncement", announcement);
    }

    // Send success response
    return res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
}

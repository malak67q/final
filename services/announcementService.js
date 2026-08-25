import Announcement from "../models/Announcement.js";
import { getIo } from "../sockets/ioInstance.js";

// Get announcements for a specific station with pagination & filtering
export async function getAnnouncementsForStation(
  stationId,
  page = 1,
  limit = 10,
  search = ""
) {
  const skip = (page - 1) * limit;

  const filter = {
    stationId,
  };

  // Filter by announcement text
  if (search) {
    filter.text = { $regex: search, $options: "i" };
  }

  const announcements = await Announcement.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Announcement.countDocuments(filter);

  return {
    announcements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Create a new announcement for a station
export async function createAnnouncement(stationId, text) {
  // Save announcement to MongoDB first
  const doc = await Announcement.create({
    stationId,
    text,
  });

  const announcement = doc.toObject();

  // Get Socket.IO instance
  const io = getIo();

  // Broadcast only after the database save succeeds
  if (io) {
    io.to(`station:${stationId}`).emit(
      "newAnnouncement",
      announcement
    );
  }

  return announcement;
}

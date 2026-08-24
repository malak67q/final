import Announcement from "../models/Announcement.js";

// Get all announcements for a specific station (newest first)
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
  const doc = await Announcement.create({
    stationId,
    text,
  });

  return doc.toObject();
}

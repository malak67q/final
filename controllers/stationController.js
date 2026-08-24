import { getAllStations } from "../services/stationService.js";
import { getAnnouncementsForStation } from "../services/announcementService.js";

// GET /api/v1/stations - Get list of all stations
export async function listStations(req, res, next) {
  try {
    const stations = await getAllStations();

    return res.status(200).json(stations);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/stations/:id/announcements
export async function stationAnnouncements(req, res, next) {
  try {
    const { id } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await getAnnouncementsForStation(
      id,
      page,
      limit,
      search
    );

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

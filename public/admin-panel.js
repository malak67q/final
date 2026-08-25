// Import shared utilities
import {
  appState,
  handleStationChange,
  initializeTrain,
  loadStationsWithPreload,
  populateStationDropdown,
  renderMap,
  setupSocketListeners,
  startClientSideTrainAnimation,
} from "./shared-utils.js";

// Check admin authentication
function checkAuth() {
  const token =
    localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

// Get admin token
const token = checkAuth();

if (!token) {
  throw new Error("Not authenticated");
}

// Connect to Socket.IO
const socket = io();

// Get HTML elements
const stationSelect =
  document.getElementById(
    "admin-station-select"
  );

const adminStationTitle =
  document.getElementById(
    "admin-station-title"
  );

const adminMapTitle =
  document.getElementById("map-title");

const mapLine =
  document.getElementById(
    "admin-map-line"
  );

const announcementList =
  document.getElementById(
    "admin-announcement-list"
  );

const viewersText =
  document.getElementById(
    "admin-viewers-text"
  );

const announcementForm =
  document.getElementById(
    "announcement-form"
  );

const announcementText =
  document.getElementById(
    "announcement-text"
  );

const announcementError =
  document.getElementById(
    "announcement-error"
  );

// Initialize admin panel
async function init() {
  try {
    // Load stations
    appState.stations =
      await loadStationsWithPreload(
        token
      );

    // Populate dropdown
    populateStationDropdown(
      stationSelect
    );

    // Render map
    renderMap(mapLine);

    // Initialize train
    initializeTrain(mapLine);

    // Start train animation
    startClientSideTrainAnimation();

    // Setup Socket.IO listeners
    setupSocketListeners(
      socket,
      announcementList,
      viewersText
    );
  } catch (error) {
    console.error(
      "Failed to initialize admin panel:",
      error
    );
  }
}

// Station selection
stationSelect.addEventListener(
  "change",
  async (event) => {
    const handler =
      handleStationChange(
        socket,
        event.target.value,
        [
          adminStationTitle,
          adminMapTitle,
        ],
        announcementList,
        mapLine,
        token
      );

    await handler();
  }
);

// Send announcement
announcementForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    announcementError.textContent = "";

    // Check station
    if (!appState.currentStationId) {
      announcementError.textContent =
        "Choose a station first.";

      return;
    }

    // Get text
    const text =
      announcementText.value.trim();

    if (!text) {
      announcementError.textContent =
        "Announcement text is required.";

      return;
    }

    try {
      const response =
        await fetch(
          `/api/v1/stations/${appState.currentStationId}/announcements`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                "Bearer " + token,
            },

            body: JSON.stringify({
              text,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        announcementError.textContent =
          data.message ||
          "Failed to create announcement";

        return;
      }

      console.log(
        "Announcement created:",
        data
      );

      // Clear textarea
      announcementText.value = "";

    } catch (error) {
      console.error(
        "Announcement error:",
        error
      );

      announcementError.textContent =
        "Network error";
    }
  }
);

// Start admin panel
init();

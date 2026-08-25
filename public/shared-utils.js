// ===== SHARED UTILITIES FOR PASSENGER AND ADMIN =====

// Train animation timing configuration
export const TRAIN_CONFIG = {
  STOP_TIME: 3000,
  MOVE_TIME: 12000,
};

// Shared app state
export const appState = {
  stations: [],
  currentStationId: null,
  currentTrainStationId: null,
  trainElement: null,
  currentTrainIndex: 0,
  isMovingForward: true,
};

// Move train to a specific station position
export function updateTrainPosition(index, isMoving = false) {
  if (appState.stations.length === 0) return;
  if (!appState.trainElement) return;

  const trainPosition =
    (index / (appState.stations.length - 1)) * 100;

  if (isMoving) {
    appState.trainElement.style.transition = `left ${
      TRAIN_CONFIG.MOVE_TIME / 1000
    }s ease-in-out`;
  } else {
    appState.trainElement.style.transition = "none";
  }

  appState.trainElement.style.left = `calc(${trainPosition}% - 24px)`;

  appState.currentTrainIndex = index;
  appState.currentTrainStationId =
    appState.stations[index].id;
}

// Start train animation
export function startClientSideTrainAnimation() {
  if (appState.stations.length === 0) return;

  const moveToNextStation = () => {
    updateTrainPosition(appState.currentTrainIndex, false);

    setTimeout(() => {
      if (appState.isMovingForward) {
        if (
          appState.currentTrainIndex <
          appState.stations.length - 1
        ) {
          appState.currentTrainIndex++;
        } else {
          appState.isMovingForward = false;
          appState.currentTrainIndex--;
        }
      } else {
        if (appState.currentTrainIndex > 0) {
          appState.currentTrainIndex--;
        } else {
          appState.isMovingForward = true;
          appState.currentTrainIndex++;
        }
      }

      updateTrainPosition(appState.currentTrainIndex, true);

      setTimeout(
        moveToNextStation,
        TRAIN_CONFIG.MOVE_TIME
      );
    }, TRAIN_CONFIG.STOP_TIME);
  };

  moveToNextStation();
}

// Draw station dots
export function renderMap(mapLine) {
  const existingDots =
    mapLine.querySelectorAll(".station-dot");

  existingDots.forEach((dot) => dot.remove());

  appState.stations.forEach((station, index) => {
    const dot = document.createElement("div");

    dot.className =
      "station-dot" +
      (station.id === appState.currentStationId
        ? " selected"
        : "");

    dot.dataset.id = station.id;
    dot.dataset.index = index;

    const label = document.createElement("span");
    label.textContent = station.name;

    dot.appendChild(label);
    mapLine.appendChild(dot);
  });
}

// Create train
export function initializeTrain(mapLine) {
  if (!appState.trainElement) {
    appState.trainElement =
      document.createElement("div");

    appState.trainElement.className = "train-icon";
    appState.trainElement.textContent = "🚆";

    mapLine.appendChild(appState.trainElement);
  }

  appState.currentTrainIndex = 0;

  updateTrainPosition(0, false);
}

// Populate station dropdown
export function populateStationDropdown(selectElement) {
  selectElement.innerHTML =
    "<option value=''>Select Station</option>" +
    appState.stations
      .map(
        (station) =>
          `<option value="${station.id}">${station.name}</option>`
      )
      .join("");
}

// Load announcements
export async function loadAnnouncements(
  stationId,
  token = null
) {
  const headers = token
    ? {
        Authorization: "Bearer " + token,
      }
    : {};

  const res = await fetch(
    `/api/v1/stations/${stationId}/announcements`,
    {
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load announcements");
  }

  return await res.json();
}

// Add announcement to list
export function addAnnouncementToList(
  announcementList,
  announcement,
  toTop = false
) {
  const li = document.createElement("li");

  li.className = "announcement-item";

  const time = new Date(
    announcement.createdAt || Date.now()
  );

  li.innerHTML = `
    <div>${announcement.text}</div>
    <time>${time.toLocaleTimeString()}</time>
  `;

  if (
    toTop &&
    announcementList.firstChild
  ) {
    announcementList.insertBefore(
      li,
      announcementList.firstChild
    );
  } else {
    announcementList.appendChild(li);
  }
}

// Display announcements
export function displayAnnouncements(
  announcementList,
  announcements
) {
  announcementList.innerHTML = "";

  announcements.forEach((announcement) => {
    addAnnouncementToList(
      announcementList,
      announcement,
      false
    );
  });
}

// Fetch stations
export async function fetchStations(token = null) {
  const headers = token
    ? {
        Authorization: "Bearer " + token,
      }
    : {};

  const res = await fetch(
    "/api/v1/stations",
    {
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load stations");
  }

  return await res.json();
}

// Load stations with preload
export async function loadStationsWithPreload(
  token = null
) {
  if (
    window.preloadedData &&
    window.preloadedData.stations &&
    window.preloadedData.stations.length > 0
  ) {
    console.log("Using preloaded stations");

    return window.preloadedData.stations;
  }

  console.log(
    "Fetching stations (preload not available)"
  );

  return await fetchStations(token);
}

// Handle station change
export function handleStationChange(
  socket,
  newStationId,
  titleElements,
  announcementList,
  mapLine,
  token = null
) {
  return async () => {
    if (!newStationId) return;

    // Leave old station
    if (appState.currentStationId) {
      socket.emit(
        "leaveStation",
        appState.currentStationId
      );
    }

    // Set new station
    appState.currentStationId = newStationId;

    const selectedStation =
      appState.stations.find(
        (station) =>
          station.id === newStationId
      );

    if (!selectedStation) return;

    // Update titles
    titleElements.forEach((element) => {
      if (element) {
        element.textContent =
          selectedStation.name;
      }
    });

    // Join station room
    socket.emit(
      "joinStation",
      appState.currentStationId
    );

    // Load announcements
    try {
      const data =
        await loadAnnouncements(
          appState.currentStationId,
          token
        );

      displayAnnouncements(
        announcementList,
        data.announcements || []
      );
    } catch (error) {
      console.error(
        "Failed to load announcements:",
        error
      );

      announcementList.innerHTML = "";
    }

    // Update map
    renderMap(mapLine);
  };
}

// Setup Socket.IO listeners
export function setupSocketListeners(
  socket,
  announcementList,
  viewersText
) {
  // New announcement
  socket.on(
    "newAnnouncement",
    (announcement) => {
      console.log(
        "New announcement received:",
        announcement
      );

      if (
        announcement.stationId ===
        appState.currentStationId
      ) {
        addAnnouncementToList(
          announcementList,
          announcement,
          true
        );
      }
    }
  );

  // Viewer count update
  socket.on(
    "presenceUpdate",
    ({ stationId, count }) => {
      console.log(
        "Presence update:",
        stationId,
        count
      );

      if (
        stationId ===
        appState.currentStationId
      ) {
        viewersText.textContent =
          "Live viewers: " + count;
      }
    }
  );
}

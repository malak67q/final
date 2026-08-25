import request from "supertest";
import app from "../app.js";
import { connectDB } from "../config/db.js";
import { ensureAdminSeed } from "../services/authService.js";
import Station from "../models/Station.js";

let stationId;

beforeAll(async () => {
  await connectDB();
  await ensureAdminSeed();

  const station = await Station.findOne();

  if (!station) {
    throw new Error("No station found in database");
  }

  stationId = station._id.toString();
});

test("POST announcement without token should be rejected", async () => {
  const response = await request(app)
    .post(`/api/v1/stations/${stationId}/announcements`)
    .send({
      text: "Unauthorized test",
    });

  expect(response.statusCode).toBe(401);
});

test("Admin with valid token can create announcement", async () => {
  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "admin@metrosync.com",
      password: "Admin123!",
    });

  expect(loginResponse.statusCode).toBe(200);

  const token = loginResponse.body.token;

  const response = await request(app)
    .post(`/api/v1/stations/${stationId}/announcements`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      text: "Test announcement from automated test",
    });

  expect(response.statusCode).toBe(201);
  expect(response.body.text).toBe(
    "Test announcement from automated test"
  );
});

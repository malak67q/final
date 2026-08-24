import request from "supertest";
import { test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import app from "../app.js";
import { connectDB } from "../config/db.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("GET /api/v1/stations should return 200", async () => {
  const response = await request(app)
    .get("/api/v1/stations");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

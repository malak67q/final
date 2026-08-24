import request from "supertest";
import app from "../app.js";
import { connectDB } from "../config/db.js";

beforeAll(async () => {
  await connectDB();
});

test("POST /api/v1/auth/login should return JWT for admin", async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "admin@metrosync.com",
      password: "Admin123!",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.role).toBe("admin");
  expect(response.body.email).toBe("admin@metrosync.com");
  expect(response.body.token).toBeTruthy();
});

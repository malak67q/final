import request from "supertest";
import app from "../app.js";

test("GET /health should return status ok", async () => {
  const response = await request(app)
    .get("/health")
    .timeout(5000);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ status: "ok" });
});

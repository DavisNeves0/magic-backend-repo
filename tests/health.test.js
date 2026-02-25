import request from "supertest";
import app from "../src/server.js";

describe("GET /health", () => {
  it("should return status 200 and ok message", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

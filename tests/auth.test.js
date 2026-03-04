import request from "supertest";
import app from "../src/server.js";

describe("Auth Routes", () => {
  it("Should be register a new user", async () => {
    await request(app)
      .post("/user-register")
      .set({
        name: "John doe",
        email: "jonh.doe@example.com",
        password: "password123"
      })
      .then((response) => {
        expect(response.statusCode).toBe(500);
      });
  });
});

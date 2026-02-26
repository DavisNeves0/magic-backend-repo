import request from "supertest";
import app from "../src/server.js";

describe("UserController", () => {
  it("should create a user successfully", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
      })
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "Usuario criado com sucesso",
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    });
  });

  it("should return an error when name or email is missing", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "John Doe",
      })
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: "Erro ao criar usuario, nome e email são obrigatórios",
    });
  });
});

import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../models/userModel.js", () => ({
  __esModule: true,
  default: {
    signup: jest.fn(),
    login: jest.fn(),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

let User;
let jwt;
let userRoutes;

beforeAll(async () => {
  const userModule = await import("../models/userModel.js");
  const jwtModule = await import("jsonwebtoken");
  const routesModule = await import("../routes/userRoutes.js");

  User = userModule.default;
  jwt = jwtModule.default;
  userRoutes = routesModule.default;
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/user", userRoutes);
  return app;
}

describe("POST /api/user/signup", () => {
  let app;
  const OLD_SECRET = process.env.JWT_SECRET;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    process.env.JWT_SECRET = "TEST_SECRET";
  });

  afterAll(() => {
    process.env.JWT_SECRET = OLD_SECRET;
  });

  test("201 kai registracija sėkminga", async () => {
    User.signup.mockResolvedValueOnce({
      _id: "user123",
      admin: false,
    });

    jwt.sign.mockReturnValueOnce("FAKE_JWT_TOKEN");

    const body = { email: "new@example.com", password: "slaptas123" };

    const res = await request(app)
      .post("/api/user/signup")
      .send(body);

    expect(User.signup).toHaveBeenCalledWith("new@example.com", "slaptas123");
    expect(jwt.sign).toHaveBeenCalledWith({ _id: "user123" }, "TEST_SECRET", {
      expiresIn: "3d",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      email: "new@example.com",
      token: "FAKE_JWT_TOKEN",
      id: "user123",
      admin: false,
    });
  });

  test("400 kai User.signup meta klaidą (pvz. netinkami duomenys)", async () => {
    User.signup.mockRejectedValueOnce(
      new Error("Netinkamas email arba slaptažodis")
    );

    const res = await request(app)
      .post("/api/user/signup")
      .send({ email: "bad@example.com", password: "xx" });

    expect(User.signup).toHaveBeenCalledWith("bad@example.com", "xx");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Netinkamas email arba slaptažodis");
  });

  test("400 kai nėra JWT_SECRET (serverio konfiguracijos klaida)", async () => {
    delete process.env.JWT_SECRET;

    User.signup.mockResolvedValueOnce({
      _id: "user123",
      admin: true,
    });

    const res = await request(app)
      .post("/api/user/signup")
      .send({ email: "admin@example.com", password: "slaptas123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("Serverio konfigūracija neteisinga");
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});

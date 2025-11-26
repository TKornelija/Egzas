import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../models/reservationModel.js", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Costume.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule("../middleware/requireAuth.js", () => ({
  __esModule: true,
  default: (req, res, next) => {
    req.user = { _id: "testUser123" };
    next();
  },
}));


let Reservation;
let Costume;
let router;
let overlaps;


beforeAll(async () => {
  const reservationModule = await import("../models/reservationModel.js");
  const costumeModule = await import("../models/Costume.js");
  const routerModule = await import("../routes/reservation.js");

  Reservation = reservationModule.default;
  Costume = costumeModule.default;
  router = routerModule.default;
  overlaps = routerModule.overlaps;
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/reservations", router);
  return app;
}

describe("overlaps()", () => {
  test("TRUE kai datos persidengia", () => {
    const result = overlaps(
      "2025-01-10",
      "2025-01-15",
      "2025-01-12",
      "2025-01-20"
    );
    expect(result).toBe(true);
  });

  test("FALSE kai vienas baigiasi kai kitas prasideda", () => {
    const result = overlaps(
      "2025-01-10",
      "2025-01-12",
      "2025-01-12",
      "2025-01-20"
    );
    expect(result).toBe(false);
  });
});

describe("POST /api/reservations", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test("400 jei trūksta laukų", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .send({ costumeId: 1, from: "2025-01-10" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Trūksta privalomų laukų.");
  });

  test("404 jei kostiumas nerastas", async () => {
    Costume.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post("/api/reservations")
      .send({ costumeId: 1, from: "2025-01-10", to: "2025-01-12" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Kostiumas nerastas.");
  });

  test("409 jei visi kostiumai užimti", async () => {
    Costume.findOne.mockResolvedValueOnce({
      id: 1,
      name: "Super Kostiumas",
      quantity: 1,
      rentalPrice: 10,
    });

    Reservation.find.mockResolvedValueOnce([
      { from: "2025-01-10", to: "2025-01-12" },
    ]);

    const res = await request(app)
      .post("/api/reservations")
      .send({ costumeId: 1, from: "2025-01-11", to: "2025-01-13" });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("visi 1 \"Super Kostiumas\" kostiumai rezervuoti");
  });

  test("201 kai rezervacija sėkmingai sukurta ir total teisingas", async () => {
    Costume.findOne.mockResolvedValueOnce({
      id: 1,
      name: "Super Kostiumas",
      quantity: 5,
      rentalPrice: 20,
    });

    Reservation.find.mockResolvedValueOnce([]);

    const fakeReservation = {
      _id: "res123",
      userId: "testUser123",
      costumeId: 1,
      from: "2025-01-10",
      to: "2025-01-13",
      size: "M",
      total: 60,
      status: "Laukiama patvirtinimo",
    };

    Reservation.create.mockResolvedValueOnce(fakeReservation);

    const res = await request(app)
      .post("/api/reservations")
      .send({ costumeId: 1, from: "2025-01-10", to: "2025-01-13", size: "M" });
    expect(Reservation.create).toHaveBeenCalledWith({
      userId: "testUser123",
      costumeId: 1,
      from: "2025-01-10",
      to: "2025-01-13",
      size: "M",
      total: 60,
      status: "Laukiama patvirtinimo",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBe("res123");
    expect(res.body.total).toBe(60);
  });
});

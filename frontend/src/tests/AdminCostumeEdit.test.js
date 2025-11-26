import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
  useNavigate: () => mockNavigate,
}));

import AdminCostumeEdit from "../pages/Admin/AdminCostumeEdit";
import { apiGet, apiPut } from "../lib/api";

jest.mock("../lib/api", () => ({
  apiGet: jest.fn(),
  apiPut: jest.fn(),
}));

function renderEdit() {
  return render(
    <MemoryRouter>
      <AdminCostumeEdit />
    </MemoryRouter>
  );
}

describe("AdminCostumeEdit komponentas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rodo 'Kraunama' kol duomenys kraunami ir vėliau užpildo formą", async () => {
    apiGet.mockResolvedValueOnce({
      name: "Batman",
      description: "Dark knight",
      price: 100,
      rentalPrice: 10,
      quantity: 5,
      category: "hero",
      size: ["S", "M", "L"],
      imageUrls: ["http://a.com/1.jpg", "http://a.com/2.jpg"],
    });

    const { container } = renderEdit();

    expect(screen.getByText("Kraunama")).toBeInTheDocument();
    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith("/api/costumes/123");
      expect(screen.queryByText("Kraunama")).toBeNull();
    });

    expect(container.querySelector('input[name="name"]').value).toBe("Batman");
    expect(
      container.querySelector('textarea[name="description"]').value
    ).toBe("Dark knight");
    expect(container.querySelector('input[name="price"]').value).toBe("100");
    expect(
      container.querySelector('input[name="rentalPrice"]').value
    ).toBe("10");
    expect(
      container.querySelector('input[name="quantity"]').value
    ).toBe("5");
    expect(
      container.querySelector('input[name="category"]').value
    ).toBe("hero");
    expect(container.querySelector('input[name="size"]').value).toBe(
      "S, M, L"
    );
    expect(container.querySelector('input[name="imageUrls"]').value).toBe(
      "http://a.com/1.jpg, http://a.com/2.jpg"
    );
  });

  test("jei apiGet meta klaidą – rodomas klaidos pranešimas", async () => {
    apiGet.mockRejectedValueOnce(new Error("fail"));

    renderEdit();

    await waitFor(() => {
      expect(
        screen.getByText("Nepavyko gauti kostiumo duomenų.")
      ).toBeInTheDocument();
      expect(screen.queryByText("Kraunama")).toBeNull();
    });
  });

  test("sėkmingai išsiunčia formą ir kviečia apiPut su teisingais duomenimis", async () => {
    apiGet.mockResolvedValueOnce({
      name: "Batman",
      description: "Dark knight",
      price: 100,
      rentalPrice: 10,
      quantity: 5,
      category: "hero",
      size: ["S", "M", "L"],
      imageUrls: ["http://a.com/1.jpg", "http://a.com/2.jpg"],
    });

    apiPut.mockResolvedValueOnce({});

    const { container } = renderEdit();
    await waitFor(() => {
      expect(apiGet).toHaveBeenCalled();
      expect(screen.queryByText("Kraunama")).toBeNull();
    });

    fireEvent.change(container.querySelector('input[name="name"]'), {
      target: { value: "Batman Updated" },
    });
    fireEvent.change(container.querySelector('input[name="price"]'), {
      target: { value: "150" },
    });
    fireEvent.change(container.querySelector('input[name="size"]'), {
      target: { value: "XS, S, M" },
    });
    fireEvent.change(container.querySelector('input[name="imageUrls"]'), {
      target: { value: "img1.jpg, img2.jpg" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Išsaugoti/i })
    );

    await waitFor(() => {
      expect(apiPut).toHaveBeenCalledTimes(1);
    });

    expect(apiPut).toHaveBeenCalledWith(
      "/api/costumes/123",
      expect.objectContaining({
        name: "Batman Updated",
        price: 150,
        rentalPrice: 10,
        quantity: 5,
        category: "hero",
        size: ["XS", "S", "M"],
        imageUrls: ["img1.jpg", "img2.jpg"],
      })
    );

    expect(
      screen.queryByText("Nepavyko atnaujinti kostiumo.")
    ).toBeNull();
  });

  test("jei apiPut meta klaidą – rodomas klaidos pranešimas", async () => {
    apiGet.mockResolvedValueOnce({
      name: "Batman",
      description: "Dark knight",
      price: 100,
      rentalPrice: 10,
      quantity: 5,
      category: "hero",
      size: ["S", "M", "L"],
      imageUrls: ["http://a.com/1.jpg", "http://a.com/2.jpg"],
    });

    apiPut.mockRejectedValueOnce(new Error("update fail"));

    const { container } = renderEdit();

    await waitFor(() => {
      expect(apiGet).toHaveBeenCalled();
      expect(screen.queryByText("Kraunama")).toBeNull();
    });

    fireEvent.change(container.querySelector('input[name="name"]'), {
      target: { value: "Broken" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Išsaugoti/i })
    );

    await waitFor(() => {
      expect(apiPut).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText("Nepavyko atnaujinti kostiumo.")
      ).toBeInTheDocument();
    });
  });
});

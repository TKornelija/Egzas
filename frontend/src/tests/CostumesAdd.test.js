import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CostumesAdd from "../pages/Admin/CostumesAdd";

import { apiPost } from "../lib/api";

jest.mock("../lib/api", () => ({
  apiPost: jest.fn(),
}));

function renderForm() {
  return render(
    <MemoryRouter>
      <CostumesAdd />
    </MemoryRouter>
  );
}

describe("CostumesAdd komponentas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("pradžioje nerodo klaidos ir sėkmės pranešimų", () => {
    renderForm();
    expect(screen.queryByText(/Užpildykite visus laukus!/i)).toBeNull();
    expect(screen.queryByText(/Kostiumas sėkmingai sukurtas!/i)).toBeNull();
    expect(screen.queryByText(/Nepavyko sukurti kostiumo./i)).toBeNull();
  });

  test("meta klaidą, jei forma pateikiama neįvedus pavadinimo ar aprašymo", () => {
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: /Pridėti kostiumą/i,
    });

    fireEvent.click(submitButton);

    expect(
      screen.getByText("Užpildykite visus laukus!")
    ).toBeInTheDocument();
    expect(apiPost).not.toHaveBeenCalled();
  });

  test("sėkmingai išsiunčia formą ir kviečia apiPost su teisingais duomenimis", async () => {
    apiPost.mockResolvedValueOnce({});

    const { container } = renderForm();

    const nameInput = container.querySelector('input[name="name"]');
    const descInput = container.querySelector('textarea[name="description"]');
    const priceInput = container.querySelector('input[name="price"]');
    const rentalInput = container.querySelector('input[name="rentalPrice"]');
    const quantityInput = container.querySelector('input[name="quantity"]');
    const categoryInput = container.querySelector('input[name="category"]');
    const sizeInput = container.querySelector('input[name="size"]');
    const imagesInput = container.querySelector('input[name="imageUrls"]');

    fireEvent.change(nameInput, { target: { value: "Batman" } });
    fireEvent.change(descInput, { target: { value: "Hero costume" } });
    fireEvent.change(priceInput, { target: { value: "100" } });
    fireEvent.change(rentalInput, { target: { value: "10" } });
    fireEvent.change(quantityInput, { target: { value: "3" } });
    fireEvent.change(categoryInput, { target: { value: "hero" } });
    fireEvent.change(sizeInput, { target: { value: "S,M,L" } });
    fireEvent.change(imagesInput, {
      target: { value: "http://a.com/img1.jpg,http://a.com/img2.jpg" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Pridėti kostiumą/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiPost).toHaveBeenCalledTimes(1);
    });

    expect(apiPost).toHaveBeenCalledWith(
      "/api/costumes",
      expect.objectContaining({
        name: "Batman",
        description: "Hero costume",
        price: 100,
        rentalPrice: 10,
        quantity: 3,
        category: "hero",
        size: ["S", "M", "L"],
        imageUrls: ["http://a.com/img1.jpg", "http://a.com/img2.jpg"],
      })
    );

    expect(
      screen.queryByText("Nepavyko sukurti kostiumo.")
    ).toBeNull();
  });

  test("jei apiPost meta klaidą – rodomas klaidos pranešimas", async () => {
    apiPost.mockRejectedValueOnce(new Error("Server error"));

    const { container } = renderForm();

    const nameInput = container.querySelector('input[name="name"]');
    const descInput = container.querySelector('textarea[name="description"]');
    const priceInput = container.querySelector('input[name="price"]');
    const rentalInput = container.querySelector('input[name="rentalPrice"]');

    fireEvent.change(nameInput, { target: { value: "Superman" } });
    fireEvent.change(descInput, { target: { value: "Blue suit" } });
    fireEvent.change(priceInput, { target: { value: "90" } });
    fireEvent.change(rentalInput, { target: { value: "15" } });

    const submitButton = screen.getByRole("button", {
      name: /Pridėti kostiumą/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiPost).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText("Nepavyko sukurti kostiumo.")
      ).toBeInTheDocument();
    });
  });
});

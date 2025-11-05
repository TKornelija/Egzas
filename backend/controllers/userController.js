import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Pagalbinė funkcija JWT kūrimui
function sukurtiToken(_id) {
  const slaptas = process.env.SECRET;
  if (!slaptas) {
    // jei nėra .env SECRET, aiškiai grąžinam klaidą
    throw new Error("Serverio konfigūracija neteisinga: trūksta SECRET");
  }
  return jwt.sign({ _id }, slaptas, { expiresIn: "3d" });
}

export const signupUser = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    const user = await User.signup(email, password); // hash daromas modelyje
    const token = sukurtiToken(user._id);

    return res.status(201).json({
      email,
      token,
      // galima grąžinti ir id, jei prireiks fronte:
      id: user._id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Registracijos klaida" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    const user = await User.login(email, password);
    const token = sukurtiToken(user._id);

    return res.status(200).json({
      email,
      token,
      id: user._id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Prisijungimo klaida" });
  }
};

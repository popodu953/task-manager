import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connection established");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Use 'none' for sameSite in production (required for cross-origin cookies)
  // Use 'strict' in development (prevents CSRF attack)
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
  });
};
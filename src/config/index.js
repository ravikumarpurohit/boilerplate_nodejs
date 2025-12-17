import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT;
export const environment = process.env.NODE_ENV;
export const databaseURL = process.env.DATABASE_URI;
export const clientDomain = process.env.CLIENT_APPLICATION_DOMAIN;
export const JWTSecret = process.env.JWT_SECRET;

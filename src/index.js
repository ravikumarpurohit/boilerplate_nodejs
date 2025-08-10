import path from "path";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { port } from "./config/index.js";
import { conn } from "./models/index.js";
import Api from "./router/indexRoute.js";

// Setup __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

conn;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(
  logger("dev", {
    skip: (req, res) => req.originalUrl.includes("/static/"),
  })
);

// Static file routes (uncomment and adjust if needed)
// app.use("/uploads/profileImage/", express.static(path.join(__dirname, "../uploads/profileImage")));
// app.use("*/upload", express.static(path.join(__dirname, 'public/images')));

app.use("/api/v1", Api);

// Serve frontend
const publicDir = join(__dirname, "../public");
app.use(express.static(publicDir));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: publicDir });
});

app.listen(port, () => console.log(`Server running at port ${port}...`));

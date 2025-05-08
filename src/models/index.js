import mongoose from "mongoose";
import { databaseURL } from "../config/index.js";

// Optional SSL config based on hostname (uncomment if needed)
// const ssl = databaseURL.match(/localhost/);
// const options = {
//   connectTimeoutMS: 10000,
//   useNewUrlParser: true,
//   // useUnifiedTopology: true,
//   // ssl: ssl ? false : true,
// };

const conn = mongoose
  .connect(databaseURL)
  .catch((err) => console.log(err?.reason));

export { conn };

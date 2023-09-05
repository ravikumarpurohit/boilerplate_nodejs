const path = require("path");
const express = require("express");
const app = express();
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { port } = require("./config/index");
const { conn } = require("./models/index");
const Api = require("./router/indexRoute");

conn;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./../swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  logger("dev", {
    skip: (req, res) => {
      return req.originalUrl.includes("/static/");
    },
  })
);

app.use("/upload/productImages/", express.static(path.join(__dirname, "../upload/productImages")));
// app.use("*/upload", express.static(path.join(__dirname, 'public/images')));
app.use("/api/v1", Api);

//  Front End url
const public = require("path").join(__dirname, "../public");
app.use(express.static(public));
app.get("*", (req, res) => {
  res.sendFile("index.html", { public }); 
});

app.listen(port, () => console.log(`server running at ${port}...`));

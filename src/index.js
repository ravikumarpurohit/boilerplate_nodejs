const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: true });
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { port } = require("./config/index");
const { conn } = require("./models/index");
const Api = require("./router/indexRoute");
const { socketIo } = require("./service/socketIo");

conn;
socketIo(io);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./../swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
// app.use(express.limit(1000000));
app.use(
  logger("dev", {
    skip: (req, res) => {
      return req.originalUrl.includes("/static/");
    },
  })
);

app.use("/api/v1", Api);

//  Front End url
const public = require("path").join(__dirname, "../public");
app.use(express.static(public));
app.get("*", (req, res) => {
  res.sendFile("index.html", { public });
});

server.listen(port, () => console.log(`server running at ${port}...`));
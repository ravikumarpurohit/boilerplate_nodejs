const mongoose = require("mongoose");
const { databaseURL } = require("../config/index");
const ssl = databaseURL.match(/localhost/);
// let options = {
//   connectTimeoutMS: 10000,
//   useNewUrlParser: true,
//   // useUnifiedTopology: true,
//   // ssl: ssl ? false : true,
// };
const conn = mongoose.connect(databaseURL).catch((err) => console.log(err.reason));

module.exports = { conn };

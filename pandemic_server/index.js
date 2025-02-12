const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const API = process.env.API;

const app = express();

app.get(API, (req, res) => {
  res.send("Hello");
});

mongoose
  .connect(CONNECTION_STRING, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () =>
  console.log(`server running on port http://localhost:${PORT}`)
);

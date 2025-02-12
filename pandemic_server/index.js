const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();

//database model
const User = require("./models/User");

//env config
const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const api = process.env.API_URL;

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//routes
const adminRoutes = require("./routers/admin");
const authRoutes = require("./routers/auth");
const predictRoutes = require("./routers/predict");

app.use(`${api}/admin`, adminRoutes);
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/predict`, predictRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

mongoose
  .connect(CONNECTION_STRING, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () =>
  console.log(`server running on port http://localhost:${PORT}`)
);

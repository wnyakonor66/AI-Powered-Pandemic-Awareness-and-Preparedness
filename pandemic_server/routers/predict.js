const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("predict page");
});

module.exports = router;

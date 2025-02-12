const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

exports.User = mongoose.model("User", UserSchema);

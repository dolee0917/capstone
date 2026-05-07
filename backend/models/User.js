const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,

  nickname: String,
  gender: String,
  purpose: String,
  otherPurpose: String,
  petCount: String,
  agree: Boolean,

});

module.exports = mongoose.model("User", userSchema);
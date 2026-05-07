const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: String,
  type: String,
  breed: String,
  gender: String,
  neutered: String,
  age: String,
  weight: String,
  personality: String,
  feature: String,
  image: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Pet", petSchema);
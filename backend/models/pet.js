const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: String,        // 이름
  type: String,        // 강아지, 고양이
  age: Number,   
  userId: String,      // 나이
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pet", petSchema);
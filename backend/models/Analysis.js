const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    petIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],

    petNames: [String],

    // 화합 or 갈등
    result: {
      type: String,
      required: true,
    },

    // 점수
    score: {
      type: Number,
      default: 0,
    },

    // 간단 요약
    summary: {
      type: String,
      default: "",
    },

    // 상세 설명
    detail: {
      type: String,
      default: "",
    },

    // 추천 행동
    recommendation: {
      type: String,
      default: "",
    },

    dateTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
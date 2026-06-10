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

    behavior: {
      type: String,
      default: "",
    },

    behaviorCategory: {
      type: String,
      default: "",
    },

    scoreImpact: {
      type: Number,
      default: 0,
    },

    relationshipTrend: {
      type: String,
      default: "",
    },

    solutions: [
    {
      text: String,

      memo: {
        type: String,
        default: "",
      },

      stage: {
        type: Number,
        default: 2,
      },

      stageTitle: {
        type: String,
        default: "환경 준비",
      },

      mission: {
        title: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        successCondition: {
          type: String,
          default: "",
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },

      checked: {
        type: Boolean,
        default: false,
      },
    },
  ],

  todayMissionCompleted: {
  type: Boolean,
  default: false,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
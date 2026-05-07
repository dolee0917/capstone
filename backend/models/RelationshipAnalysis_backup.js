const mongoose = require('mongoose');

const relationshipAnalysisSchema = new mongoose.Schema(
  {
    pets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
      }
    ],

    result: {
      type: String,
      enum: ['harmony', 'conflict'],
      required: true
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },

    summary: {
      type: String,
      required: true
    },

    detail: {
      type: String,
      required: true
    },

    recommendation: {
      type: String,
      default: ''
    },

    analyzedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'RelationshipAnalysis',
  relationshipAnalysisSchema
);
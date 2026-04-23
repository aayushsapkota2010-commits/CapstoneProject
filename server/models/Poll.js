const mongoose = require("mongoose");

const surveyResponseSchema = new mongoose.Schema(
  {
    userEmail: String,
    selectedOptionIndexes: [Number],
    textResponse: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const pollSchema = new mongoose.Schema({
  type: { type: String, enum: ["poll", "survey"], default: "poll" },
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  allowMultipleSelections: { type: Boolean, default: false },
  allowTextResponse: { type: Boolean, default: false },
  createdBy: String,
  votedUsers: [String],
  surveyResponses: [surveyResponseSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Poll", pollSchema);

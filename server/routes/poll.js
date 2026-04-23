const express = require("express");

const Poll = require("../models/Poll");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      question,
      options = [],
      createdBy,
      type = "poll",
      allowMultipleSelections = false,
      allowTextResponse = false
    } = req.body;

    const cleanQuestion = String(question || "").trim();
    const formattedOptions = options
      .map((option) => String(option || "").trim())
      .filter(Boolean)
      .map((option) => ({
        text: option,
        votes: 0
      }));

    if (!cleanQuestion) {
      return res.status(400).json({ message: "A question is required." });
    }

    if (formattedOptions.length < 2) {
      return res.status(400).json({ message: "At least two options are required." });
    }

    const poll = new Poll({
      type: type === "survey" ? "survey" : "poll",
      question: cleanQuestion,
      options: formattedOptions,
      createdBy,
      allowMultipleSelections: Boolean(allowMultipleSelections),
      allowTextResponse: Boolean(allowTextResponse)
    });

    await poll.save();

    return res.json({
      message: `${poll.type === "survey" ? "Survey" : "Poll"} created successfully`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating item" });
  }
});

router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    return res.json(polls);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch items." });
  }
});

router.post("/vote", async (req, res) => {
  try {
    const { pollId, optionIndex, userEmail } = req.body;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    if (poll.type !== "poll") {
      return res.status(400).json({ message: "Use the survey response flow for surveys." });
    }

    if (!poll.options[optionIndex]) {
      return res.status(400).json({ message: "Selected option is invalid." });
    }

    if (userEmail && poll.votedUsers.includes(userEmail)) {
      return res.status(400).json({ message: "You already voted on this poll." });
    }

    poll.options[optionIndex].votes += 1;
    if (userEmail) {
      poll.votedUsers.push(userEmail);
    }

    await poll.save();

    return res.json({ message: "Vote recorded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to record vote." });
  }
});

router.post("/survey/respond", async (req, res) => {
  try {
    const { pollId, selectedOptionIndexes = [], textResponse = "", userEmail } = req.body;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Survey not found." });
    }

    if (poll.type !== "survey") {
      return res.status(400).json({ message: "This item is not a survey." });
    }

    if (userEmail && poll.votedUsers.includes(userEmail)) {
      return res.status(400).json({ message: "You already responded to this survey." });
    }

    const uniqueIndexes = [...new Set(selectedOptionIndexes)]
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < poll.options.length);

    if (uniqueIndexes.length === 0 && !String(textResponse || "").trim()) {
      return res.status(400).json({
        message: "Choose at least one option or add written feedback before submitting."
      });
    }

    if (!poll.allowMultipleSelections && uniqueIndexes.length > 1) {
      return res.status(400).json({ message: "This survey accepts only one option." });
    }

    uniqueIndexes.forEach((index) => {
      poll.options[index].votes += 1;
    });

    poll.surveyResponses.push({
      userEmail: userEmail || "",
      selectedOptionIndexes: uniqueIndexes,
      textResponse: poll.allowTextResponse ? String(textResponse || "").trim() : ""
    });

    if (userEmail) {
      poll.votedUsers.push(userEmail);
    }

    await poll.save();

    return res.json({ message: "Survey response recorded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to submit survey response." });
  }
});

module.exports = router;

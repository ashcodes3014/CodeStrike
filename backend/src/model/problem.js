const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"]
  },
  tags: {
    type: String,
    required: true,
    enum: ["graph", "linked-list", "stack", "queue", "array", "DP", "recursion"]
  },
  visibleTestCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String, required: true }
    }
  ],
  Hiddencases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ],
  startCode: [
    {
      language: { type: String, required: true },
      initialCode: { type: String, required: true }
    }
  ],
  editorial:{
    type:String
  },
  problemCreator: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true
  },
  referenceSolution: [
    {
      language: { type: String, required: true },
      completeCode: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;

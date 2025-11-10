import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  askedBy: { type: String, default: "" }, 
  askedAt: { type: Date, default: Date.now },
  answered: { type: Boolean, default: false },
  public: { type: Boolean, default: false } 
});

export default mongoose.model("Question", QuestionSchema);

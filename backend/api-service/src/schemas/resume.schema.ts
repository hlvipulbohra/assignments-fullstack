import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  startDate: Date,
  endDate: Date,
});
const skillSchema = new mongoose.Schema({
  name: String,
  proficiency: { type: String, enum: ["basic", "intermediate", "advanced"] },
});

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const resumeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String },
  email: { type: String, index: true },
  phone: { type: String },

  education: [educationSchema], // This is the array of education objects
  skills: [skillSchema],
  experience: [experienceSchema],

  rawContent: { type: String }, // This is the raw content of the resume which user sent
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "failed"],
  },
  warningsOrErrors: { type: [String] }, // This is the array of errors, warnings that occurred while validating the resume
  userEmail: { type: String }, // This is the email of the user who uploaded the resume

  // timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const ResumeModel = mongoose.model("resume", resumeSchema);
export default ResumeModel;

import mongoose from "mongoose";

const PYQSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    // Filename format: branch - Subject Name - Subject Code
    fileName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.PYQ || mongoose.model("PYQ", PYQSchema);

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true }
  },
  { _id: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    instructions: String
  },
  { _id: true }
);

 const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    grade: {
      type: String,
      enum: [
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
        "9th",
        "10th",
        "11th",
        "12th"
      ],
      required: true
    },

    educator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    lessons: [lessonSchema],

    assignments: [assignmentSchema],

    studentsEnrolled: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "educator"],
      default: "student"
    },

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
      required: function () {
        return this.role === "student";
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

import mongoose, { Schema, models, model, Types } from "mongoose";

const StudentProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
    department: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    gpa: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    social: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const StudentProfile = models.StudentProfile || model("StudentProfile", StudentProfileSchema);
export default StudentProfile;



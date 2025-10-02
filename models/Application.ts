import mongoose, { Schema, models, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    opportunityId: { type: Schema.Types.ObjectId, ref: "Opportunity", required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    studentUsername: { type: String, required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["New", "Shortlisted", "Selected", "Rejected"], default: "New" },
  },
  { timestamps: true }
);

ApplicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });

const Application = models.Application || model("Application", ApplicationSchema);
export default Application;



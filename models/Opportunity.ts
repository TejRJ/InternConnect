import mongoose, { Schema, models, model } from "mongoose";

const OpportunitySchema = new Schema(
  {
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recruiterUsername: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    type: { type: String, enum: ["Internship", "Full-time", "Part-time", "Contract"], required: true },
    domain: { type: String, required: true },
    location: { type: String, required: true },
    workType: { type: String, enum: ["On-site", "Hybrid", "Remote"], required: true },
    stipend: { type: String, required: true },
    duration: { type: String, required: true },
    deadline: { type: String, required: true },
    paid: { type: Boolean, default: true },
    skills: { type: [String], required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Opportunity = models.Opportunity || model("Opportunity", OpportunitySchema);
export default Opportunity;



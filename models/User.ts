import mongoose, { Schema, models, model } from "mongoose";

export type Role = "admin" | "recruiter" | "student";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "recruiter", "student"], default: "student" },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;





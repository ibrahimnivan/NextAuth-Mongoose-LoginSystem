import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false }, // set to false for external authentication methods
  },
  { timestamps: true } // Adds createdAt and updatedAt fields to the schema
);

// Create a Mongoose model named 'User' based on the defined schema
const User = mongoose.models.User || mongoose.model("User", userSchema); //checks if the User model already exists; if it does, it uses the existing model; otherwise, it creates a new one.

export default User;

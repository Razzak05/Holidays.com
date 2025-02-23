import mongoose from "mongoose";

type UserType = {
  _id: string;
  email: string;
  password?: string; // Optional for Google auth users
  firstName: string;
  lastName: string;
  googleId?: string; // Only for Google-authenticated users
  provider: "local" | "google"; // Tracks login method
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function (this: UserType) {
      return this.provider === "local"; // Only required for local users
    },
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows nulls but enforces uniqueness
  },
  provider: {
    type: String,
    required: true,
    enum: ["local", "google"],
    default: "local",
  },
});

const User = mongoose.model<UserType>("User", userSchema);
export default User;

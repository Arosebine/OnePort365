const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName must be Provided"],
      trim: true,
      match: [/^\w+$/, "Please enter a valid firstName"],
    },
    lastName: {
      type: String,
      required: [true, "lastName must be Provided"],
      trim: true,
      match: [/^\w+$/, "Please enter a valid lastName"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    isEmailActive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      match: /[0-9]{10}/
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
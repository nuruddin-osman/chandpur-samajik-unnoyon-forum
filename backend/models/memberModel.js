const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 16, max: 100 },
    dateOfBirth: { type: Date, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    nid: { type: String, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, sparse: true },
    village: { type: String, required: true },
    houseName: { type: String, required: true },
    occupation: {
      type: String,
      required: true,
      enum: ["student", "employee", "student_employee", "others"],
    },
    memberType: {
      type: String,
      required: true,
      enum: ["paid", "non-paid"],
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["member", "admin"], default: "member" },
  },
  { timestamps: true },
);

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;

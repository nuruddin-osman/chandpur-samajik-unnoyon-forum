const mongoose = require("mongoose");

const committeeSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: [
        "President",
        "Vice President",
        "General Secretary",
        "Assistant Secretary",
        "Treasurer",
        "Organizing Secretary",
        "Publicity Secretary",
        "Sports Secretary",
      ],
    },
    session: { type: String, required: true }, // "2024-2025"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Committee = mongoose.model("Committee", committeeSchema);

module.exports = Committee;

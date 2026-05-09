// chandaModel.js

const mongoose = require("mongoose");

const chandaSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    month: { type: String, required: true }, // "2025-01"
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["paid", "due"],
      default: "due",
    },
    paidAt: { type: Date },
    note: { type: String, trim: true },
  },
  { timestamps: true },
);

// same member এ same month এ duplicate হবে না
chandaSchema.index({ memberId: 1, month: 1 }, { unique: true });

const Chanda = mongoose.model("Chanda", chandaSchema);

module.exports = Chanda;

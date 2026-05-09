// dChandaModel.js;

const mongoose = require("mongoose");

const chandaSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    month: { type: String, required: true }, // "2026-02"
    amount: { type: Number, required: true, default: 100 },
    status: {
      type: String,
      enum: ["paid", "due"],
      default: "due",
    },
    paidAt: { type: Date, default: null },
    note: { type: String, trim: true },
  },
  { timestamps: true },
);

// duplicate হবে না
chandaSchema.index({ memberId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("DChanda", chandaSchema);

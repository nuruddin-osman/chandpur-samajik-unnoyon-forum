// chandaController.js

const Chanda = require("../models/chandaModel");
const Member = require("../models/memberModel");

// helper → member paid type কিনা check
const isPaidMember = async (memberId) => {
  const member = await Member.findById(memberId).select("memberType");
  return member?.memberType === "paid";
};

// POST → নতুন chanda record (admin)
exports.createChanda = async (req, res) => {
  try {
    const { memberId, month, amount, status, note } = req.body;

    if (!(await isPaidMember(memberId))) {
      return res
        .status(400)
        .json({ message: "শুধু paid সদস্যের চাঁদা রেকর্ড হবে" });
    }

    const chanda = await Chanda.create({
      memberId,
      month,
      amount,
      status: status || "due",
      paidAt: status === "paid" ? new Date() : null,
      note,
    });

    await chanda.populate("memberId", "fullName phone");

    res.status(201).json({ message: "চাঁদা রেকর্ড হয়েছে", chanda });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "এই মাসের রেকর্ড ইতোমধ্যে আছে" });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET → সব paid member এর সব record (admin)
exports.getAllChanda = async (req, res) => {
  try {
    const { month, status } = req.query; // ?month=2025-01&status=due

    const filter = {};
    if (month) filter.month = month;
    if (status) filter.status = status;

    const records = await Chanda.find(filter)
      .populate("memberId", "fullName phone")
      .sort({ month: -1 });

    // summary
    const totalPaid = records
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalDue = records
      .filter((r) => r.status === "due")
      .reduce((sum, r) => sum + r.amount, 0);

    res.json({ total: records.length, totalPaid, totalDue, records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET → একজন member এর সব record (member নিজে দেখবে)
exports.getMemberChanda = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!(await isPaidMember(memberId))) {
      return res
        .status(400)
        .json({ message: "শুধু paid সদস্যের চাঁদা দেখা যাবে" });
    }

    const records = await Chanda.find({ memberId }).sort({ month: -1 });

    const totalPaid = records
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalDue = records
      .filter((r) => r.status === "due")
      .reduce((sum, r) => sum + r.amount, 0);

    res.json({ totalPaid, totalDue, records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH → status update — due → paid (admin)
exports.updateChanda = async (req, res) => {
  try {
    const { status, amount, note } = req.body;

    const updates = { status, note };
    if (amount) updates.amount = amount;
    if (status === "paid") updates.paidAt = new Date();
    if (status === "due") updates.paidAt = null;

    const chanda = await Chanda.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("memberId", "fullName phone");

    if (!chanda)
      return res.status(404).json({ message: "রেকর্ড পাওয়া যায়নি" });

    res.json({ message: "আপডেট সফল", chanda });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE → record delete (admin)
exports.deleteChanda = async (req, res) => {
  try {
    const chanda = await Chanda.findByIdAndDelete(req.params.id);
    if (!chanda)
      return res.status(404).json({ message: "রেকর্ড পাওয়া যায়নি" });

    res.json({ message: "রেকর্ড মুছে ফেলা হয়েছে" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

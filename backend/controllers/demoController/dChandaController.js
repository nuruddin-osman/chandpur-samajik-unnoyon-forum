// dChandaController.js

const dChandaModel = require("../../models/demoModels/dChandaModel");
const Member = require("../../models/memberModel");
const createMonthlyChanda = require("../../utils/dChandaCron");

// POST → admin — manually record create (past/current month)
exports.createChanda = async (req, res) => {
  try {
    const { memberId, month, amount, status, note } = req.body;

    // paid member কিনা check
    const member = await Member.findById(memberId).select(
      "memberType fullName",
    );
    if (!member || member.memberType !== "paid") {
      return res
        .status(400)
        .json({ message: "শুধু paid সদস্যের চাঁদা রেকর্ড হবে" });
    }

    const chanda = await dChandaModel
      .findOneAndUpdate(
        { memberId, month },
        {
          $setOnInsert: {
            memberId,
            month,
            amount: amount || 50,
            status: status || "due",
            paidAt: status === "paid" ? new Date() : null,
            note: note || "",
          },
        },
        { upsert: true, new: true },
      )
      .populate("memberId", "fullName phone");

    res.status(201).json({ message: "চাঁদা রেকর্ড হয়েছে", chanda });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "এই মাসের রেকর্ড ইতোমধ্যে আছে" });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET → admin — search with month + year filter
exports.getAllChanda = async (req, res) => {
  try {
    const { month, year, status } = req.query;

    const filter = {};

    // month + year একসাথে দিলে → "2026-02"
    if (year && month) {
      filter.month = `${year}-${month.padStart(2, "0")}`;
    } else if (year) {
      // শুধু year দিলে → "2026" দিয়ে শুরু হওয়া সব
      filter.month = { $regex: `^${year}` };
    } else if (month) {
      // শুধু month দিলে → সব বছরের ওই মাস
      filter.month = { $regex: `-${month.padStart(2, "0")}$` };
    }

    if (status) filter.status = status;

    const records = await dChandaModel
      .find(filter)
      .populate("memberId", "fullName phone")
      .sort({ month: -1 });

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

// GET → member নিজের record দেখবে
exports.getMemberChanda = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Member.findById(memberId).select("memberType");
    if (!member || member.memberType !== "paid") {
      return res
        .status(400)
        .json({ message: "শুধু paid সদস্যের চাঁদা দেখা যাবে" });
    }

    const { month, year, status } = req.query;

    const filter = { memberId };

    // month + year একসাথে দিলে → "2026-02"
    if (year && month) {
      filter.month = `${year}-${month.padStart(2, "0")}`;
    } else if (year) {
      // শুধু year দিলে → "2026" দিয়ে শুরু হওয়া সব
      filter.month = { $regex: `^${year}` };
    } else if (month) {
      // শুধু month দিলে → সব বছরের ওই মাস
      filter.month = { $regex: `-${month.padStart(2, "0")}$` };
    }

    if (status) filter.status = status;

    // const records = await dChandaModel.find({ memberId }).sort({ month: -1 });
    const records = await dChandaModel
      .find(filter)
      .populate("memberId", "fullName phone")
      .sort({ month: -1 });

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

// PATCH → admin — due → paid করবে
exports.updateChanda = async (req, res) => {
  try {
    const { status, amount, note } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (amount) updates.amount = amount;
    if (note) updates.note = note;
    if (status === "paid") updates.paidAt = new Date();
    if (status === "due") updates.paidAt = null;

    const chanda = await dChandaModel
      .findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
      .populate("memberId", "fullName phone");

    if (!chanda)
      return res.status(404).json({ message: "রেকর্ড পাওয়া যায়নি" });

    res.json({ message: "আপডেট সফল", chanda });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE → admin — record delete
exports.deleteChanda = async (req, res) => {
  try {
    const chanda = await dChandaModel.findByIdAndDelete(req.params.id);
    if (!chanda)
      return res.status(404).json({ message: "রেকর্ড পাওয়া যায়নি" });

    res.json({ message: "রেকর্ড মুছে ফেলা হয়েছে" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET → cron manual test (development only)
exports.runCronManually = async (req, res) => {
  try {
    await createMonthlyChanda();
    res.json({ message: "Cron manually run হয়েছে" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

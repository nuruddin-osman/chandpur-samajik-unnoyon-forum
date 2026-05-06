const Committee = require("../models/committeeModel");
const Member = require("../models/memberModel");

// POST → member কে committee তে add করো
exports.addToCommittee = async (req, res) => {
  try {
    const { memberId, position, session } = req.body;

    // member আছে কিনা check
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
    }

    // same session এ same position আছে কিনা check
    const exists = await Committee.findOne({
      position,
      session,
      isActive: true,
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: `${position} পদে ইতোমধ্যে কেউ আছেন` });
    }

    const committee = await Committee.create({ memberId, position, session });
    await committee.populate("memberId", "fullName phone profileImage");

    res.status(201).json({ message: "কমিটিতে যোগ করা হয়েছে", committee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET → active committee list
exports.getActiveCommittee = async (req, res) => {
  try {
    const { session } = req.query; // ?session=2024-2025

    const filter = { isActive: true };
    if (session) filter.session = session;

    const committee = await Committee.find(filter)
      .populate("memberId", "fullName phone profileImage village")
      .sort({ createdAt: 1 });

    res.json({ total: committee.length, committee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH → পদ পরিবর্তন বা session update
exports.updateCommitteeMember = async (req, res) => {
  try {
    const updated = await Committee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("memberId", "fullName phone profileImage");

    if (!updated) return res.status(404).json({ message: "পাওয়া যায়নি" });

    res.json({ message: "আপডেট সফল", committee: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE → committee থেকে সরাও
exports.removeFromCommittee = async (req, res) => {
  try {
    const deleted = await Committee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "পাওয়া যায়নি" });

    res.json({ message: "কমিটি থেকে সরানো হয়েছে" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

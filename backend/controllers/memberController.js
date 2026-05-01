const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Member = require("../models/memberModel");
const Notification = require("../models/notification");

// POST /api/members/register
exports.registerMember = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const exists = await Member.findOne({ phone: rest.phone });
    if (exists)
      return res
        .status(409)
        .json({ message: "এই ফোন নম্বর ইতোমধ্যে নিবন্ধিত" });

    const hashed = await bcrypt.hash(password, 10);
    const member = await Member.create({ ...rest, password: hashed });

    if (member.role !== "admin") {
      await Notification.create({
        memberId: member._id,
        message: `নতুন সদস্য নিবন্ধনের অনুরোধ: ${member.fullName} (${member.phone})`,
      });
    }

    res.status(201).json({
      message: "নিবন্ধন সফল। Admin অনুমোদনের পর আপনার একাউন্ট সক্রিয় হবে।",
      member: { ...member.toObject(), password: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/members/login
exports.loginMember = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const member = await Member.findOne({ phone }).select("+password");
    if (!member)
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });

    //  Status check
    if (member.status === "unverified")
      return res
        .status(403)
        .json({ message: "আপনার একাউন্ট এখনো অনুমোদিত হয়নি" });

    if (member.status === "rejected")
      return res
        .status(403)
        .json({ message: "আপনার নিবন্ধন প্রত্যাখ্যাত হয়েছে" });

    const match = await bcrypt.compare(password, member.password);
    if (!match) return res.status(401).json({ message: "পাসওয়ার্ড ভুল" });

    const token = jwt.sign(
      { id: member._id, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ message: "লগইন সফল", token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/members  (admin only)
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password");
    res.json({ total: members.length, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/members/:id
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select("-password");
    if (!member)
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/members/type/:memberType  → paid বা non-paid
exports.getMembersByType = async (req, res) => {
  try {
    const { memberType } = req.params;
    if (!["paid", "non-paid"].includes(memberType))
      return res
        .status(400)
        .json({ message: "memberType অবশ্যই paid অথবা non-paid হতে হবে" });

    const members = await Member.find({ memberType }).select("-password");
    res.json({ type: memberType, total: members.length, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/members/:id
exports.updateMember = async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const member = await Member.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!member)
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
    res.json({ message: "আপডেট সফল", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/members/:id  (admin only)
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member)
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
    res.json({ message: "সদস্য মুছে ফেলা হয়েছে" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

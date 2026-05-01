const Member = require("../models/memberModel");
const Notification = require("../models/notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate({
        path: "memberId",
        match: { role: "member", status: "unverified" },
        select: "fullName phone village memberType createdAt",
      })
      .sort({ createdAt: -1 });

    // populate match dont match memberId null, then remove it
    const filtered = notifications.filter((n) => n.memberId !== null);

    res.json({ notifications: filtered });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/members/:id/approve  — Approve
exports.approveMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { role: "member", status: "verified" },
      { new: true },
    );
    if (!member)
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });

    // Notification টা read করা হয়েছে mark করো
    await Notification.findOneAndUpdate(
      { memberId: member._id },
      { isRead: true },
    );

    res.json({
      message: `${member.fullName} কে অনুমোদন দেওয়া হয়েছে`,
      member,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/members/:id/reject  — Reject
exports.rejectMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { role: "member", status: "rejected" },
      { new: true },
    );
    if (!member)
      return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });

    await Notification.findOneAndUpdate(
      { memberId: member._id },
      { isRead: true },
    );

    res.json({ message: `${member.fullName} কে প্রত্যাখ্যান করা হয়েছে` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

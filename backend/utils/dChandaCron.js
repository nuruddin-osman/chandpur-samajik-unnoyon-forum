// dChandaCron.js

const cron = require("node-cron");
const Member = require("../models/memberModel");
const dChandaModel = require("../models/demoModels/dChandaModel");

const createMonthlyChanda = async () => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const members = await Member.find({
      memberType: "paid",
      status: "verified",
    }).select("_id");

    for (const member of members) {
      await dChandaModel.findOneAndUpdate(
        { memberId: member._id, month: currentMonth },
        {
          $setOnInsert: {
            memberId: member._id,
            month: currentMonth,
            amount: 50,
            status: "due",
          },
        },
        { upsert: true },
      );
    }

    console.log(`✅ ${currentMonth} মাসের চাঁদা record তৈরি হয়েছে`);
  } catch (err) {
    console.error("Cron error:", err.message);
  }
};

// প্রতি মাসের ১ তারিখ রাত ১২টায়
cron.schedule("0 0 1 * *", createMonthlyChanda);

module.exports = createMonthlyChanda;

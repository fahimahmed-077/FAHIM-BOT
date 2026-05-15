const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "sstimer",
  version: "6.0",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "⏰ নির্দিষ্ট সময়ে ছবি সহ অটো মেসেজ",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onStart = async function ({ api }) {

  // 🔒 AUTHOR LOCK
  if (module.exports.config.author !== "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ") {
    console.error("❌ Author নাম পরিবর্তন করা হয়েছে");
    process.exit(1);
  }

  const targetTime = "08:30 PM";

  const messageText = `༐༐ꓸ⃟༐༐ 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐘𝐊𝐔𝐌 ༐༐ꓸ⃟༐༐
━━━━━━━━━━━━━━━━━━━━━━━
⎯͢♡⸙𝐁𝐋𝐀𝐂𝐊💠𝐒𝐓𝐀𝐑💠𝐀𝐋𝐋💠𝐂𝐄𝐎💠𝐁𝐎𝐗✺❥᭄
━━━━━━━━━━━━━━━━━━━━━━━
📢 𝐒𝐒 𝐓𝐈𝐌𝐄 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓
━━━━━━━━━━━━━━━━━━━━━━━
⏰ 𝐓𝐈𝐌𝐄:
👉 রাত 7:00 PM ➜ 8:00 PM 💯
━━━━━━━━━━━━━━━━━━━━━━━
🔰 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓 𝐑𝐔𝐋𝐄𝐒
━━━━━━━━━━━━━━━━━━━━━━━
✔ সবাইকে অবশ্যই কলে থাকতে হবে
✔ সময়মতো উপস্থিত থাকা বাধ্যতামূলক
✔ SS TIME এ সবাই অ্যাকটিভ থাকতে হবে
━━━━━━━━━━━━━━━━━━━━━━━
🚫 𝐒𝐓𝐑𝐈𝐂𝐓 𝐖𝐀𝐑𝐍𝐈𝐍𝐆
━━━━━━━━━━━━━━━━━━━━━━━
❌ এই সময়ে কোনো SMS করা যাবে না
⛔ SMS করলে সরাসরি রিমুভ করা হবে
💥 Admin সিদ্ধান্তই ফাইনাল
━━━━━━━━━━━━━━━━━━━━━━━
👑 𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐓𝐄𝐀𝐌
━━━━━━━━━━━━━━━━━━━━━━━
📌 সব সিদ্ধান্ত Admin Team এর অধীনে
⚠️ নিয়ম না মানলে ব্যবস্থা নেওয়া হবে
━━━━━━━━━━━━━━━━━━━━━━━
╔╦═══════════════════╦╗
❤️ 𝐀𝐋𝐋 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 ❤️
❤️⚘ཻ͜͡♡ @EX Nahid ♡⚘͜͡❤️
╚╩═══════════════════╩╝`;

  const imageUrl = "https://i.imgur.com/jh45907.jpeg";

  const cacheDir = path.join(__dirname, "cache");

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const imagePath = path.join(cacheDir, "sstimer.jpg");

  // image download
  async function downloadImage() {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(imagePath, Buffer.from(response.data));
    } catch (e) {
      console.log("❌ Image Download Failed");
    }
  }

  await downloadImage();

  if (!global.sstimerSent) global.sstimerSent = {};

  setInterval(async () => {

    const now = moment()
      .tz("Asia/Dhaka")
      .format("hh:mm A");

    const today = moment()
      .tz("Asia/Dhaka")
      .format("DD/MM/YYYY");

    if (now !== targetTime) return;

    try {

      const threads = await api.getThreadList(
        100,
        null,
        ["INBOX"]
      );

      const groups = threads.filter(
        t => t.isGroup && t.threadID
      );

      for (const thread of groups) {

        const key = `${thread.threadID}_${today}_${now}`;

        if (global.sstimerSent[key]) continue;

        global.sstimerSent[key] = true;

        api.sendMessage(
          {
            body: messageText,
            attachment: fs.createReadStream(imagePath)
          },
          thread.threadID
        );
      }

      console.log("✅ SS TIMER SENT:", now);

    } catch (err) {
      console.log("❌ TIMER ERROR:", err);
    }

  }, 60000);

  console.log("✅ SSTIMER RUNNING...");
};

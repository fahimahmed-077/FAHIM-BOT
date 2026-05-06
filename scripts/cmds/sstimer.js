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

module.exports.onLoad = async function ({ api }) {

  // 🔒 author lock
  if (module.exports.config.author !== "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ") {
    console.error("❌ Author নাম পরিবর্তন করা হয়েছে।");
    return process.exit(1);
  }

  // ✅ শুধু একটাই টাইম
  const targetTime = "8:30 PM";

  const messageText = "༐༐ꓸ⃟༐༐ 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐘𝐊𝐔𝐌 ༐༐ꓸ⃟༐༐\n━━━━━━━━━━━━━━━━━━━━━━━\n••═╬🔥𝐏𝐑𝐄𝐌✦🌻IK🔥✦𝐏𝐀KHI🔥✦🅰𝐋𝐋🔥✦MUSIC✦🌻BAND🔥╬═••࿐\n━━━━━━━━━━━━━━━━━━━━━━━\n📢 𝐒𝐒 𝐓𝐈𝐌𝐄 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓\n━━━━━━━━━━━━━━━━━━━━━━━\n⏰ 𝐓𝐈𝐌𝐄:\n👉 রাত 8:30 PM ➜ 9:30 PM 💯\n━━━━━━━━━━━━━━━━━━━━━━━\n🔰 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓 𝐑𝐔𝐋𝐄𝐒\n━━━━━━━━━━━━━━━━━━━━━━━\n✔ সবাইকে অবশ্যই কলে থাকতে হবে  \n✔ সময়মতো উপস্থিত থাকা বাধ্যতামূলক  \n✔ SS TIME এ সবাই অ্যাকটিভ থাকতে হবে\n━━━━━━━━━━━━━━━━━━━━━━━\n🚫 𝐒𝐓𝐑𝐈𝐂𝐓 𝐖𝐀𝐑𝐍𝐈𝐍𝐆\n━━━━━━━━━━━━━━━━━━━━━━━\n❌ এই সময়ে কোনো SMS করা যাবে না  \n⛔ SMS করলে সরাসরি রিমুভ করা হবে  \n💥 Admin সিদ্ধান্তই ফাইনাল\n━━━━━━━━━━━━━━━━━━━━━━━\n👑 𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐓𝐄𝐀𝐌\n━━━━━━━━━━━━━━━━━━━━━━━\n📌 সব সিদ্ধান্ত Admin Team এর অধীনে  \n⚠️ নিয়ম না মানলে ব্যবস্থা নেওয়া হবে\n━━━━━━━━━━━━━━━━━━━━━━━\n╔╦═══════════════════╦╗\n❤️ 𝐀𝐋𝐋 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 ❤️\n❤️⚘ཻ͜͡♡ 𝐑𝐀𝐅𝐒𝐀𝐍 ♡⚘͜͡❤️\n╚╩═══════════════════╩╝";

  const imageUrl = "https://i.imgur.com/BJu6JNZ.jpeg";

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  if (!global.__sentMap) global.__sentMap = {};

  const checkTimeAndSend = async () => {
    const now = moment().tz("Asia/Dhaka").format("hh:mm A");

    if (now !== targetTime) return;

    const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

    const imagePath = path.join(cacheDir, "image.jpg");

    // 📥 download image
    if (!fs.existsSync(imagePath)) {
      try {
        const res = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, Buffer.from(res.data));
      } catch (err) {
        console.error("Image download failed:", err);
        return;
      }
    }

    const msg =
`${messageText}`;

    try {
      const allThreads = await api.getThreadList(1000, null, ["INBOX"]);

      const groups = [...new Map(allThreads.map(t => [t.threadID, t])).values()]
        .filter(t => t.isGroup);

      for (const thread of groups) {
        const key = `${thread.threadID}_${now}`;
        if (global.__sentMap[key]) continue;

        global.__sentMap[key] = true;

        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(imagePath)
        }, thread.threadID);
      }

      console.log("✅ Sent:", now);

    } catch (e) {
      console.error("❌ Error:", e);
    }
  };

  setInterval(checkTimeAndSend, 60000);
};

module.exports.onStart = () => {};

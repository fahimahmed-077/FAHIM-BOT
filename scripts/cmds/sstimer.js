const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "sstimer",
  version: "6.0",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "08:30 PM SS Notice + Warning System",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  const imageUrl = "https://i.imgur.com/BJu6JNZ.jpeg";

  if (!global.__sentMap) global.__sentMap = {};

  const sendAuto = async () => {

    const now = moment().tz("Asia/Dhaka").format("hh:mm A");

    if (now !== "08:30 PM") return;

    const key = `SS_0830_${now}`;
    if (global.__sentMap[key]) return;
    global.__sentMap[key] = true;

    const mainMsg = `༐༐ꓸ⃟༐༐ 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐘𝐊𝐔𝐌 ༐༐ꓸ⃟༐༐━━━━━━━━━━━━━━━━━━━━━━━ ••═╬🔥𝐏𝐑𝐄𝐌✦🌻IK🔥✦𝐏𝐀KHI🔥✦🅰𝐋𝐋🔥✦MUSIC✦🌻BAND🔥╬═••࿐
━━━━━━━━━━━━━━━━━━━━━━━
  📢 𝐒𝐒 𝐓𝐈𝐌𝐄 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓
━━━━━━━━━━━━━━━━━━━━━━━
⏰ 𝐓𝐈𝐌𝐄:
👉 রাত 8:30 PM ➜ 9:30 PM 💯
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
           ❤️⚘ཻ͜͡♡ 𝐑𝐀𝐅𝐒𝐀𝐍 ♡⚘͜͡❤️  
╚╩═══════════════════╩╝`;

    const warnMsg = `🚫 𝐀𝐋𝐄𝐑𝐓 🚫

⛔ আগামী 10 মিনিট কেউ কোনো SMS দিবে না!
💥 যদি কেউ নিয়ম ভাঙে তাহলে তাকে গ্রুপ থেকে রিমুভ করা হবে

✅ Admin decision final`;

    try {
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });

      const threads = await api.getThreadList(1000, null, ["INBOX"]);
      const groups = [...new Map(threads.map(t => [t.threadID, t])).values()]
        .filter(t => t.isGroup);

      for (const g of groups) {

        // 1st message (image + notice)
        api.sendMessage({
          body: mainMsg,
          attachment: img.data
        }, g.threadID);

        // 2nd message after 2 seconds
        setTimeout(() => {
          api.sendMessage(warnMsg, g.threadID);
        }, 2000);
      }

      console.log("✅ 08:30 SS messages sent");

    } catch (e) {
      console.error(e);
    }
  };

  setInterval(sendAuto, 60000);
};

module.exports.onStart = () => {};

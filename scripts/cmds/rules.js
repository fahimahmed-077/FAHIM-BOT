const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "rules",
    version: "1.3.1",
    author: "Farhan-Khan",
    role: 0,
    shortDescription: "rules information with image",
    category: "Information",
    guide: {
      en: "rules"
    }
  },

  onStart: async function ({ api, event }) {
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const imgLink = "https://i.imgur.com/zHivkUd.jpeg";

    // group name safe fallback
    let groupName = "GROUP RULES";
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      groupName = threadInfo.threadName || "GROUP RULES";
    } catch (e) {
      groupName = "GROUP RULES";
    }

    const ownerText = `‎╔═════════════════════╗
‎          ⚠️❌ 𝐑𝐔𝐋𝐄𝐒 𝐅𝐎𝐑 ❌⚠️
‎╚═════════════════════╝
‎                           👇👇
‎${groupName}
‎
‎✦────────────────────✦
‎           𝐆𝐫𝐨𝐮𝐩 এ চলার নিয়ম👇👇  
‎✦────────────────────✦
‎
‎══════════════════════
‎➤ ⚠️....গ্রুপ থেকে  কাউকে  inbox করা যাবে না...Friend request দেওয়া যাবে না...📴❌
‎‎══════════════════════
‎➤ ⚠️⚠️18+কথা বা পিক ভিডিও দেওয়া  যাবে না ....📴❌
‎‎══════════════════════
‎➤ ✅প্রতিদিন গ্রুপে  সময় দিতে হবে.....✅🌻
‎‎══════════════════════
‎➤ ⚠️⚠️এক টানা ২ দিন গ্রুপে না আসলে কিক দেওয়া হবে ... আপনি যখন আবার গ্রুপে সময় দিতে পারবেন.... তখন এডমিন কে বলবেন আপনাকে আবার অ্যাড করে দেওয়া হবে✅✅
‎‎══════════════════════
‎➤ ২ বার এর বেশি লিভ নিলে ৩য় বার এড করা হবে না
‎══════════════════════
‎➤ ⚠️⚠️..... Admin text Off রাখতে বললে text off রাখতে হবে..✅
‎‎══════════════════════
‎➤ ও আমাদের বক্সে প্রতিদিন কলে ৩ থেকে ৪ ঘন্টা সময় দিতে হবে  🙏
‎‎══════════════════════
‎➤ ও আমাদের বক্সের এস এস টাইম বাধ্যতামূলক কলে থাকতেই হবে 🙏🙏
‎‎══════════════════════
‎➤ ❌৩ টার বেশি ইমোজি দেওয়া যাবে না ❌
‎‎══════════════════════
‎➤ আমাদের বক্সে থাকতে হলে লোগো মাস্ট লোগো পরতেই হবে✅
‎‎══════════════════════
‎➤ ভিডিও কল বা স্ক্রিন শেয়ার চালু করা সম্পূর্ণ নিষেধ ⚠️⚠️
‎‎══════════════════════
‎➤ গ্ৰুপের ভিতরে কোনো ধরনের গেমের কথা বা লিংক দেওয়া যাবে না বাহিরের কোন এস এস দেওয়া যাবে না 
‎‎══════════════════════
‎➤ গ্ৰুপের পিক বা নাম অথবা থিম চেন্জ করা যাবে না ⚠️⚠️
‎‎══════════════════════
‎➤ গ্ৰুপে প্রেম পিরিতি নট এলাউ ⚠️😓
‎‎══════════════════════
‎➤ কোনো সমস্যা হলে মেম্বারদের কাছে না বলে  admin কে জানাবেন ... ✅✅
‎‎══════════════════════
‎⚠️⚠️..... কোনো কারনে রিমুভ হলে  এডমিন দোষি না.... বিনা কারনে কাউকে রিমুভ করা হবে না🌺 ✅
‎══════════════════════
‎✦────────────────────✦
‎           ∙──༅༎ 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 ༎༅──∙
‎✦────────────────────✦`;

    try {
      const res = await axios({
        url: imgLink,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(imgPath);
      res.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: ownerText,
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID,
          () => {
            try {
              fs.unlinkSync(imgPath);
            } catch (e) {}
          },
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage(ownerText, event.threadID, event.messageID);
      });

    } catch (err) {
      api.sendMessage(ownerText, event.threadID, event.messageID);
    }
  }
};

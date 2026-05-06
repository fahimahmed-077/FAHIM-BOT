const axios = require("axios");

let imageIndex = 0;

module.exports = {
  config: {
    name: "rules",
    version: "20.0.0",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Fast caption + image reply",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    // 🔒 Author lock
    if (this.config.author !== "Farhan-Khan") return;

    const admins = [
      {
        uid: "",
        names: ["Rules", "rules"]
      }
    ];

    const senderID = String(event.senderID);

    // ❌ Admin ignore
    if (admins.some(a => a.uid === senderID)) return;

    // ✅ ONLY EXACT MATCH /rules
    const text = (event.body || "").trim().toLowerCase();
    if (text !== "/rules") return;

    const mentionedIDs = Object.keys(event.mentions || {});

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 🖼️ Image list
    const images = [
      "https://i.imgur.com/zHivkUd.jpeg"
    ];

    const imageUrl = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

    // ✍️ captions
    const captions = [
`‎‎╔═══════════════════╗
‎        ⚠️❌ 𝐑𝐔𝐋𝐄𝐒 𝐅𝐎𝐑 ❌⚠️
‎╚═══════════════════╝
‎                          👇👇
‎••═╬🔥𝐏𝐑𝐄𝐌✦🌻IK🔥✦𝐏𝐀KHI🔥✦🅰𝐋𝐋🔥✦MUSIC✦🌻BAND🔥╬═••࿐
‎✦───────────────────✦
‎          𝐆𝐫𝐨𝐮𝐩 এ চলার নিয়ম👇👇  
‎✦───────────────────✦
‎
‎═════════════════════
‎➤ ⚠️....গ্রুপ থেকে  কাউকে  inbox করা যাবে না...Friend request দেওয়া যাবে না...📴❌
‎‎═════════════════════
‎➤ ⚠️⚠️18+কথা বা পিক ভিডিও দেওয়া  যাবে না ....📴❌
‎‎═════════════════════
‎➤ ✅প্রতিদিন গ্রুপে  সময় দিতে হবে.....✅🌻
‎‎═════════════════════
‎➤ ⚠️⚠️এক টানা ২ দিন গ্রুপে না আসলে কিক দেওয়া হবে ... আপনি যখন আবার গ্রুপে সময় দিতে পারবেন.... তখন এডমিন কে বলবেন আপনাকে আবার অ্যাড করে দেওয়া হবে✅✅
‎‎═════════════════════
‎➤ ২ বার এর বেশি লিভ নিলে ৩য় বার এড করা হবে না
‎═════════════════════
‎➤ ⚠️⚠️..... Admin text Off রাখতে বললে text off রাখতে হবে..✅
‎‎═════════════════════
‎➤ ও আমাদের বক্সে প্রতিদিন কলে ৩ থেকে ৪ ঘন্টা সময় দিতে হবে  🙏
‎‎═════════════════════
‎➤ ও আমাদের বক্সের এস এস টাইম বাধ্যতামূলক কলে থাকতেই হবে 🙏🙏
‎‎═════════════════════
‎➤ ❌৩ টার বেশি ইমোজি দেওয়া যাবে না ❌
‎‎═════════════════════
‎➤ আমাদের বক্সে থাকতে হলে লোগো মাস্ট লোগো পরতেই হবে✅
‎‎═════════════════════
‎➤ ভিডিও কল বা স্ক্রিন শেয়ার চালু করা সম্পূর্ণ নিষেধ ⚠️⚠️
‎‎═════════════════════
‎➤ গ্ৰুপের ভিতরে কোনো ধরনের গেমের কথা বা লিংক দেওয়া যাবে না বাহিরের কোন এস এস দেওয়া যাবে না 
‎‎═════════════════════
‎➤ গ্ৰুপের পিক বা নাম অথবা থিম চেন্জ করা যাবে না ⚠️⚠️
‎‎═════════════════════
‎➤ গ্ৰুপে প্রেম পিরিতি নট এলাউ ⚠️😓
‎‎═════════════════════
‎➤ কোনো সমস্যা হলে মেম্বারদের কাছে না বলে  admin কে জানাবেন ... ✅✅
‎‎═════════════════════
‎⚠️⚠️..... কোনো কারনে রিমুভ হলে  এডমিন দোষি না.... বিনা কারনে কাউকে রিমুভ করা হবে না🌺 ✅
‎═════════════════════
‎✦───────────────────✦
‎        ∙──༅༎ 𝐌𝐔𝐒𝐈𝐂-𝐁𝐎𝐓 ༎༅──∙
✦───────────────────✦`
    ];

    const captionText = captions[Math.floor(Math.random() * captions.length)];
    const caption = ` ${captionText} `;

    try {
      // ⚡ Fast Image Fetch
      const imgStream = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
        timeout: 10000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      await message.reply({
        body: caption,
        attachment: imgStream.data
      });

    } catch (err) {
      console.log("❌ Image error:", err.message);
      await message.reply("😢 পিক দিতে পারলাম না");
    }
  }
};

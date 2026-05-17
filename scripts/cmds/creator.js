const axios = require("axios");

let imageIndex = 0;

module.exports = {
  config: {
    name: "creator",
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
        uid: "61573319034946",
        names: ["Rafsan", "rafsan", "রাফসান", "〲রাফসান卝স্যার ཐི༏ཋྀ࿐"]
      }
    ];

    const senderID = String(event.senderID);

    // ❌ Admin ignore
    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase();
    const mentionedIDs = Object.keys(event.mentions || {});

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 🖼️ Image list
    const images = [
      "https://i.imgur.com/kLq7kFi.jpeg"
    ];

    const imageUrl = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

    // ✍️ captions
    const captions = [
      "মেনশন দিও না, ক্যারেক্টার স্যার এখন ব্যস্ত 😼💔",
      "ক্যারেক্টার স্যার অনলাইনে নেই, পরে আসবে 🥀",
      "ক্যারেক্টার স্যার কে মেনশন না দিয়ে কলে সাপোর্ট দেন ক্যারেক্টার সার ফ্রি হলে আসবে_!!♻️💥"
    ];

    const captionText = captions[Math.floor(Math.random() * captions.length)];

    const caption = `
✿•≫───────────────≪•✿
『 ${captionText} 』
✿•≫───────────────≪•✿
`;

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

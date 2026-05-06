const axios = require("axios");

let imageIndex = 0;

module.exports = {
  config: {
    name: "b_creator",
    version: "20.0.1",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Fast caption + image reply",
    category: "system"
  },

  onChat: async function ({ event, message }) {

    if (this.config.author !== "Farhan-Khan") return;

    const admins = [
      { uid: "61573315534946", names: ["নাঈম", "Naiyem", "naiyem"] },
    ];

    const senderID = String(event.senderID);
    const text = (event.body || "").toLowerCase();
    const mentionedIDs = Object.keys(event.mentions || {});

    // ❗ Fix: admin কে block না করে allow রাখা ভালো
    const isAdmin = admins.some(a => a.uid === senderID);

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    const images = [
      "https://i.imgur.com/BC0SqeM.jpeg"
    ];

    const imageUrl = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

    const captions = [
      "মেনশন দিও না, নাঈম স্যার এখন ব্যস্ত 😼💔",
      "নাঈম স্যার অনলাইনে নেই, পরে আসবে 🥀",
      "নাঈম স্যার কে মেনশন না দিয়ে কলে সাপোর্ট দেন ক্যারেক্টার সার ফ্রি হলে আসবে_!!♻️💥"
    ];

    const caption =
`✿•≫───────────────≪•✿
『 ${captions[Math.floor(Math.random() * captions.length)]} 』
✿•≫───────────────≪•✿`;

    try {
      const imgStream = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
        timeout: 5000
      });

      await message.reply({
        body: caption,
        attachment: imgStream.data,
        mentions: event.mentions || {}
      });

    } catch (err) {
      console.log("❌ Image error:", err.message);
      await message.reply("😢 পিক দিতে পারলাম না");
    }
  }
};

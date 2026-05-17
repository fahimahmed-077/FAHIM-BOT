const axios = require("axios");

// 🔒 HARD SECURITY CONFIG
const AUTHOR = "Farhan-Khan";
const COMMAND_NAME = "adminmention2";
const OWNER_UID = "61584807686126";
const EXPIRE_DATE = "2099-12-31";

module.exports = {
  config: {
    name: COMMAND_NAME,
    version: "10.0.0",
    author: AUTHOR,
    countDown: 0,
    role: 0,
    shortDescription: "Admin mention ultra fast voice",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {

    // ❌ AUTHOR + NAME LOCK
    if (
      this.config.author !== AUTHOR ||
      this.config.name !== COMMAND_NAME
    ) {
      return message.reply("⚠️ File Locked!");
    }

    // ❌ TIME LOCK
    if (new Date() > new Date(EXPIRE_DATE)) {
      return message.reply("⛔ File Expired!");
    }

    const admins = [
      { uid: "61589439339903", names: ["m ","im","Fm","ফম"] },
      { uid: "61589976056816", names: ["mahi"] }
    ];

    const senderID = String(event.senderID);
    const text = (event.body || "").toLowerCase();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    // ❌ admin নিজেকে mention করলে block
    if (
      admins.some(a => a.uid === senderID) &&
      mentionedIDs.includes(senderID)
    ) return;

    // ✅ mention detect
    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 🎤 VOICE LIST (FAST SERVER use করো)
    const voices = [
      "https://files.catbox.moe/yelby9.mp3",
      "https://files.catbox.moe/hcyy7h.mp3",
      "https://files.catbox.moe/w8wwmi.mp4",
      "https://files.catbox.moe/8zlf10.mp4"
    ];

    const voiceUrl = voices[Math.floor(Math.random() * voices.length)];

    try {
      // ⚡ DIRECT STREAM (NO SAVE = SUPER FAST)
      const res = await axios({
        url: voiceUrl,
        method: "GET",
        responseType: "stream",
        timeout: 10000
      });

      await message.reply({
        attachment: res.data
      });

    } catch (err) {
      console.log("VOICE ERROR:", err.message);
      message.reply("😢 ভয়েস লোড করা যায়নি");
    }
  }
};

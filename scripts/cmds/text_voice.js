const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Author Lock
const LOCKED_AUTHOR = "Farhan-Khan (🔒 Do Not Change)";

// 📂 Global control file
const controlFile = path.join(__dirname, "cache", "control.json");

module.exports = {
  config: {
    name: "text_voice",
    version: "5.0.0",
    author: "Farhan-Khan (🔒 Do Not Change)",
    countDown: 1,
    role: 0,
    shortDescription: "Voice + React + Seen + Global Control",
    longDescription: "Auto voice + react + seen + ON/OFF system",
    category: "system"
  },

  onStart: async function () {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      console.error("❌ Author changed! Script stopped.");
      process.exit(1);
    }

    if (!fs.existsSync(controlFile)) {
      fs.writeFileSync(controlFile, JSON.stringify({ active: true }));
    }
  },

  onChat: async function ({ event, api, message }) {
    if (!event.body || !event.messageID) return;

    const inputRaw = event.body.trim();
    const input = inputRaw.toLowerCase();

    // 📂 Load status
    let status = true;
    if (fs.existsSync(controlFile)) {
      status = JSON.parse(fs.readFileSync(controlFile)).active;
    }

    // 🔘 Commands
    if (input === "/autoreact off") {
      fs.writeFileSync(controlFile, JSON.stringify({ active: false }));
      return message.reply("❌ Auto React & Seen OFF (All Groups)");
    }

    if (input === "/autoreact on") {
      fs.writeFileSync(controlFile, JSON.stringify({ active: true }));
      return message.reply("✅ Auto React & Seen ON (All Groups)");
    }

    // ❌ Ignore prefix commands
    const prefixes = ["/", "!", "#"];
    if (prefixes.some(p => inputRaw.startsWith(p))) return;

    // 👀 Auto Seen
    if (status) {
      try {
        api.markAsRead(event.threadID);
      } catch (e) {}
    }

    // 😆 Auto React
    if (status) {
      try {
        const reactions = ["👍", "😆", "🔥", "❤️", "😎"];
        const randomReact = reactions[Math.floor(Math.random() * reactions.length)];
        api.setMessageReaction(randomReact, event.messageID, () => {}, true);
      } catch (e) {}
    }

    // 🎵 Voice Map
    const voiceMap = {
      "চুদি": "https://files.catbox.moe/ecgpak.mp4",
      "cudi": "https://files.catbox.moe/ecgpak.mp4",
      "chudi": "https://files.catbox.moe/ecgpak.mp4",
      "magi": "https://files.catbox.moe/ecgpak.mp4",
      "মাগি": "https://files.catbox.moe/ecgpak.mp4",
      "খানকি": "https://files.catbox.moe/ecgpak.mp4",
      "khanki": "https://files.catbox.moe/ecgpak.mp4",
      "sinior": "https://files.catbox.moe/twtfat.mp3",
      "valobasi": "https://files.catbox.moe/84fp4p.mp3",
      "mahira": "https://files.catbox.moe/3u6shs.mp3",
      "mahi": "https://files.catbox.moe/3u6shs.mp3",
      "মাহি": "https://files.catbox.moe/3u6shs.mp3",
      "good night": "https://files.catbox.moe/i29m4q.mp3",
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",
      "good morning": "https://files.catbox.moe/8gzqx5.mp3",
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",
      "i love you": "https://files.catbox.moe/y3fk8i.mp3",
      "love you": "https://files.catbox.moe/y3fk8i.mp3",
      "@everyone": "https://files.catbox.moe/3u6shs.mp3",
      "bye": "https://files.catbox.moe/fdqh2m.mp3",
      "by": "https://files.catbox.moe/fdqh2m.mp3",
      "বাই": "https://files.catbox.moe/fdqh2m.mp3",
      "বায়": "https://files.catbox.moe/fdqh2m.mp3"
    };

    // 🔍 STRICT WORD MATCH (main fix)
    for (const key in voiceMap) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(^|\\s)${escapedKey}(\\s|$)`, "i");

      if (pattern.test(inputRaw)) {
        const audioUrl = voiceMap[key];

        const cacheDir = path.join(__dirname, "cache", "voices");
        fs.ensureDirSync(cacheDir);

        const fileName = `${Buffer.from(key).toString("hex")}.mp3`;
        const filePath = path.join(cacheDir, fileName);

        try {
          if (fs.existsSync(filePath)) {
            return await message.reply({
              attachment: fs.createReadStream(filePath)
            });
          }

          const response = await axios.get(audioUrl, {
            responseType: "arraybuffer"
          });

          fs.writeFileSync(filePath, Buffer.from(response.data));

          return await message.reply({
            attachment: fs.createReadStream(filePath)
          });

        } catch (error) {
          console.error("Voice error:", error);
        }
      }
    }
  }
};

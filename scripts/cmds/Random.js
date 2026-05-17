const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "random",
    version: "2.5",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    description: "Send random Anime TikTok video",
    category: "media"
  },

  onStart: async function ({ message }) {
    try {
      await message.reply("⏳ Fetching random Anime video...");

      // অ্যানিমে রিলেটেড কি-ওয়ার্ড
      const keywords = ["anime edit", "anime amv", "aesthetic anime", "anime viral", "naruto edit", "one piece amv", "anime trend"];
      const randomKey = keywords[Math.floor(Math.random() * keywords.length)];

      const api = `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(randomKey)}&count=12`;
      const res = await axios.get(api);

      const videos = res.data?.data?.videos;
      if (!videos || videos.length === 0) {
        return message.reply("❌ No anime video found at the moment.");
      }

      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = randomVideo.play; // Watermark ছাড়া ভিডিও URL
      const title = randomVideo.title || "Random Anime Video";

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.ensureDirSync(cachePath);

      const filePath = path.join(cachePath, `anime_${Date.now()}.mp4`);

      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, response.data);

      await message.reply({
        body: `🎥 ⌜ 𝐀𝐧𝐢𝐦𝐞 𝐑𝐚𝐧𝐝𝐨𝐦 ⌟ 🎥\n\n📌 Title: ${title}\n✨ Enjoy your video!`,
        attachment: fs.createReadStream(filePath)
      });

      // পাঠানোর পর ফাইলটি ডিলিট করে দিবে
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to fetch Anime video. Please try again.");
    }
  }
};

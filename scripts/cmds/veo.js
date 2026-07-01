// veo.js // Goat Bot v2 style command: /veo [prompt] // Generates a video using mahbub-ullash.cyberbot.top txt2video API // Author: MOHAMMAD AKASH

const axios = require("axios"); const fs = require("fs-extra"); const path = require("path");

module.exports = { config: { name: "veo", version: "1.2.0", author: "ALVI-BOSS", role: 0, countDown: 5, shortDescription: "Generate a video from a text prompt 🎬", longDescription: "Use /veo [prompt] to generate a short AI video using mahbub-ullash API.", category: "ai-video" },

onStart: async function ({ api, event, args }) { try { const prompt = args.join(" ").trim(); if (!prompt) { return api.sendMessage( "❌ ব্যবহার: /veo <prompt>\nউদাহরণ: /veo A cute girl dancing in rain ☔", event.threadID, event.messageID ); }

const msg = await api.sendMessage(
    "🎥 ভিডিও তৈরি হচ্ছে, অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন...",
    event.threadID
  );

  const apiUrl = `https://mahbub-ullash.cyberbot.top/api/txt2video?prompt=${encodeURIComponent(prompt)}`;

  const response = await axios.get(apiUrl);
  const data = response.data || {};

  if (!data.status || !data.video) {
    return api.sendMessage(
      "❌ ভিডিও তৈরি করা যায়নি! API থেকে সঠিক ভিডিও লিংক পাওয়া যায়নি।",
      event.threadID,
      msg.messageID
    );
  }

  const videoUrl = data.video;
  const filePath = path.join(__dirname, `veo_${Date.now()}.mp4`);

  const videoStream = await axios.get(videoUrl, { responseType: "stream" });
  const writer = fs.createWriteStream(filePath);
  videoStream.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  await api.sendMessage(
    {
      body: `✅ ভিডিও তৈরি সম্পন্ন!\n🎬 Prompt: ${prompt}\n👨‍💻 Operator: ${data.operator || 'Unknown'}`,
      attachment: fs.createReadStream(filePath)
    },
    event.threadID,
    () => fs.unlinkSync(filePath)
  );
} catch (err) {
  console.error(err);
  return api.sendMessage(
    `❌ ত্রুটি ঘটেছে: ${err.message}`,
    event.threadID,
    event.messageID
  );
}

} };
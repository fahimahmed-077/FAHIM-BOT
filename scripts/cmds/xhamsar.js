const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xhamster",
    aliases: ["xh"],
    version: "4.0",
    author: "Aryan Chauhan",
    countDown: 10,
    role: 0,
    shortDescription: "Search and watch xHamster videos",
    longDescription: "Search xHamster videos and choose which one to watch",
    category: "18+",
    guide: "{pn} <keywords>"
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("⚠️ Please enter a search keyword.", event.threadID, event.messageID);

    const query = encodeURIComponent(args.join(" "));
    const url = `https://aryxapi.onrender.com/api/nsfw/xhamster?action=search&query=${query}`;

    try {
      const res = await axios.get(url);
      const results = res.data;

      if (!results || results.length === 0) {
        return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
      }

      const topNine = results.slice(0, 9);
      let msg = "🔞 XHamster Search Results:\n\n";

      topNine.forEach((video, index) => {
        msg += `${index + 1}. ${video.title}\n⏱ ${video.duration} | 📤 ${video.uploader}\n\n`;
      });

      const attachments = await Promise.all(
        topNine.map(async (video, i) => {
          try {
            const img = (await axios.get(video.thumbnail, { responseType: "stream" })).data;
            img.path = path.join(__dirname, `thumb_${i}.jpg`);
            return img;
          } catch {
            return null;
          }
        })
      );

      api.sendMessage({
        body: msg + "👉 Reply with the number (1-9) to download and watch the video.",
        attachment: attachments.filter(a => a)
      }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          messageID: info.messageID, // store search results msgID
          author: event.senderID,
          results: topNine
        });
      }, event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching results.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, results, messageID } = Reply;

    if (event.senderID !== author) return;

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > results.length) {
      return api.sendMessage("⚠️ Please reply with a valid number between 1 and 9.", event.threadID, event.messageID);
    }

    const selected = results[choice - 1];
    const detailUrl = `https://aryxapi.onrender.com/api/nsfw/xhamster?action=detail&url=${encodeURIComponent(selected.url)}`;

    try {
      const res = await axios.get(detailUrl);
      const data = res.data;

      const videoUrl = data.videoUrl;
      if (!videoUrl) return api.sendMessage("❌ Could not fetch video.", event.threadID, event.messageID);

      api.sendMessage("⏳ Processing video, please wait...", event.threadID, async (err, processingMsg) => {
        if (err) return;

        api.unsendMessage(messageID);

        const videoPath = path.join(__dirname, `xh_${Date.now()}.mp4`);
        const writer = fs.createWriteStream(videoPath);
        const response = await axios.get(videoUrl, { responseType: "stream" });
        response.data.pipe(writer);

        writer.on("finish", () => {
          api.sendMessage({
            body: `🎬 ${data.title}\n👁 Views: ${data.viewCount} | 👍 ${data.likePercentage}`,
            attachment: fs.createReadStream(videoPath)
          }, event.threadID, () => {
            fs.unlinkSync(videoPath);
            api.unsendMessage(processingMsg.messageID);
          }, event.messageID);
        });

        writer.on("error", () => {
          api.sendMessage("❌ Error downloading video.", event.threadID, event.messageID);
          api.unsendMessage(processingMsg.messageID);
        });
      });

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching video details.", event.threadID, event.messageID);
    }
  }
};
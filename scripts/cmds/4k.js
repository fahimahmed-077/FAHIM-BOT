const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale", "enhance"],
    version: "1.0.0",
    author: "Neoaz 🐦",
    cooldown: 10,
    role: 0,
    description: "Upscale images to 4k quality",
    category: "media",
    usage: "4k (reply to an image)"
  },

  onStart: async function ({ message, event, args, api }) {
    let imageUrl = null;

    if (event.type === "message_reply" && event.messageReply.attachments?.length > 0) {
      const att = event.messageReply.attachments[0];
      if (att.type === "photo") imageUrl = att.url;
    } else if (args[0] && args[0].startsWith("http")) {
      imageUrl = args[0];
    }

    if (!imageUrl) {
      return api.setMessageReaction("❌", event.messageID, () => {}, true);
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const form = new FormData();
      form.append("scale", "16");
      form.append("image", "");
      form.append("image_url", imageUrl);

      const response = await axios.post("https://nkximggen.onrender.com/api/enhance", form, {
        headers: {
          ...form.getHeaders(),
          "accept": "application/json"
        },
        timeout: 300000
      });

      const upscaledUrl = response.data?.data?.[0]?.url;
      if (!upscaledUrl) throw new Error("Upscale failed - no URL returned");

      await message.reply({
        body: "✅ | Image upscaled",
        attachment: upscaledUrl
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error('4k error:', error.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply("❌ | Failed to upscale image.");
    }
  }
};
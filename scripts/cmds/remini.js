const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "remini",
    version: "1.7",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    category: "AI",
    description: "Enhance or restore image quality using Remini AI.",
    guide: {
      en: "{pn} [url] or reply with image"
    }
  },

  onStart: async function ({ message, event, args }) {
    
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }
    const startTime = Date.now();
    let imgUrl;

    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    }

    else if (args[0]) {
      imgUrl = args.join(" ");
    }

    if (!imgUrl) {
      return message.reply("Baby, Please reply to an image or provide an image URL");
    }
  
    const waitMsg = await message.reply("Remini images loading...wait baby <😘");
    message.reaction("😘", event.messageID);

    try {
      
      const apiUrl = `${await mahmud()}/api/remini?imgUrl=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl, { responseType: "stream" });
      if (waitMsg?.messageID) message.unsend(waitMsg.messageID);

      message.reaction("✅", event.messageID);

      const processTime = ((Date.now() - startTime) / 1000).toFixed(2);

      message.reply({
        body: `✅ | Here's your Remini image baby`,
        attachment: res.data
      });

    } catch (error) {
  
      if (waitMsg?.messageID) message.unsend(waitMsg.messageID);

      message.reaction("❎", event.messageID);
      message.reply(`🥹error baby, contact 𝐅𝐀𝐇𝐈𝐌.`);
    }
  }
};

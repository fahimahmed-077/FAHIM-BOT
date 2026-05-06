const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "fbcover",
    version: "7.0",
    author: "Farhan-Khan",
    countDown: 5,
    role: 0,
    shortDescription: "Create Facebook cover",
    longDescription: "Generate stylish Facebook cover photo",
    category: "image",
    guide: {
      en: "{pn} v1/v2/v3 - name - title - address - email - phone - color"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      const input = args.join(" ");
      let uid;

      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else {
        uid = Object.keys(event.mentions)[0] || event.senderID;
      }

      const userName = await usersData.getName(uid);

      if (!input) {
        return message.reply(
          `❌ ভুল ইনপুট!\nব্যবহার:\nfbcover v1/v2/v3 - name - title - address - email - phone - color`
        );
      }

      const msg = input.split("-");

      const v = msg[0]?.trim() || "v1";
      const name = msg[1]?.trim() || " ";
      const subname = msg[2]?.trim() || " ";
      const address = msg[3]?.trim() || " ";
      const email = msg[4]?.trim() || " ";
      const phone = msg[5]?.trim() || " ";
      const color = msg[6]?.trim() || "white";

      const waitMsg = await message.reply("⏳ Processing your cover...");

      const apiUrl = await baseApiUrl();

      const img = `${apiUrl}/cover/${v}?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&number=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&colour=${encodeURIComponent(color)}&uid=${uid}`;

      const response = await axios.get(img, { responseType: "stream" });

      await message.reply({
        body: `✿━━━━━━━━━━━━━━━━━━━✿
🔵 Name: ${name}
⚫ Title: ${subname}
⚪ Address: ${address}
📫 Email: ${email}
☎️ Phone: ${phone}
🎨 Color: ${color}
👤 User: ${userName}
✅ Version: ${v}
✿━━━━━━━━━━━━━━━━━━━✿`,
        attachment: response.data
      });

      message.unsend(waitMsg.messageID);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Cover generate করতে সমস্যা হয়েছে!");
    }
  }
};

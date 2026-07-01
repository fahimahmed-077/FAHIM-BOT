const axios = require("axios");

module.exports = {
  config: {
    name: "uid",
    aliases: ["xid"],
    version: "1.0.4",
    permission: 0,
    author: "MaHu",
    prefix: "awto",
    description: "Get UID info with speed",
    category: "without prefix",
    cooldowns: 5
  },

  onStart: async function({ api, event, usersData }) {
    return handleUID({ api, event, usersData });
  },

  onChat: async function({ event, api, usersData }) {
    const body = event.body?.toLowerCase().trim();
    const triggers = [this.config.name, ...(this.config.aliases || [])].map(x => x.toLowerCase());
    const allowedUID = "61576212342334";

    if (!triggers.includes(body)) return;
    if (event.senderID !== allowedUID) return;

    return handleUID({ api, event, usersData });
  }
};

async function handleUID({ api, event, usersData }) {
  const startTime = Date.now();

  let uid;
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions || {}).length > 0) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = event.senderID;
  }

  try {
    const name = await usersData.getName(uid);

    const avatarUrl = await usersData.getAvatarUrl(uid);
    if (!avatarUrl) throw new Error("Avatar not found.");

    const stream = await global.utils.getStreamFromURL(avatarUrl);

    const endTime = Date.now();
    const speedInSeconds = ((endTime - startTime) / 1000).toFixed(2);

    const body =
`╭────────────⭓
│𝗡𝗮𝗺𝗲: ${name}
│𝗨𝗜𝗗: ${uid}
│𝗦𝗽𝗲𝗲𝗱: ${speedInSeconds} seconds
╰────────────⭓`;

    await api.sendMessage({ body, attachment: stream }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage("Error: " + error.message, event.threadID, event.messageID);
  }
}
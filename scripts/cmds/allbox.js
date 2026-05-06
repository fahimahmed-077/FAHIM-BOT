const OWNER_NAME = "MR_FARHAN";

module.exports = {
  config: {
    name: "allbox",
    aliases: ["allgc"],
    version: "1.6.1",
    role: 2,
    author: OWNER_NAME,
    description: "Manage all groups: List, Leave, or Add yourself to any group.",
    category: "admin",
    guide: {
      en: "{pn}",
      bn: "{pn}"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, message, commandName }) {

    // 🔒 ANTI-EDIT PROTECTION
    if (module.exports.config.author !== OWNER_NAME) {
      return message.reply("⛔ 𝐁𝐨𝐭 𝐒𝐭𝐨𝐩𝐩𝐞𝐝: 𝐀𝐮𝐭𝐡𝐨𝐫 𝐌𝐨𝐝𝐢𝐟𝐢𝐞𝐝");
    }

    try {
      await api.getThreadList(25, null, ["INBOX"], (err, list) => {
        if (err)
          return message.reply("❌ 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭 𝐅𝐞𝐭𝐜𝐡 𝐅𝐚𝐢𝐥𝐞𝐝");

        const groups = list.filter(g => g.isGroup && g.isSubscribed);

        if (!groups.length)
          return message.reply("⚠️ 𝐍𝐨 𝐆𝐫𝐨𝐮𝐩 𝐅𝐨𝐮𝐧𝐝");

        const stylishNumber = [
          "𝟏","𝟐","𝟑","𝟒","𝟓",
          "𝟔","𝟕","𝟖","𝟗","𝟏𝟎",
          "𝟏𝟏","𝟏𝟐","𝟏𝟑","𝟏𝟒","𝟏𝟓",
          "𝟏𝟔","𝟏𝟕","𝟏𝟖","𝟏𝟗","𝟐𝟎",
          "𝟐𝟏","𝟐𝟐","𝟐𝟑","𝟐𝟒","𝟐𝟓"
        ];

        let msg =
`╔════════════════════╗
              🌐 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓
╚════════════════════╝\n\n`;

        let groupIDs = [];

        groups.forEach((group, index) => {
          const name = group.name || "নাম নেই";
          const members = group.participantIDs
            ? group.participantIDs.length
            : 0;

          msg +=
`╭─〔 ${stylishNumber[index] || index + 1} 〕
│ 📌 𝐍𝐚𝐦𝐞: ${name}
│ 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${members}
│ 🆔 𝐈𝐃: ${group.threadID}
╰──────────────\n\n`;

          groupIDs.push(group.threadID);
        });

        msg +=
`╔═════════════════════╗
‎           🎮 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 𝐏𝐀𝐍𝐄𝐋
‎╚═════════════════════╝
‎🟢 𝐎𝐔𝐓 <𝐍𝐎> → 𝐋𝐄𝐀𝐕𝐄 𝐆𝐑𝐎𝐔𝐏
‎➕ 𝐀𝐃𝐃 <𝐍𝐎> → 𝐉𝐎𝐈𝐍 𝐆𝐑𝐎𝐔𝐏
‎⛔ 𝐁𝐀𝐍 <𝐍𝐎> → 𝐁𝐀𝐍 𝐆𝐑𝐎𝐔𝐏
‎📋 𝐈𝐍𝐅𝐎 <𝐍𝐎>→ 𝐆𝐑𝐎𝐔𝐏 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
‎╚═════════════════════╝`;

        return message.reply(msg, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            groupIDs
          });
        });
      });
    } catch (e) {
      return message.reply("❌ 𝐄𝐫𝐫𝐨𝐫 𝐎𝐜𝐜𝐮𝐫𝐫𝐞𝐝");
    }
  },

  onReply: async function ({ api, event, Reply, message, threadsData }) {
    const { author, groupIDs } = Reply;
    if (event.senderID != author) return;

    const input = event.body.split(" ");
    const action = input[0].toLowerCase();
    const index = parseInt(input[1]) - 1;
    const targetID = groupIDs[index];

    if (!targetID || isNaN(index))
      return message.reply("⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐍𝐮𝐦𝐛𝐞𝐫");

    // INFO
    if (action === "info") {
      try {
        const info = await api.getThreadInfo(targetID);

        const msg =
`╔═════ 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎 ═════╗
📌 𝐍𝐀𝐌𝐄: ${info.threadName}
👥 𝐌𝐄𝐌𝐁𝐄𝐑𝐒: ${info.participantIDs.length}
💬 𝐌𝐄𝐒𝐒𝐀𝐆𝐄𝐒: ${info.messageCount || 0}
🆔 𝐈𝐃: ${targetID}
╚════════════════════╝`;

        return message.reply(msg);
      } catch {
        return message.reply("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐓𝐨 𝐆𝐞𝐭 𝐆𝐫𝐨𝐮𝐩 𝐈𝐧𝐟𝐨");
      }
    }

    // OUT
    if (action === "out") {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);
        return message.reply(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐋𝐞𝐟𝐭 𝐆𝐫𝐨𝐮𝐩:\n🆔 ${targetID}`);
      } catch {
        return message.reply("❌ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐋𝐞𝐚𝐯𝐞 𝐆𝐫𝐨𝐮𝐩");
      }
    }

    // ADD
    if (action === "add") {
      try {
        const userInfo = await api.getUserInfo(author);
        const userName = userInfo[author]?.name || "ইউজার";

        await api.addUserToGroup(author, targetID);

        await api.sendMessage(
`╔═════════════════════╗
    ✨ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐂𝐄𝐑𝐄𝐌𝐎𝐍𝐘 ✨
╚═════════════════════╝
👑 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 𝐀𝐋𝐄𝐑𝐓 👑
━━━━━━━━━━━━━━━━━━━
♻️ আমাদের গ্রুপে যুক্ত হয়েছেন ♻️
💥 「 𝐁𝐎𝐒𝐒: 𝐅𝐀𝐑𝐇𝐀𝐍 」💥
━━━━━━━━━━━━━━━━━━━
🎊 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 🎊
👉 সবাইকে অনুরোধ করা হচ্ছে
👉 আন্তরিকতা ও সম্মানের সাথে
👉 আমাদের “বস ফারহান”-কে
👉 উষ্ণভাবে স্বাগতম জানান
╔═════════════════════╗
💬 𝐋𝐄𝐓’𝐒 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐎𝐔𝐑 𝐁𝐎𝐒𝐒 💬
🎉 𝐌𝐀𝐊𝐄 𝐇𝐈𝐌 𝐅𝐄𝐄𝐋 𝐀𝐓 𝐇𝐎𝐌𝐄 🎉
╚═════════════════════╝`,
          targetID
        );

        return message.reply(`╔═━━━✦🌟 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 🌟✦━━━═╗ 
▶ 𝐒𝐓𝐀𝐓𝐔𝐒 : 𝐀𝐂𝐂𝐄𝐒𝐒 𝐆𝐑𝐀𝐍𝐓𝐄𝐃 ✔
 ✦━━━━━━━━━━━━━━━━━━━✦
「 ${userName} 」
 
✔ আপনাকে সফলভাবে গ্রুপে 𝐀𝐃𝐃 করা সম্পন্ন হয়েছে_♻️✅
✦━━━━━━━━━━━━━━━━━━━✦
𝐍𝐎𝐃𝐄 𝐈𝐃 :「 ${targetID} 」
𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 : 𝐋𝐄𝐕𝐄𝐋 𝟎𝟏 𝐂𝐋𝐄𝐀𝐑
╚═━━✦━━━━━━━━━━━━✦━━═╝`);
      } catch {
        return message.reply("❌ 𝐆𝐫𝐨𝐮𝐩 𝐀𝐝𝐝 𝐅𝐚𝐢𝐥𝐞𝐝");
      }
    }

    // BAN
    if (action === "ban") {
      try {
        const data = await threadsData.get(targetID);
        if (!data.data) data.data = {};
        data.data.banned = true;

        await threadsData.set(targetID, data.data, "data");
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);

        return message.reply(`⛔ 𝐆𝐫𝐨𝐮𝐩 𝐁𝐚𝐧𝐧𝐞𝐝:\n🆔 ${targetID}`);
      } catch {
        return message.reply("❌ 𝐁𝐚𝐧 𝐅𝐚𝐢𝐥𝐞𝐝");
      }
    }
  }
};

const axios = require("axios");

module.exports = {
  config: {
    name: "approve",
    aliases: ["pending", "pend", "pe"],
    version: "2.0.1",
    author: "Neoaz 🐊",
    cooldown: 5,
    role: 2,
    description: "Handle pending requests",
    category: "utility",
  },

  async handleReply({ message, api, event, replyData, database }) {
    const { author, pending, messageID } = replyData;
    if (String(event.senderID) !== String(author)) return;

    const body = (event.body || "").trim().toLowerCase();

    if (body === "c") {
      api.unsendMessage(event.threadId, messageID);
      return message.reply("✕ Operation has been canceled!");
    }

    const indexes = body.split(/\s+/).map(Number);
    if (isNaN(indexes[0])) return message.reply("✕ Invalid input! Please provide valid numbers.");

    let count = 0;
    const prefix = global.GoatBot.config.prefix || "!";

    for (const idx of indexes) {
      if (idx <= 0 || idx > pending.length) continue;

      const target = pending[idx - 1];
      try {
        await api.sendMessage(
          `━━━━━━━━━━━━━━━━\n『 APPROVAL NOTICE 』\n━━━━━━━━━━━━━━━━\n\nYour request has been approved by the Admin!\n\nType ${prefix}help to see all available commands.\n\nEnjoy using the Bot!`,
          target.threadID
        );
        count++;
      } catch (err) {
        // ignore
      }
    }

    return message.reply(`✓ [ SUCCESS ] Approved ${count} ${count > 1 ? "Entries" : "Entry"}!`);
  },

  async onStart({ message, api, event, args, database }) {
    const { threadId, messageID } = event;
    const type = args[0]?.toLowerCase();

    if (!type || !["user", "thread", "all"].some(t => type.startsWith(t))) {
      return message.reply(`『 USAGE 』\n\napprove user  — Approve users\napprove thread — Approve groups\napprove all    — Approve everything`);
    }

    try {
      const other = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const list = [...other, ...pending];

      let filteredList = [];
      if (type.startsWith("u")) filteredList = list.filter((t) => !t.isGroup);
      else if (type.startsWith("t")) filteredList = list.filter((t) => t.isGroup);
      else filteredList = list;

      if (filteredList.length === 0) return message.reply("✕ No pending requests found in this category.");

      let msg = `━━━━━━━━━━━━━━━━\n『 PENDING REQUESTS 』\n━━━━━━━━━━━━━━━━\n\n`;

      for (let i = 0; i < filteredList.length; i++) {
        msg += `[ ${i + 1} ] ${filteredList[i].name || filteredList[i].threadID}\n`;
      }

      msg += `\n━━━━━━━━━━━━━━━━\n➥ Reply with numbers (e.g., 1 2)\n➥ Reply "c" to Cancel.`;

      const sent = await api.sendMessage(msg, threadId);
      if (sent && sent.messageID) {
          database.setReplyData(sent.messageID, {
              commandName: this.config.name,
              messageID: sent.messageID,
              author: event.senderID,
              pending: filteredList,
          });
      }

    } catch (error) {
      console.error(error);
      return message.reply("✕ Failed to fetch the pending list.");
    }
  },
};
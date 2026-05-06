module.exports = {
  config: {
    name: "nick",
    aliases: ["nickname", "setnick", "name"],
    version: "1.0",
    author: "MR_FARHAN",
    countDown: 3,
    role: 1,
    description: "Reply করে ইউজারের নিকনেম চেঞ্জ করো",
    category: "group",
    guide: {
      en: "{pn} <নতুন নিকনেম> (reply দিয়ে ব্যবহার করো)\n{pn} remove (নিকনেম রিমুভ)"
    }
  },

  onStart: async function ({ api, event, args }) {

    // 🔒 AUTHOR LOCK
    const LOCKED_AUTHOR = "MR_FARHAN";
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      return;
    }

    const { threadID, messageID, messageReply } = event;

    // রিপ্লাই চেক
    if (!messageReply) {
      return api.sendMessage(
        "❌ যার নিকনেম চেঞ্জ করবে তার মেসেজে রিপ্লাই দাও",
        threadID,
        messageID
      );
    }

    const targetID = messageReply.senderID;
    const newNick = args.join(" ");

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();

      // বট এডমিন চেক
      const botIsAdmin = threadInfo.adminIDs.some(i => i.id === botID);
      if (!botIsAdmin) {
        return api.sendMessage(
          "❌ বটকে এডমিন দাও, না হলে কাজ করবে না",
          threadID,
          messageID
        );
      }

      // বট নিজের নিকনেম চেঞ্জ ব্লক
      if (targetID === botID) {
        return api.sendMessage(
          "❌ আমি নিজের নিকনেম চেঞ্জ করতে পারি না",
          threadID,
          messageID
        );
      }

      // remove command
      if (args[0]?.toLowerCase() === "remove") {
        await api.changeNickname("", threadID, targetID);
        return api.sendMessage("✅ নিকনেম রিমুভ করা হয়েছে", threadID, messageID);
      }

      // খালি নাম চেক
      if (!newNick) {
        return api.sendMessage(
          "❌ নতুন নিকনেম লিখো",
          threadID,
          messageID
        );
      }

      // length limit
      if (newNick.length > 50) {
        return api.sendMessage(
          "❌ নিকনেম ৫০ ক্যারেক্টারের বেশি হতে পারবে না",
          threadID,
          messageID
        );
      }

      // nickname change
      await api.changeNickname(newNick, threadID, targetID);

      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || "User";

      return api.sendMessage(
        `✅ ${name} এর নিকনেম চেঞ্জ করা হয়েছে\n\n👑 নতুন নিকনেম: ${newNick}`,
        threadID,
        messageID
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "❌ নিকনেম চেঞ্জ করতে সমস্যা হয়েছে (বট এডমিন বা পারমিশন চেক করো)",
        threadID,
        messageID
      );
    }
  }
};

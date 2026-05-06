const delay = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = {
  config: {
    name: "tagall",
    version: "3.0.0",
    author: "Farhan-Khan",
    role: 0,
    shortDescription: "Perfect clickable serial mention",
    category: "group"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const text = (event.body || "").trim();

    if (!text.toLowerCase().startsWith("/tagall")) return;

    const msg = text.replace(/\/tagall/i, "").trim();

    if (!msg) {
      return api.sendMessage(
        "⚠️ ব্যবহার: /tagall আপনার মেসেজ",
        event.threadID,
        event.messageID
      );
    }

    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs;

      const userInfo = await api.getUserInfo(members);

      let count = 1;

      // 🔥 header reply
      await api.sendMessage(
        `📢 STARTING TAG ALL...\n📝 Message: ${msg}`,
        event.threadID,
        event.messageID
      );

      for (let id of members) {
        const name = userInfo[id]?.name || "User";

        const textMsg = `${count}. ${msg} @${name}`;

        await api.sendMessage(
          {
            body: textMsg,
            mentions: [
              {
                id: id,
                tag: name,
                fromIndex: textMsg.indexOf(name)
              }
            ]
          },
          event.threadID
        );

        count++;
        await delay(1500);
      }

    } catch (err) {
      console.log("TagAll Error:", err);
      api.sendMessage(
        "❌ মেনশন করতে সমস্যা হয়েছে",
        event.threadID,
        event.messageID
      );
    }
  }
};

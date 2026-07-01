‎module.exports = {
‎  config: {
‎    name: "spam",
‎    author: "xalman", //kim/zed
‎    role: 2,
‎    shortDescription: "Repeat text sender",
‎    longDescription: "Sends a selected message multiple times with a controlled interval.",
‎    category: "system",
‎    guide: "{pn} <count> <text>"
‎  },
‎
‎  onStart: async function ({ api, event, args }) {
‎
‎    const count = Number(args.shift());
‎    const text = args.join(" ");
‎
‎    if (!count || !text) {
‎      return api.sendMessage("❌ Usage: /spam <count> <text>", event.threadID);
‎    }
‎
‎    if (count < 1 || count > 100) {
‎      return api.sendMessage("⚠️ Please choose a number between 1 and 100.", event.threadID);
‎    }
‎
‎    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
‎
‎    let sent = 0;
‎
‎    while (sent < count) {
‎      await api.sendMessage(text, event.threadID);
‎      sent++;
‎      await wait(180);
‎    }
‎  }
‎};
‎
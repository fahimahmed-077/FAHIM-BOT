module.exports = {
  config: {
    name: "antiout",
    version: "7.0",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Enable or disable antiout",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} [on | off]"
  },

  onStart: async function ({ message, event, threadsData, args }) {

    let antiout = await threadsData.get(event.threadID, "settings.antiout");

    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }

    if (!["on", "off"].includes(args[0])) {
      return message.reply("😜 Use 'on' or 'off' bro!");
    }

    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`😎 Antiout ${args[0] === "on" ? "ENABLED 🔥" : "DISABLED ❌"}`);
  },

  onEvent: async function ({ api, event, threadsData }) {

    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (!antiout) return;

    if (
      event.logMessageType === "log:unsubscribe" &&
      event.logMessageData &&
      event.logMessageData.leftParticipantFbId
    ) {

      const userId = event.logMessageData.leftParticipantFbId;
      if (userId == api.getCurrentUserID()) return;

      let leaveData = await threadsData.get(event.threadID, "data.leaveCount") || {};
      leaveData[userId] = (leaveData[userId] || 0) + 1;
      await threadsData.set(event.threadID, leaveData, "data.leaveCount");

      if (leaveData[userId] > 5) {
        return api.sendMessage(
          `🛑 ${leaveData[userId]} বার পালাইছস! 🤡
তুই এখন "Escape Legend" 💀🏆
আর add করা হইবো না! Bye bye 👋

***_Powered by Fahim ⚡_***`,
          event.threadID
        );
      }

      try {

        await api.addUserToGroup(userId, event.threadID);

        const userInfo = await api.getUserInfo(userId);
        const userName = userInfo[userId].name;

        // 3 বার বা তার বেশি হলে nickname change
        if (leaveData[userId] >= 3) {
          try {
            await api.changeNickname("Runner Pro 🏃‍♂️🔥", event.threadID, userId);
          } catch (e) {}
        }

        if (leaveData[userId] == 4) {

          api.sendMessage(
            {
              body: `😏🔥 ${userName} ৪ বার পালাইছস!!

Resume তে লিখবি —
"Professional Group Leaver – 4 Years Experience" 🤡📄

আর একবার করলে surprise আছে 💀

***_Powered by Fahim ⚡_***`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        } else if (leaveData[userId] == 3) {

          api.sendMessage(
            {
              body: `💀 ${userName} আবার পালাইছে!

৩ বার already 🤡
তুই এখন officially Runner Pro 🏃‍♂️🔥

Security তোর উপর নজর রাখতেছে 👀

***_Powered by Fahim ⚡_***`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        } else if (leaveData[userId] == 5) {

          api.sendMessage(
            {
              body: `⚠️ LAST WARNING ${userName}

৫ বার পালাইছস 😈
আর একবার করলে permanent freedom 😌

Bot watching you 🕵️‍♂️🔥

***_Powered by Fahim ⚡_***`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        } else {

          api.sendMessage(
            {
              body: `🚨🔍 FBI ALERT! 🚨

${userName} পালানোর চেষ্টা করছিল 🏃‍♂️💨
কিন্তু satellite tracking system এ ধরা খাইছে 📡😎

Area 51 level security 🔒👽
Mission: Re-Added Successfully ✅🔥
(Leave count: ${leaveData[userId]}/5)

***_Powered by Fahim ⚡_***`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        }

      } catch (err) {

        api.sendMessage(
          `🤡 পালানোর প্ল্যান সফল হইছে মনে হয়ছে! হয়তো ওর লগে আমি এড না অথবা আমাকে block করছে 😭
এইবার বেঁচে গেলি 😏

***_Powered by Fahim ⚡_***`,
          event.threadID
        );

      }
    }
  }
};

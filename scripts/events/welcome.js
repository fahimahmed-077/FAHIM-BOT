const { getTime, drive } = global.utils;
const { nickNameBot } = global.GoatBot.config;
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "welcome",
    version: "5.0",
    author: "MR_FARHAN",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      defaultWelcomeMessage: "𝐖𝐄𝐋𝐂𝐎𝐌𝐄 {userTag}",
      botAddedMessage:
        "━━━━━━━━━━━━━━━━━━━\n🤖 ᴛʜᴀɴᴋ ʏᴏᴜ ғᴏʀ ᴀᴅᴅɪɴɢ ᴍᴇ ᴛᴏ ᴛʜᴇ ɢʀᴏᴜᴘ! 💖\n\n⚙️ ʙᴏᴛ ᴘʀᴇꜰɪx : /\n📜 ᴛʏᴘᴇ /help ᴛᴏ sᴇᴇ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs\n\n✨ ʟᴇᴛ's ᴍᴀᴋᴇ ᴛʜɪs ɢʀᴏᴜᴘ ᴇᴠᴇɴ ᴍᴏʀᴇ ꜰᴜɴ ᴛᴏɢᴇᴛʜᴇʀ! 😄\n━━━━━━━━━━━━━━━━━━━"
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendWelcomeMessage) return;

    const addedMembers = event.logMessageData.addedParticipants;
    const threadName = threadData.threadName || "our group";
    const prefix = global.utils.getPrefix(threadID);
    const inviterID = event.author;

    for (const user of addedMembers) {
      const userID = user.userFbId;
      const botID = api.getCurrentUserID();

      if (userID == botID) {
        if (nickNameBot)
          await api.changeNickname(nickNameBot, threadID, botID);
        return message.send(getLang("botAddedMessage", prefix));
      }

      const userName = user.fullName;
      const userTag = `@${userName}`;
      const inviterName = await usersData.getName(inviterID);
      const memberCount = event.participantIDs.length;

      let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

      // ✅ FULL CUSTOM WELCOME TEXT (তোর দেওয়া ডিজাইন)
      welcomeMessage = `
╔══❀═══◄░❀ ░►═══❀══╗
      ✨ আসসালামু আলাইকুম ✨
╚══❀═══◄░❀ ░►═══❀══╝

╔════════════════════╗
 ✨ ${threadName} ✨
╚════════════════════╝
｡☆✼★━━━━━━━━━━━━★✼☆｡

✹◢█𖣐◣ 💖◢𖣐█◣✹
✹ █ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘  █ ✹
 ✹◥█𖣐█💛█𖣐█◤✹
    ✹◥█𖣐💚𖣐█◤✹
        ✹◥🖤🖤◤✹
             ✹🔻✹
                 ✹
｡☆✼★━━━━━━━━━━━━★✼☆｡
 ${userTag}

আ্ঁপ্ঁনা্ঁকে্ঁ গ্রু্ঁপে্ঁর্ঁ প্ঁক্ষ্ঁ থে্ঁকে্ঁ জা্ঁনা্ঁই্ঁ   
 ৷৷ 💐 আ্ঁন্ত্ঁরি্ঁক্ঁ স্বা্ঁগ্ঁত্ঁম্ঁ 💐 ।। 

🌿 『 𝐀𝐃𝐃𝐄𝐃 𝐁𝐘 』 ➤ ${inviterName}

👥 『 𝐌𝐄𝐌𝐁𝐄𝐑 𝐍𝐎 』 ➤ ${memberCount}

｡☆✼★━━━━━━━━━━━━★✼☆｡

╔══❀═══◄░❀ ░►═══❀══╗
🌹 এ্ঁক্ঁটি্ঁ গা্ঁছে্ঁ দু্ঁই্ঁটি্ঁ গো্ঁলা্ঁপ্ঁ 🌹
🌹 এ্ঁক্ঁটি্ঁ গো্ঁলা্ঁপ্ঁ লা্ঁল্ঁ,🌹
━━━━━━━━━━━━━━━━━━━
${threadName}
━━━━━━━━━━━━━━━━━━━
গ্রু্ঁপে্ঁ আ্ঁপ্ঁনা্ঁর্ঁ ভা্ঁলো্ঁবা্ঁসা্ঁ থা্ঁকু্ঁক্ঁ চি্ঁর্ঁকা্ঁল্ঁ 💞
╚══❀═══◄░❀ ░►═══❀══╝
🦋★😘★🦋
✧🌺✧🌺✧🌺

┊┊┊┊┊┊┊⇣❥
┊┊┊┊┊┊⇣❥
┊┊┊┊┊⇣❥
┊┊┊┊⇣❥
┊┊┊⇣❥
┊┊⇣❥
┊⇣❥

✨ 『 𝐄𝐍𝐉𝐎𝐘 𝐘𝐎𝐔𝐑 𝐒𝐓𝐀𝐘 』 ✨
🌸 『 𝐒𝐓𝐀𝐘 𝐀𝐂𝐓𝐈𝐕𝐄 』 🌸
━━━━━━━━━━━━━━━━━━━
🤖 ${nickNameBot}
━━━━━━━━━━━━━━━━━━━
`;

      let welcomeImagePath;
      try {
        welcomeImagePath = await createWelcomeCard({
          userName,
          userTag,
          threadName,
          memberCount,
          inviterName,
          newUserID: userID,
          inviterID: inviterID,
          threadID: threadID,
          api: api
        });
      } catch (err) {
        console.error("Welcome image creation failed:", err);
        welcomeImagePath = null;
      }

      const form = {
        body: welcomeMessage,
        mentions: [{ tag: userName, id: userID }]
      };

      if (welcomeImagePath && fs.existsSync(welcomeImagePath)) {
        form.attachment = fs.createReadStream(welcomeImagePath);
      } else if (threadData.data.welcomeAttachment) {
        const files = threadData.data.welcomeAttachment;
        const attachments = files.reduce((acc, file) => {
          acc.push(drive.getFile(file, "stream"));
          return acc;
        }, []);
        form.attachment = (await Promise.allSettled(attachments))
          .filter(({ status }) => status == "fulfilled")
          .map(({ value }) => value);
      }

      message.send(form);

      if (welcomeImagePath && fs.existsSync(welcomeImagePath)) {
        setTimeout(() => fs.unlinkSync(welcomeImagePath), 5000);
      }
    }
  }
};

// নিচের সব ফাংশন যেমন ছিল তেমনই আছে 👇 (কোনো পরিবর্তন নাই)

const ACCESS_TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

async function downloadHighQualityProfile(userID) {
  try {
    const highResUrl = `https://graph.facebook.com/${userID}/picture?width=500&height=500&access_token=${ACCESS_TOKEN}`;
    const response = await axios({
      method: 'GET',
      url: highResUrl,
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    return null;
  }
}

async function downloadImage(url) {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      timeout: 10000
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    return null;
  }
}

async function getGroupImage(threadID, api) {
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    if (threadInfo.imageSrc) {
      const response = await axios({
        method: 'GET',
        url: threadInfo.imageSrc,
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data, 'binary');
    }
  } catch {}
  return null;
}

async function createWelcomeCard(params) {
  const width = 1200;
  const height = 675;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0c0c0c');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const tempPath = path.join(__dirname, `temp_welcome_${Date.now()}.png`);
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(tempPath, buffer);
  return tempPath;
}

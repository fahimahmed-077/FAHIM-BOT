const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
config: {
name: "owner",
aliases: ["admin", "intro", "contact"],
version: "4.0.0",
author: "MR_FARHAN",
role: 0,
countDown: 5,
shortDescription: {
en: "Owner Information"
},
category: "owner"
},

onStart: async function ({ api, event, usersData, threadsData, message }) {
try {

// ===== OWNER INFO =====  
  const ownerName = "𝙼𝚁.𝙵𝙰𝙷𝙸𝙼";  
  const ownerReligion = "𝙸𝚂𝙻𝙰𝙼";
  const ownerRelation = "𝚂𝙸𝙽𝙶𝙻𝙴";
  const ownerAddress = "𝙹𝙴𝚂𝚂𝙾𝚁𝙴";
  const ownerAge = "17";
  
  // ===== CONTACT =====  
  const facebook = "fb.com/fahim.ahmed.raj.207";  
  const whatsapp = "wa.me/+8801771240377";  
  const telegram = "t.me/DEVIL_FAHIM";  
  const youtube = "নাই 😹";  

  // ===== BOT INFO =====  
  const botName = global.GoatBot?.config?.nickNameBot || "─꯭𓆩»‌‌𝆠꯭፝֟𝐒𝐈𝐙𝐔𝐊𝐀𝆠꯭፝֟𓆩𝆠፝𝐁𝐀𝐁𝐘𝆠꯭፝֟𝆠꯭፝֟𓆪";  
  const prefix = global.GoatBot?.config?.prefix || "/";  
  const totalCommands = global.GoatBot?.commands?.size || 0;  

  // ===== USERS & GROUPS =====  
  const allUsers = await usersData.getAll();  
  const allThreads = await threadsData.getAll();  

  const totalUsers = allUsers.length;  
  const totalGroups = allThreads.length;  

  // ===== UPTIME =====  
  const uptime = process.uptime();  

  const days = Math.floor(uptime / 86400);  
  const hours = Math.floor((uptime % 86400) / 3600);  
  const minutes = Math.floor((uptime % 3600) / 60);  
  const seconds = Math.floor(uptime % 60);  

  const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;  

  // ===== TIME =====  
  const now = moment().tz("Asia/Dhaka");  
  const time = now.format("hh:mm:ss A");  
  const date = now.format("DD/MM/YYYY");  

  // ===== CACHE =====  
  const cacheDir = path.join(__dirname, "cache");  

  if (!fs.existsSync(cacheDir)) {  
    fs.mkdirSync(cacheDir, { recursive: true });  
  }  

  const videoPath = path.join(cacheDir, "owner.mp4");  

  // ===== VIDEO URL =====  
  const videoUrl = "https://files.catbox.moe/29y6th.mp4";  

  // ===== DOWNLOAD VIDEO =====  
  const response = await axios({  
    url: videoUrl,  
    method: "GET",  
    responseType: "stream"  
  });  

  const writer = fs.createWriteStream(videoPath);  

  response.data.pipe(writer);  

  await new Promise((resolve, reject) => {  
    writer.on("finish", resolve);  
    writer.on("error", reject);  
  });  

  // ===== MESSAGE =====  
  const msg = `

╔═══✦══════════✦═══╗
║  🤖「 𝐎𝐖𝐍𝐄𝐑 𝐏𝐀𝐍𝐄𝐋 」🤖 ║
╚═══✦══════════✦═══╝

┏━━━━━━━━━━━━━━━━━━┓
┃ 👑 𝙽𝙰𝙼𝙴:「 ${ownerName} 」
┃ 🕋 𝚁𝙴𝙻𝙸𝙶𝙸𝙾𝙽:「 ${ownerReligion} 」
┃ 💞 𝚁𝙴𝙻𝙰𝚃𝙸𝙾𝙽:「 ${ownerRelation} 」
┃ 🏠 𝙰𝙳𝙳𝚁𝙴𝚂𝚂:「 ${ownerAddress} 」
┃ 🎂 𝙰𝙶𝙴:「 ${ownerAge} 」
┃ 🟢 𝙰𝙲𝚃𝙸𝚅𝙴:「 24/7 」
┗━━━━━━━━━━━━━━━━━━┛

╭─── 📱𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗠𝗘 ───╮
│ 🌐 ↓-𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊-↓
│ └─ ${facebook}
│ 💬 ↓-𝐖𝐇𝐀𝐓𝐀𝐏𝐏-↓
│ └─ ${whatsapp}
│ ✈️ ↓-𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌-↓
│ └─ ${telegram}
│ ▶️ ↓-𝐘𝐎𝐔𝐓𝐔𝐁𝐄-↓
│ └─ ${youtube}
╰───────────────────╯

╭─── 🤖 𝗕𝗢𝗧 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 ───╮
│ ⚡ 𝐍𝐀𝐌𝐄: ${botName}
│ 👥 𝐔𝐒𝐄𝐑𝐒:「 ${totalUsers} 」
│ 💬 𝐆𝐑𝐎𝐔𝐏:「 ${totalGroups} 」
│ 📦 𝐂𝐌𝐃𝐒:「 ${totalCommands} 」
│ 🔰 𝐏𝐑𝐄𝐅𝐈𝐗:「 ${prefix} 」
╰───────────────────╯
╭────── 📅 𝗧𝗜𝗠𝗘 ──────╮
│ 🗓️ 𝐃𝐀𝐓𝐄: ${date}
│ ⏰ 𝐓𝐈𝐌𝐄: ${time}
│ ⏳ 𝐔𝐏𝐓𝐈𝐌𝐄: ${uptimeText}
╰──────────────────╯
╔═══✦══════════✦═══╗
║ 「 𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 」 ║
╚═══✦══════════✦═══╝
`;

await message.reply({  
    body: msg,  
    attachment: fs.createReadStream(videoPath)  
  });  

  // ===== DELETE VIDEO =====  
  setTimeout(() => {  
    if (fs.existsSync(videoPath)) {  
      fs.unlinkSync(videoPath);  
    }  
  }, 10000);  

} catch (err) {  
  console.log(err);  

  return message.reply("❌ | Owner command error.");  
}

}
}; 

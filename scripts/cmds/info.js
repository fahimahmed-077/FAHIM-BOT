const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info",
    version: "2.5.3",
    author: "MR_FARHAN",
    role: 0,
    countDown: 20,
    shortDescription: {
      en: "Owner & bot information"
    },
    longDescription: {
      en: "Show detailed information about the bot, owner, uptime and socials"
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {

    // OWNER INFO
    const ownerName = "FAHIM-KHAN";
    const ownerAge = "17+";
    const ownerFB = "https://m.me/fahim.ahmed.raj.207";
    const ownerNumber = "01771240377";
    const status = "Active";

    // BOT INFO
    const botName = global.GoatBot?.config?.nickNameBot || "GoatBot";
    const prefix = global.GoatBot?.config?.prefix || ".";
    const totalCommands = global.GoatBot?.commands?.size || 0;

    // GIF / VIDEO URL
    const images = [
      "https://files.catbox.moe/rtgdvs.mp4"
    ];
    const image = images[Math.floor(Math.random() * images.length)];

    // DATE & TIME
    const now = moment().tz("Asia/Dhaka");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("h:mm:ss A");

    // UPTIME
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // SEND MESSAGE
    return message.reply({
      body: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎    ╭•┄┅══❁🌺❁══┅┄•╮
 •—»✨𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢✨«—•
‎    ╰•┄┅══❁🌺❁══┅┄•╯
‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎╔══════════════════╗
‎║👤>𝗢𝗪𝗡𝗘𝗥:-[𝐅𝐀𝐇𝐈𝐌-𝗞𝗛𝗔𝗡]
║
‎║♻️>𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻:- [>𝗜𝘀𝗹𝗮𝗺<]
‎║ 
‎║📝>𝗔𝗴𝗲:-  [>𝟭𝟳<]
‎║
‎║🚻>𝗚𝗲𝗻𝗱𝗲𝗿:-  [>𝗠𝗮𝗹𝗲<]
‎‎╠══════════════════╣
‎║🌐>𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:-↓
‎║→fb.com/fahim.ahmed.raj.207                           
‎║
‎║💬>𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:-↓
‎║https://m.me/fahim.ahmed.raj.207
‎║
‎║📞>𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:-↓
‎║→[>wa.me/+8801771240377<]        
‎║
‎╠══════════════════╣
‎║>𝗕𝗢𝗧-𝗡𝗔𝗠𝗘:-𝗦𝗜𝗭𝗨𝗞𝗔-𝗕𝗔𝗕𝗬<
‎║
‎║⚡>𝗣𝗿𝗲𝗳𝗶𝘅:-『 ${prefix} 』
‎║
‎║📦>𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:-『 𝟮𝟮𝟱 』
‎║
‎║🚀>𝗣𝗶𝗻𝗴:- N/A
‎╠══════════════════╣
‎║
‎║⏳>𝗨𝗽𝘁𝗶𝗺𝗲:- ${uptimeString}
‎║
‎║🕒>𝗕𝗱→𝗧𝗶𝗺𝗲:-『 ${time} 』
‎║
║🗓>𝗗𝗮𝘁𝗲:-『 ${date} 』
║
‎╠══════════════════╣
‎║🏠>𝐀𝐃𝐃𝐑𝐄𝐒𝐒:-[𝐃𝐇𝐀𝐊𝐀]
‎║             [𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇]
‎║
‎║👩‍❤️‍👨↓
║ >𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍𝐒𝐇𝐈𝐏:-[>𝐒𝐈𝐍𝐆𝐋𝐄<]
‎║
‎║🧑‍🔧>𝐖𝐎𝐑𝐊:- [>𝐁𝐄𝐊𝐀𝐑<]
‎╠══════════════════╣
‎⊱༅༎😽💚༅༎⊱ ]
‎-আমি ভদ্র, বেয়াদব দুটোই🥱✌️
‎
‎-তুমি যেটা ডি'জার্ভ করো, আমি সেটাই দেখাবো! 
⊱༅༎😽💚༅༎⊱ ]
‎╠══════════════════╣
  ‎♡𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗬♡
             ♡𝗦𝗜𝗭𝗨𝗞𝗔>𝗕𝗢𝗧♡
‎╚══════════════════╝`,
      attachment: await global.utils.getStreamFromURL(image)
    });
  }
};

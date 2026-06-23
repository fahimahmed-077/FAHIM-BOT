const os = require("os");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "chakrun",
    aliases: ["ckr", "chakrun"],
    version: "9.0.0",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    category: "system",
    usePrefix: false 
  },

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: SIZUKA BOT
 * 👤 OWNER: MR FARHAN (FARHAN BOSS)
 * 📍 LOCATION: CHUADANGA, BANGLADESH
 * 🛠️ PROJECT: SIZUKA BOT PROJECT (2026)
 * --------------------------------------- */

  onChat: async function ({ api, event, message }) {
    if (!event.body) return;
    const input = event.body.toLowerCase().trim();
    if (input === "chakrun" || input === "ckr") {
      return this.onStart({ api, event, message });
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID } = event;
    const imgURL = "https://i.imgur.com/AakQ8H9.jpeg"; 
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, `sysinfo_${Date.now()}.png`);

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const wait = await message.reply("⏳ Generating system info image, please wait...");

    try {
      let hostPlatform = "Unknown";
      const platform = os.platform();
      const uptime = process.uptime();
      
      const isRender = process.env.RENDER || (process.env.HOME && process.env.HOME.includes("/opt/render"));
      const isRailway = process.env.RAILWAY_ID || process.env.RAILWAY_ENVIRONMENT;

      if (isRender) hostPlatform = "Render Cloud";
      else if (isRailway) hostPlatform = "Railway Cloud";
      else if (platform === "linux") hostPlatform = "Linux VPS";
      else if (platform === "win32") hostPlatform = "Windows";
      else if (platform === "android") hostPlatform = "Termux";

      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);

      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
      const ping = Date.now() - event.timestamp;

      // --- [ CANVAS DRAWING ] ---
      const baseImage = await loadImage(imgURL);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // টেক্সট স্টাইল - Bold Font & High Visibility
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000"; 
      ctx.lineWidth = 4; // বর্ডার আরও মোটা করা হয়েছে যাতে ফুটে ওঠে
      ctx.textBaseline = "top";

      const startX = canvas.width * 0.07; 
      let currentY = canvas.height * 0.12; 
      const lineSpacing = canvas.height * 0.095;

      // Title
      ctx.font = `bold ${Math.floor(canvas.height * 0.085)}px sans-serif`;
      ctx.strokeText("SIZUKA BOT SYSTEM INFO", startX, currentY);
      ctx.fillText("SIZUKA BOT SYSTEM INFO", startX, currentY);
      
      currentY += lineSpacing * 1.5;

      // Stats with Emojis & Bold Fonts
      ctx.font = `bold ${Math.floor(canvas.height * 0.055)}px sans-serif`;
      
      const stats = [
        `🌐 Host: ${hostPlatform}`,
        `⚙️ OS: ${platform} (${os.arch()})`,
        `⏳ Uptime: ${days}d ${hours}h ${minutes}m`,
        `🧠 RAM: ${usedMem}GB / ${totalMem}GB`,
        `📡 Ping: ${ping} ms`,
        `🟢 Node: ${process.version}`
      ];

      stats.forEach((text) => {
        ctx.strokeText(text, startX, currentY);
        ctx.fillText(text, startX, currentY);
        currentY += lineSpacing; 
      });

      // Footer - Credits
      ctx.font = `italic bold ${Math.floor(canvas.height * 0.045)}px sans-serif`;
      ctx.fillStyle = "#00FF00"; 
      ctx.strokeText("Power by:-Fahim Khan", startX, canvas.height - (lineSpacing * 1.1));
      ctx.fillText("Power by:-Fahim Khan", startX, canvas.height - (lineSpacing * 1.1));

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);

      api.unsendMessage(wait.messageID);
      
      await message.reply({
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath);

    } catch (err) {
      console.error(err);
      if(wait) api.unsendMessage(wait.messageID);
      return message.reply(`❌ Error: ${err.message}`);
    }
  }
};

const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");

module.exports = {
  config: {
    name: "up2",
    aliases: ["uptime2", "upt2"],
    version: "1.7",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Bot Status",
    longDescription: "background card with clean premium spacing",
    category: "system",
    guide: "{p}uptime"
  },

  onStart: async function ({ message, api, event }) {
    const startTime = Date.now();
    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      
      const uptime = process.uptime();
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      const uptimeStr = `${h}h ${m}m ${s}s`;

      const ping = Date.now() - startTime;
      const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const memTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);
      const memPercent = ((memUsed / memTotal) * 100).toFixed(1);

      const cpuUsage = Math.min(
        ((process.cpuUsage().user + process.cpuUsage().system) / 1000000) % 100,
        100
      );

      const threads = process._getActiveHandles().length;
      const nodeVersion = process.version;
      const platform = process.platform.toUpperCase();
      
      const canvas = Canvas.createCanvas(1400, 900);
      const ctx = canvas.getContext("2d");

      const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bg.addColorStop(0, "#000428");
      bg.addColorStop(1, "#004e92");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const containerX = 30;
      const containerY = 30;
      const containerW = canvas.width - 60;
      const containerH = canvas.height - 60;

      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.beginPath();
      ctx.roundRect(containerX, containerY, containerW, containerH, 45);
      ctx.fill();
      
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.roundRect(containerX, containerY, containerW, 150, 45);
      ctx.fill();

      ctx.font = "bold 78px Segoe UI";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText("📉 BOT STATUS DASHBOARD", canvas.width / 2, containerY + 95);

      ctx.font = "italic 30px Segoe UI";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText("All systems running smoothly", canvas.width / 2, containerY + 130);
      
      const stats = [
        { icon: "⏰", title: "SYSTEM UPTIME", value: uptimeStr, sub: "Running Time", color: "#FFD700", bar: Math.min((uptime / 3600) * 4.1667, 100) },
        { icon: "📡", title: "NETWORK PING", value: `${ping} ms`, sub: "Latency", color: "#00FFAA", bar: Math.min(ping / 10, 100) },
        { icon: "💾", title: "MEMORY USAGE", value: `${memUsed} MB`, sub: `${memPercent}% of ${memTotal}MB`, color: "#00FF00", bar: memPercent },
        { icon: "📊", title: "CPU LOAD", value: `${cpuUsage.toFixed(1)}%`, sub: "Processor", color: "#FFAA00", bar: cpuUsage },
        { icon: "⚒️", title: "NODE VERSION", value: nodeVersion, sub: "Runtime", color: "#9D4EDD", bar: 100 },
        { icon: "👑", title: "BOT OWNER", value: "FARHAN", sub: "Administrator", color: "#FFA500", bar: 100 }
      ];

      const boxW = (containerW - 120) / 2;
      const boxH = 190;
      const startX = containerX + 40;
      const startY = containerY + 180;

      stats.forEach((s, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = startX + col * (boxW + 40);
        const y = startY + row * (boxH + 30);

        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.roundRect(x, y, boxW, boxH, 28);
        ctx.fill();

        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = "bold 58px Segoe UI";
        ctx.fillStyle = s.color;
        ctx.fillText(s.icon, x + 35, y + 75);

        ctx.font = "bold 28px Segoe UI";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(s.title, x + 200, y + 55);

        ctx.font = "18px Segoe UI";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(s.sub, x + 150, y + 90);

        ctx.font = "bold 42px Segoe UI";
        ctx.fillStyle = s.color;
        ctx.textAlign = "right";
        ctx.fillText(s.value, x + boxW - 35, y + 145);
        ctx.textAlign = "left";

        const barY = y + boxH - 30;
        const barW = boxW - 70;

        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.roundRect(x + 35, barY, barW, 12, 6);
        ctx.fill();

        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.roundRect(x + 35, barY, (barW * s.bar) / 100, 12, 6);
        ctx.fill();

        ctx.font = "bold 16px Segoe UI";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.min(s.bar, 100).toFixed(1)}%`, x + 35 + barW / 2, barY - 12);
        ctx.textAlign = "left";
      });
      
      const filePath = path.join(__dirname, `uptime-${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));
      
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      
      await message.reply({
        body: "◢◤━━━━━━━━━━━━━━━━◥◣\n      𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩𝟭 𝗨𝗣𝗧𝗜𝗠𝗘\n          𝗢𝗪𝗡𝗘𝗥:-𝗙𝗔𝗛𝗜𝗠\n◥◣━━━━━━━━━━━━━━━━◢◤",
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 5000);

    } catch (err) {
      console.error("Uptime error:", err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply("❌ Dashboard generate problem.");
    }
  }
};

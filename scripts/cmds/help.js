const axios = require("axios");
const { getPrefix, getStreamFromURL } = global.utils;
const { commands } = global.GoatBot;

let xfont = null;
let yfont = null;
let categoryEmoji = null;

const HELP_GIF = "https://files.catbox.moe/6touzq.mp4";

async function loadResources() {
  try {
    const [x, y, c] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json")
    ]);
    xfont = x.data;
    yfont = y.data;
    categoryEmoji = c.data;
  } catch (e) {
    console.error("[HELP] Resource load failed", e);
    xfont = xfont || {};
    yfont = yfont || {};
    categoryEmoji = categoryEmoji || {};
  }
}

function fontConvert(text, type = "command") {
  const map = type === "category" ? xfont : yfont;
  if (!map) return text;
  return text.split("").map(c => map[c] || c).join("");
}

function getCategoryEmoji(cat) {
  return categoryEmoji?.[cat.toLowerCase()] || "🗂️";
}

function roleText(role) {
  const roles = { 0: "All Users", 1: "Group Admins", 2: "Bot Admin" };
  return roles[role] || "Unknown";
}

function findCommand(name) {
  name = name.toLowerCase();
  for (const [, cmd] of commands) {
    const a = cmd.config?.aliases;
    if (cmd.config?.name === name) return cmd;
    if (Array.isArray(a) && a.includes(name)) return cmd;
    if (typeof a === "string" && a === name) return cmd;
  }
  return null;
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "2.0",
    author: "Saimx69x | fixed by Aphelion",
    role: 0,
    category: "info",
    shortDescription: "Show all commands",
    guide: "{pn} | {pn} <command> | {pn} -c <category>"
  },

  onStart: async function ({ message, args, event, role }) {
    if (!xfont || !yfont || !categoryEmoji) await loadResources();
    const prefix = getPrefix(event.threadID);
    const input = args.join(" ").trim();

    // Collect categories
    const categories = {};
    for (const [name, cmd] of commands) {
      if (!cmd?.config || cmd.config.role > role) continue;
      const cat = (cmd.config.category || "UNCATEGORIZED").toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    // If input is "-c <category>"
    if (args[0] === "-c" && args[1]) {
      const cat = args[1].toUpperCase();
      if (!categories[cat])
        return message.reply(`❌ Category "${cat}" not found`);

      let msg = `╭─────✰『 ${getCategoryEmoji(cat)} ${fontConvert(cat, "category")} 』\n`;
      for (const c of categories[cat].sort())
        msg += `│⚡ ${fontConvert(c)}\n`;
      msg += `╰────────────✰\n`;
      msg += `> TOTAL: ${categories[cat].length}\n> PREFIX: ${prefix}`;
      return message.reply({
        body: msg,
        attachment: await getStreamFromURL(HELP_GIF)
      });
    }

    // Main menu
    if (!input) {
      let msg = `╭───────❁\n│✨ 𝗙 𝗔 𝗥 𝗛 𝗔 𝗡 𝗛𝗘𝗟𝗣 𝗟𝗜𝗦𝗧 ✨\n╰────────────❁\n`;
      for (const cat of Object.keys(categories).sort()) {
        msg += `╭─────✰『 ${getCategoryEmoji(cat)} ${fontConvert(cat, "category")} 』\n`;
        for (const c of categories[cat].sort())
          msg += `│⚡ ${fontConvert(c)}\n`;
        msg += `╰────────────✰\n`;
      }
      const total = Object.values(categories).reduce((a, b) => a + b.length, 0);
      msg += `╭─────✰[🌟 𝐄𝐍𝐉𝐎𝐘 🌟]\n│> TOTAL COMMANDS: [${total}]\n│\n│> TYPE: [ ${prefix}HELP <COMMAND> ]\n│\n│> FB.LINK: [https://m.me/MR.MUNNA.220]\n╰────────────✰\n`;
      msg += `╭─────✰\n│ 💖 𝗦𝗜𝗭𝗨𝗞𝗔-𝗕𝗢𝗧 💖\n╰────────────✰`;

      return message.reply({
        body: msg,
        attachment: await getStreamFromURL(HELP_GIF)
      });
    }

    // Command info
    const cmd = findCommand(input);
    if (!cmd) return message.reply(`❌ Command "${input}" not found`);
    const c = cmd.config;
    const aliasText = Array.isArray(c.aliases) ? c.aliases.join(", ") : c.aliases || "None";
    let usage = "No usage";
    if (c.guide) {
      if (typeof c.guide === "string") usage = c.guide;
      else if (typeof c.guide === "object") usage = c.guide.en || Object.values(c.guide)[0] || "No usage";
      usage = usage.replace(/{pn}/g, `${prefix}${c.name}`);
    }

    const infoMsg = `
╭─── COMMAND INFO ───╮
🔹 Name : ${c.name}
📂 Category : ${(c.category || "UNCATEGORIZED").toUpperCase()}
📜 Description : ${c.longDescription || c.shortDescription || "N/A"}
🔁 Aliases : ${aliasText}
⚙️ Version : ${c.version || "1.0"}
🔐 Permission : ${roleText(c.role)}
⏱️ Cooldown : ${c.countDown || 5}s
👑 Author : ${c.author || "Unknown"}
📖 Usage : ${usage}
╰───────────────────╯`;

    return message.reply({
      body: infoMsg,
      attachment: await getStreamFromURL(HELP_GIF)
    });
  }
};

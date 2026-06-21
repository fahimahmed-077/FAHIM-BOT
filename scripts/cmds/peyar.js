const fs = require("fs");  
const path = __dirname + "/cache/peyar.json";  
  
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));  
  
// 🔒 AUTHOR LOCK  
const AUTHOR = "MR_FARHAN";  
  
module.exports.config = {  
  name: "peyar",  
  version: "1.2",  
  author: "MR_FARHAN",  
  category: "automation",  
  role: 0  
};  
  
// 🔒 Author Check  
function checkAuthor() {  
  if (module.exports.config.author !== AUTHOR) {  
    throw new Error("❌ Author name changed! Command locked.");  
  }  
}  
  
module.exports.onStart = async function ({ api, event, args }) {  
  
  checkAuthor();  
  
  const permission = global.GoatBot.config.adminBot || [];  
  
  if (!permission.includes(event.senderID)) {  
    return api.sendMessage("❌ | Only my boss farhan can use this command!", event.threadID, event.messageID);  
  }  
  
  let data = JSON.parse(fs.readFileSync(path));  
  
  if (args[0] == "off") {  
    delete data[event.threadID];  
    fs.writeFileSync(path, JSON.stringify(data, null, 2));  
    return api.sendMessage("✅ ওকে 𝗙𝗔𝗛𝗜𝗠 বস ম্যাডাম কে আর ভালোবাসা দিমু না!", event.threadID);  
  }  
  
  if (args[0] == "on") {  
  
    const mention = Object.keys(event.mentions)[0];  
    if (!mention) return api.sendMessage("❌ 𝗙𝗔𝗛𝗜𝗠 একজনকে মেনশন করুন!", event.threadID);  
  
    let name = event.mentions[mention];  
  
    try {  
      const userInfo = await api.getUserInfo(mention);  
      name = userInfo[mention]?.name || name;  
    } catch (e) {}  
  
    data[event.threadID] = {  
      uid: mention,  
      name: name,  
      index: 0  
    };  
  
    fs.writeFileSync(path, JSON.stringify(data, null, 2));  
  
    return api.sendMessage({  
      body: `𓆩»${name}«𓆪\n এই ম্যাডাম আপনি SMS করলেই বস 𝗙𝗔𝗛𝗜𝗠 এর পক্ষ থেকে হাজারো ভালোবাসা দিমু..😽😻`,  
      mentions: [{  
        id: mention,  
        tag: name  
      }]  
    }, event.threadID);  
  }  
  
  return api.sendMessage("ব্যবহার:\npeyar on @user\npeyar off", event.threadID);  
};  
  
module.exports.onChat = async function ({ api, event }) {  
  
  checkAuthor();  
  
  if (!event.body) return;  
  
  let data = JSON.parse(fs.readFileSync(path));  
  
  if (!data[event.threadID]) return;  
  
  const target = data[event.threadID];  
  
  if (event.senderID != target.uid) return;  

  // 🔥 FIX: command লিখলে রিপ্লাই দিবে না
  const prefix = global.GoatBot.config.prefix || "";
  if (prefix && event.body.startsWith(prefix)) return;
  
  const insults = [  
    "\nআমি আমার বস ফারহান এর পক্ষো থেকে সিজুকা বলতাছি, ☺️💝🌺...//",  
    "\nতোমার চিন্তা আমার মন থেকে কখনই যাবে না 🙂\nকারণ তুমি আমার চিন্তার চিন্তায় মিশে আছো💚",  
    "\nতুমি আমায় কি করলে তোমাকে ছাড়া আমি কিছু বুঝিনা কেন এই মন শুধু খোঁজে তোমাকে সারাক্ষণ😒",  
    "\nশুনো প্রিয় খুব ভালো বাসি তোমায়…🥰",  
    "\nতোমাকে দেখলে আমার এত ভালো লাগে কেন জান আমি কিছুই তো বুঝতে পারি না💚",  
    "\nজান তুমি এত সুন্দর কেন আমি যে তোমায় না দেখে থাকতে পারি না😻🥰💚",  
    "\nযখন থেকে পরী হয়ে বাসা বেধেঁছ আমার চোখে,\n\n তখন থেকে তুমি ছাড়া আর কিছুই ভালো লাগেনা…❤️",  
    "\nস্বর্গ আমি চাই না কারণ আমি তোমাকে পেয়েছি\n\nস্বপ্ন আমি দেখতে চাই না কারণ তুমিই আমার স্বপ্ন…🥀🥰💚",  
    "\nদিন শেষে আমার তোমাকেই লাগবে😽",  
    "\n༉༎༉😽!!লাইন টা তুমার জন্য  ডুবেছি আমি তুমার প্রেমের অনন্ত মায়ায় 🙈 ༅༎•❤️🌸",  
    "\nতোমাকে সব সময় পাশে চাই হয় এপারে না হয় ওপারে ⚜— -!!-।",  
    "\nযদি তুমি মনে করো সুখে নেই তবে তুমি ফিরে আসো আমার বুকে এখনো আগ্লে রাখবো তোমাকে!!💚",  
    "\nটমেটো লাল কাঁচা মরিচ ঝাল তোমার বুকের মাঝে চুমু দেবো আমি চিরকাল জান🙈🥀🥰",  
    "\n~🖤এক আকাশ সমান স্বপ্ন নিয়েতোমাকে ভালোবাসি প্রিয়🐰🦋🥰",  
    "\nলাস্ট এতোটুকই বলবো থাক বেশি হইয়া গেছে...😝🤭"  
  ];  
  
  let index = target.index;  
  
  api.sendMessage({  
    body: `${target.name} ${insults[index % insults.length]}`,  
    mentions: [{  
      id: target.uid,  
      tag: target.name  
    }]  
  }, event.threadID, event.messageID);  
  
  data[event.threadID].index++;  
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2));  
};

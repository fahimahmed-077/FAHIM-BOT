const axios = require("axios");

let imageIndex = 0;

module.exports = {
  config: {
    name: "sstime",
    version: "20.0.0",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Fast caption + image reply",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    // 🔒 Author lock
    if (this.config.author !== "Farhan-Khan") return;

    const admins = [
      {
        uid: "",
        names: ["sstime", "Sstime"]
      }
    ];

    const senderID = String(event.senderID);

    // ❌ Admin ignore
    if (admins.some(a => a.uid === senderID)) return;

    // ✅ ONLY EXACT MATCH /rules
    const text = (event.body || "").trim().toLowerCase();
    if (text !== "/sstime") return;

    const mentionedIDs = Object.keys(event.mentions || {});

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 🖼️ Image list
    const images = [
      "https://i.imgur.com/jh45907.jpeg"
    ];

    const imageUrl = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

    // ✍️ captions
    const captions = [
`‎‎‎‎╔═══════════════════╗
🌸❝"𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦-!:'༊!!-🦋

⎯͢♡⸙𝐁𝐋𝐀𝐂𝐊💠𝐒𝐓𝐀𝐑💠𝐀𝐋𝐋💠𝐂𝐄𝐎💠𝐁𝐎𝐗✺❥᭄


‎‎‎‎			⚠️𝐒𝐒 𝐓𝐈𝐌𝐄 𝐀 𝐍𝐎𝐓𝐈𝐂𝐄⚠️
			─━━━━━━⊱✿⊰━━━━━━─

📌- সকল 𝐂.𝐄.𝐎 𝐏𝐄𝐑𝐒𝐎𝐍 𝐀𝐃𝐌𝐈𝐍 এবং 𝐌𝐄𝐌𝐁𝐄𝐑𝐒 দের উদ্দেশ্য বলতেছি,__/🔊📣

📌- আজকে থেকে সবা'র 𝐒𝐒 টাইম বাংলাদেশ সময় ০৭:০০ থেকে ০৮:০০ পযন্ত ১০ মিনিট আগে কলে থাকতে হবে। [বাধ্যতামূলক]⚠️⚠️✅



📌- যদি কোনো মেম্বার  𝐒𝐒 টাইমে না আসে তাহলে এডমিন 𝐏𝐄𝐑𝐒𝐎𝐍 রিমুভ করতে বাধ্য থাকবে,,⚠️✅✅

📌- তো প্রতি টি পার্সন উপস্থিত থাকবে'ন 💯💯

✨ আশা করি সবাই বুঝতে পারছে'ন। 🌸🌸

☺️ তো ধন্যবাদ সবাই কে আর ভালোবাসা অবিরাম 🌸🫶

					💖আদেশ ক্রমে 💖
			─━━━⊱ADMIN⊰━━━─

@everyone ১৫+রিয়েক্ট চাই ❤️
১৫+ রিয়েক্ট না হওয়া পর্যন্ত টেক্সট অফ ✅📴 
১৫+ রিয়েক্ট কমপ্লিট করো ❤️💝
‎╚═══════════════════╝`
    ];

    const captionText = captions[Math.floor(Math.random() * captions.length)];
    const caption = ` ${captionText} `;

    try {
      // ⚡ Fast Image Fetch
      const imgStream = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
        timeout: 10000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      await message.reply({
        body: caption,
        attachment: imgStream.data
      });

    } catch (err) {
      console.log("❌ Image error:", err.message);
      await message.reply("😢 পিক দিতে পারলাম না");
    }
  }
};

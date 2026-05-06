module.exports = {
  config: {
    name: "sstime",
    version: "1.0.0",
    author: "MR_FARHAN",
    role: 0,
    shortDescription: "Group Rules",
    category: "group"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const groupName = threadInfo?.threadName || "Group";

      const imageUrl = "https://i.imgur.com/zHivkUd.jpeg";

      const rules = `‎🌸❝𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦-!:༊!!-🦋

          👇👇
‎${groupName}

      ⚠️𝐒𝐒 𝐓𝐈𝐌𝐄 𝐀 𝐍𝐎𝐓𝐈𝐂𝐄⚠️
			─━━━━━━⊱✿⊰━━━━━━─

📌- সকল 𝐂.𝐄.𝐎 𝐏𝐄𝐑𝐒𝐎𝐍 𝐀𝐃𝐌𝐈𝐍 এবং 𝐌𝐄𝐌𝐁𝐄𝐑𝐒 দের উদ্দেশ্য বলতেছি,__/🔊📣

📌- আজকে থেকে সবা'র 𝐒𝐒 টাইম বাংলাদেশ সময় ০৮:৩০ থেকে ০৯:৩০ পযন্ত ১০ মিনিট আগে কলে থাকতে হবে। [বাধ্যতামূলক]⚠️⚠️✅



📌- যদি কোনো মেম্বার  𝐒𝐒 টাইমে না আসে তাহলে এডমিন 𝐏𝐄𝐑𝐒𝐎𝐍 রিমুভ করতে বাধ্য থাকবে,,⚠️✅✅

📌- তো প্রতি টি পার্সন উপস্থিত থাকবে'ন 💯💯

✨ আশা করি সবাই বুঝতে পারছে'ন। 🌸🌸

☺️ তো ধন্যবাদ সবাই কে আর ভালোবাসা অবিরাম 🌸🫶

					💖আদেশ ক্রমে 💖
			─━━━⊱ADMIN⊰━━━─

@everyone ১৫+রিয়েক্ট চাই ❤️
১৫+ রিয়েক্ট না হওয়া পর্যন্ত টেক্সট অফ ✅📴 
১৫+ রিয়েক্ট কমপ্লিট করো ❤️💝‎`;

      const stream = await global.utils.getStreamFromURL(imageUrl);

      return message.reply({
        body: rules,
        attachment: [stream]
      });

    } catch (err) {
      console.log("Rules command error:", err);
      return message.reply("❌ Rules command failed to load.");
    }
  }
};

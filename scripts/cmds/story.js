const axios = require("axios");

module.exports = {
	config: {
		name: "story",
		aliases: ["shairi"],
		version: "2.0",
		author: "MR_FARHAN",
		countDown: 5,
		role: 0,
		shortDescription: "Random captions with video and owner link",
		longDescription: "Bangla + English captions with direct video and owner contact link",
		category: "𝗙𝗨𝗡",
		guide: "{pn}"
	},

	onStart: async function ({ message, api }) {
		const { messageID } = message;

		// 🔒 AUTHOR LOCK
		if (this.config.author !== "MR_FARHAN") {
			return message.reply("⚠️ Author change detected! Command disabled.");
		}

		try {
			api.setMessageReaction("⏳", messageID, () => {}, true);
		} catch {}

		let loadingMsg;
		try {
			loadingMsg = await message.reply("⚡ ᴠɪᴅᴇᴏ ʟᴏᴀᴅɪɴɢ...⚡");
		} catch {}

		// 🔥 Drive Links (Converted)
		const links = [
	    "1Z-6qll7ACq8Ka1pKpnC3guGcXU0gNvoL",
			"1YHm_oC7xItLokbt_MCWu-VdMGavvx-G4",
			"1YvDanPpMZKK4s547h9Bsf0uL719AvVEG",
			"1YemK-RQH3gUX_I9ThgNJLC89yPF-VtEY",
			"1YN25UGQQCpZvN29Y5a84ZCYlL-rc_JL_",
			"1YXbox7CyKc6Gu-56WAtAPlxSTs51Yo9n",
			"1YNVe1cEM0JM3lj7sU49tuJn4-8ASYVd8",
			"1ZDjeuPfIyUkovgmJCRsE7vE67aOe0Sp2",
			"1YcJciCtidcUxRGihUyx2uDgDg3cBYUE5",
			"1ZIE6xPwXg6_oxG0K7xCWKS04MNyag3QL",
			"1ZF9cOD_fj26rpWDf6WOjUQNz8QuRJhkv",
			"1ZAXQwA5BsnN555FrWii2bb-kdLaoMxLP",
			"1YvWRk-wQ_I8kuJzOuw2Mx7Q-Rrgbw6CT",
			"1Z8vKgEBUkKbwgMPvv_6K_lvVsrBca_X8",
			"1ZG-BJq7pP4oh93U6tHIKuYvZ8XiidlCV"
		];

		// 🎲 Random ID
		const randomID = links[Math.floor(Math.random() * links.length)];

		// ✅ Proper Direct Download Link
		const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;

		// 🎭 Multiple Captions
		const captions = [

`:༅༎💙🦋
༆𝐓𝐡𝐢𝐬 𝐚𝐛𝐨𝐮𝐭 𝐥𝐢𝐧𝐞_⚠︎🙅🏻‍♂️✨

😽︵۵মানুষ! হচ্ছে!বৃষ্টির!মতো!Life a ! অনেক মানুষ !আসবে!অনেক মানুষ !যাবে!💔🥰

:༅༎💙🦋 সঠিক!মানুষটা!ঠিকই!ছায়া!হয়ে!পাশে!থাকবে -/ ఌ︵💚🌻`,

`:(-𝙄 𝙖𝙢 𝘼𝙙𝙙𝙞𝙘𝙩𝙚𝙙 𝙏𝙤👀🙈

_')𝙈𝙮 𝙁𝙖𝙫𝙤𝙧𝙞𝙩𝙚 𝙋𝙚𝙧𝙨𝙤𝙣..!

🐰🦋 -(^আমি আমার প্রিয় মানুষটার প্রতি আসক্ত >!💖🔐)
🐹💙`,

`_𝗧𝗿𝘂𝘀𝘁 𝗺e 🔐💚
°
__!!✨🌺আপনাকে পাওয়ার দাবি!আমি মৃত্যুর পরও ছাড়বো না,,🔐💚
𝙗𝙚𝙡𝙞𝙚𝙫𝙚 𝙩𝙝𝙞𝙨 𝙡𝙞𝙣𝙚-!!🦋🐭`,

`🐰' —'পারফেক্ট' কাউকে পাবার থেকে'কাউকে' পারফেক্ট' বানিয়ে নিতে পারাটা' বড় অর্জন'--)🌼💜`,

`___🍒🖇️✨___
__𝗥𝗶𝗴𝗵𝘁 𝗽𝗲𝗼𝗽𝗹𝗲 𝗮𝗿𝗲 𝗮𝗹𝘄𝗮𝘆𝗲𝘀 𝗮𝗻𝗴𝗿𝘆 𝗯𝗲𝗰𝗮𝘂𝘀𝗲 𝘁𝗵𝗲𝘆 𝗰𝗮𝗻'𝘁 𝘀𝘁𝗮𝗻𝗱 𝘆𝗼𝘂 𝘄𝗶𝘁𝗵 𝗼𝘁𝗵𝗲𝗿𝘀🌸✨

___সঠিক মানুষ সব সময়ই রাগি হয়'
কারণ তারা অন্যের সাথে তোমাকে সহ্য করতে পারবে নাহ্!😌🫶`,
`--ღღ🦋🖤✨-\n\n--𝐋𝐨𝐯𝐞 𝐢'𝐬 𝐁𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥 __☺️🦋\n\n--𝐥𝐟 𝐭𝐡𝐞 𝐥𝐨𝐯𝐞𝐝 𝐨𝐧𝐞 𝐢𝐬 𝐫𝐢𝐠𝐡𝐭..!🦋🍁\n\n-ভালোবাসা সুন্দর ___,🖤🦋\n\n- যদি প্রিয় মানুষটি সঠিক হয়....!☺️🖤`,
`❥◎⃝! শূন্যতায় ভাসি🙃 \n\n❥কখনো হাসি -😁💚_আবার কাঁদি!-😅\n\n❥বেলা শেষে 🌌শূন্যতায় জড়িয়ে ও পূর্ণতা খুঁজি😊❤`,
`❥»̶̶͓͓͓̽̽̽⑅⃝✺❥᭄❥\n\n___💚__পৃথিবীটা আজ...\n\nমিথ্যে মায়াতে ভরা...!💚🌺\n\n____🥀_তাই তো পৃথীবীর মানুষ আজ....!\n\nঅভিনয়ের সেরা...👎🥀`,
`💜🔐 ___\n\n- 𝗧𝗵𝗶𝘀 𝗮𝗯𝗼𝘂𝘁 𝗹𝗶𝗻𝗲-!! 😽🧡\n\n🍁_সবাই তো খুশি চায়_আর আমি প্রতিটা খুশিতে তোমাকে চাই⚜️— -!!-) 😊🖤\n\n___💜🔐`,
`>🐰✨𝑻𝒉𝒊𝒔 𝒍𝒊𝒏𝒆 𝒊𝒔 𝒇𝒐𝒓 𝒚𝒐𝒖🖤🌸\n\n___চোখের দেখায় নয়,মনের দেখায় ভালবাসি!!😇✨\n\n- কাছে থাকো কিংবা দূরে,তোমাকে ভেবেই হাসি!!🖤🐰`,
`🐰🍒শী্ঁত্ঁ শী্ঁত্ঁ ভা্ঁব্ঁ কি্ঁসে্ঁর্ঁ জা্ঁনি্ঁ এ্ঁক্ঁটা্ঁ অ্ঁভা্ঁব্ঁ_🙊🙈`
		];

		// 🎲 Random Caption
		const caption = captions[Math.floor(Math.random() * captions.length)];

		const footer = `\n✢━━━━━━━━━━━━━━━✢\n--❖(✷‿𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓‿✷)❖--\n✢━━━━━━━━━━━━━━━✢\n(✷‿𝐎𝐖𝐍𝐄𝐑:-𝗙𝗔𝗛𝗜𝗠‿✷)`;

		try {
			const stream = await global.utils.getStreamFromURL(videoURL);

			await message.reply({
				body: caption + footer,
				attachment: stream
			});

			if (loadingMsg) api.unsendMessage(loadingMsg.messageID);
			api.setMessageReaction("✅", messageID, () => {}, true);

		} catch (err) {
			console.error(err);
			api.setMessageReaction("❌", messageID, () => {}, true);
			message.reply("❌ Video load failed!");
		}
	}
};

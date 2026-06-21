const axios = require("axios");

module.exports = {
	config: {
		name: "anime",
		aliases: ["animevideo","cartoon"],
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
			loadingMsg = await message.reply("⚡ ᴠɪᴅᴇᴏ-ʟᴏᴀᴅɪɴɢ...⚡");
		} catch {}

		// 🔥 Drive Links (Converted)
		const links = [
"18-qJqj0yJOe1DnqtKCtt2BA6aL4Lsu1V",
"18_dfqfqJ7Izv_V39udjqHIhL9VNXJ9g8",
"1AtMec3fO0qsocLBjbbAealc18pZeC8-3",
"194QHUiobsj_4gWEnC1vJxQUMZjDz1J97",
"18f4u2I-yIu6k1oZwurqJqfUlX9m13Yfi",
"18phpGz_zhEGCOqouvqjrlvN7fOwxPO1S",
"18SDweGtqRP07XHAZ78mLAJkTo1xg8xyO",
"19RC6Qb5nfhTsQf3DRswH43jeJbNujk4w",
"18Uj2jMSvnLcrt_CEt-6aAHcAchp9BZDr",
"1A6ZnUeVgg_4Tcdk1zUiC7kPurAuCC1G8",
"17Iz2LT8PksDU_J0oe_7vjxhSZ94rDCB-",
"17GwnxijuRcwillJdh3j6V1zMwDQYW7sh",
"18NTG35pSgG62HjcwYStMyqFKyLZZr44-",
"17sXmHH3SuHjo3vK7WNlhDurfSUYhujpK",
"18L_R_6WNGHUJecWPfIuTMPNxq-V1EAcQ",
"18CMe0QbZQMHxVSuFpy6iAKtZ7ln5sBMh",
"17kgktlBZxMlfY2tDOyhbWAXy9VT7v1hs",
"17n7w5omJRNZz5Rt-D8Aa_1dy6jvZmObA",
"17iLYInZF3fvnaPxIrghmZkesoFmTBMgP",
"1B8eBVs6yEtwjtGqtROznYSR9P4kbVLYV",
"1ADJiq0rVkJqI2b8CGaaiOW6EOC7gYl0d",
"1ADjoiJt8uyfuGU9fSTP8CS5WNBRs7Yl3",
"17VXDfR9FCQadHDaTgxCfZY__GtCGigDc",
"19ZbhvqxQ9C9wi_ix9ghtrjggDNmbxda5",
"1BLirFfDf1NOvVygV4Y9Vs5YjzsgubR4G",
"1BBl0ZNDknIOldhXwnSoaYnSjJOFcbHfh",
"1BGTYnjqwoLyFcbSgtYL3lHnUeg2Titg8",
"188tNbHkrWHEV83Yi4oar4WmMFt6pr9xi",
"17ciTd5xEe9LTg9qpmmv6XdFtuR-Zf0vA",
"18pg1AphOv5hXdFBnQ7ZCcBzV6sFWDZ7N",
"19WfOG5qDAeXwJq7Vhkhbix62VYTLXfzR",
"17x_PrTSg12y-JFrG6ncERdQPjcWviFiM",
"18NB5pdSAr4A5kL0hE5uJGZgZxxvLmCYm",
"18iJTgtTuZsAtZ3dX7MYxTNM_HaFI4j0T",
"1AIk2R8okqECAofSlFwhQXgGtWsqvv-TV",
"195z7g6QzRELQmcmUE9ENT7E8-1DjvvXk",
"1ATQuJ6Wkxy4UlbrmRY-0peyDqJ4pSgmX",
"17KukJVRpSDTjVHdUgETAeM234BueSk4S",
"1777G3gps_igQxFXVmJYFXs_DzCNB672s",
"1ANjcA1xmzF8w6ilYYStgk4woCs4ntof6",
"18-Np_hMb5qhmhgtzzKDD9Ntm_p8Gi2aD",
"1Azc5n_6sRadjtwCgJcKgtOZxN2c77gdG"
		];

		const randomID = links[Math.floor(Math.random() * links.length)];
		const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;

		const caption = `✢━━━━━━━━━━━━━━━✢\n✨ 𝐑𝐚𝐧𝐝𝐨𝐦 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 🎬\n𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐦𝐨𝐦𝐞𝐧𝐭 💫`;

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

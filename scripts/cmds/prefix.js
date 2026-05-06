const fs = require("fs-extra");
const moment = require("moment-timezone");

const getStreamFromURL = global.utils.getStreamFromURL;

const gifList = [
"https://files.catbox.moe/hrzwco.mp4",
"https://files.catbox.moe/hrzwco.mp4"
];

const getRandomGif = () =>
	gifList[Math.floor(Math.random() * gifList.length)];

module.exports = {
	config: {
		name: "prefix",
		version: "2.2",
		author: "Farhan-Khan",
		countDown: 5,
		role: 0,
		description: "Change & show bot prefix ",
		category: "config"
	},

	langs: {
		en: {
			usage: "❌ 𝐔𝐬𝐚𝐠𝐞: 𝐩𝐫𝐞𝐟𝐢𝐱 <𝐧𝐞𝐰𝐏𝐫𝐞𝐟𝐢𝐱> | 𝐩𝐫𝐞𝐟𝐢𝐱 𝐫𝐞𝐬𝐞𝐭 | 𝐩𝐫𝐞𝐟𝐢𝐱 <𝐧𝐞𝐰𝐏𝐫𝐞𝐟𝐢𝐱> %1",
			reset: "✅ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐫𝐞𝐬𝐞𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥!\n🔰 𝐒𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱: %1",
			onlyAdmin: "⛔ 𝐎𝐧𝐥𝐲 𝐛𝐨𝐭 𝐚𝐝𝐦𝐢𝐧 𝐜𝐚𝐧 𝐜𝐡𝐚𝐧𝐠𝐞 𝐠𝐥𝐨𝐛𝐚𝐥 𝐩𝐫𝐞𝐟𝐢𝐱.",
			confirmGlobal: "__________________________________🗨️=𝐆𝐥𝐨𝐛𝐚𝐥 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗵𝗮𝗻𝗴𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱.\n👉=𝗥𝗲𝗮𝗰𝘁 𝘄𝗶𝘁𝗵 𝗲𝗺𝗼𝗷𝗶 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺.✅.                                                                                                                                                                                   __________________________________",
			confirmThisThread: "__________________________________🗨️=𝗚𝗿𝗼𝘂𝗽 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗵𝗮𝗻𝗴𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱.\n👉=𝗥𝗲𝗮𝗰𝘁 𝘄𝗶𝘁𝗵 𝗲𝗺𝗼𝗷𝗶 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺.✅.                                                                                                                                                                                 __________________________________",
			successGlobal: "✅ 𝐆𝐑𝐎𝐔𝐏 𝐏𝐑𝐄𝐅𝐈𝐗 𝐂𝐇𝐀𝐍𝐆𝐄𝐃!\n🆕 𝐍𝐄𝐖 𝐏𝐑𝐄𝐅𝐈𝐗: %1",
			successThisThread: "✅ 𝐆𝐑𝐎𝐔𝐏 𝐏𝐑𝐄𝐅𝐈𝐗 𝐂𝐇𝐀𝐍𝐆𝐄𝐃!\n🆕 𝐍𝐄𝐖 𝐏𝐑𝐄𝐅𝐈𝐗: %1"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.reply(getLang("usage"));

		const gif = getRandomGif();

	if (args[0] == 'reset') {
	await threadsData.set(event.threadID, null, "data.prefix");
	return message.reply(getLang("reset", global.GoatBot.config.prefix));
	}

		const newPrefix = args[0];
		const setGlobal = args[1] === "-g";

		if (setGlobal && role < 2)
			return message.reply(getLang("onlyAdmin"));

		const confirmMsg = setGlobal
			? getLang("confirmGlobal")
			: getLang("confirmThisThread");

		message.reply({
			body: confirmMsg,
			attachment: await getStreamFromURL(gif)
		}, (err, info) => {
			if (err) return;

			global.GoatBot.onReaction.set(info.messageID, {
				commandName,
				author: event.senderID,
				newPrefix,
				setGlobal
			});
		});
	},

	onReaction: async function ({ event, message, threadsData, Reaction, getLang }) {
		
		if (event.userID !== Reaction.author) return;

		global.GoatBot.onReaction.delete(event.messageID);

		if (Reaction.setGlobal) {
			global.GoatBot.config.prefix = Reaction.newPrefix;
			fs.writeFileSync(
				global.client.dirConfig,
				JSON.stringify(global.GoatBot.config, null, 2)
			);
			return message.reply(
				getLang("successGlobal", Reaction.newPrefix)
			);
		}

		await threadsData.set(
			event.threadID,
			Reaction.newPrefix,
			"data.prefix"
		);

		return message.reply(
			getLang("successThisThread", Reaction.newPrefix)
		);
	},

	onChat: async function ({ event, message, threadsData }) {
		if (!event.body || event.body.toLowerCase() !== "prefix") return;

		const gif = getRandomGif();

		const systemPrefix = global.GoatBot.config.prefix;
		const groupPrefix = global.utils.getPrefix(event.threadID);

		const threadInfo = await threadsData.get(event.threadID);
		const groupName = threadInfo?.threadName || "Unknown Group";

		const time = moment().tz("Asia/Dhaka").format("hh:mm A");
		const date = moment().tz("Asia/Dhaka").format("DD MMM YYYY");

		const owner = global.GoatBot.config.adminName || "𝐅𝐀𝐑𝐇𝐀𝐍";

		return message.reply({
			body:
`╭━━━〔《𓆩𝐏𝐑𝐄𝐅𝐈𝐗𓆪》〕━━━╮
┃🏷️『𝐆𝐑𝐎𝐔𝐏』:↓
✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
《 ${groupName} 》
✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
┃🔰『𝐒𝐘𝐒𝐓𝐄𝐌』: 《 ${systemPrefix} 》
┃
┃💬『𝐆𝐑𝐎𝐔𝐏』: 《 ${groupPrefix} 》
┃
┃⏰『𝐓𝐈𝐌𝐄』: 《 ${time} 》
┃
┃📅『𝐃𝐀𝐓𝐄』:《 ${date} 》
┃
┃👑『𝐎𝐖𝐍𝐄𝐑』: 《${owner}》
┃
┃⚡『𝐒𝐓𝐀𝐓𝐔𝐒』: 《𝐎𝐍𝐋𝐈𝐍𝐄》
╰━━━〔《𓆩𝐒𝐈𝐙𝐔𝐊𝐀𓆪》〕━━━╯`,
			attachment: await getStreamFromURL(gif)
		});
	}
};

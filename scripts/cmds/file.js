const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.0",
		author: "MR_FARHAN",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["61584807686126",];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("𝐤𝐡𝐚𝐧𝐤𝐢𝐫 𝐜𝐡𝐞𝐥𝐞 𝐣𝐚 𝐯𝐚𝐠𝐠𝐠 𝐛𝐨𝐭 𝐤𝐢 𝐭𝐨𝐫 𝐛𝐚𝐩𝐞𝐫...🖕😒", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};

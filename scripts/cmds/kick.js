module.exports = {
	config: {
		name: "kick",
		version: "1.4",
		author: "NTKhang & Edited By Farhan",
		countDown: 5,
		role: 1,
		description: {
			vi: "গ্রুপ থেকে সদস্যকে বের করে দেয়",
			en: "Kick member from group"
		},
		category: "owner",
		guide: {
			vi: "{pn} @mention\nঅথবা কারো মেসেজে রিপ্লাই দিয়ে {pn}",
			en: "{pn} @mention\nor reply to a user's message and use {pn}"
		}
	},

	onStart: async function ({ api, event, message }) {
		try {
			const threadInfo = await api.getThreadInfo(event.threadID);

			const botIsAdmin = threadInfo.adminIDs.some(
				admin => admin.id == api.getCurrentUserID()
			);

			if (!botIsAdmin)
				return message.reply("❌ আগে বটকে গ্রুপের অ্যাডমিন করুন।");

			let uid = null;

			// রিপ্লাই করা ইউজার
			if (event.messageReply) {
				uid = event.messageReply.senderID;
			}

			// মেনশন করা ইউজার
			else if (event.mentions && Object.keys(event.mentions).length > 0) {
				uid = Object.keys(event.mentions)[0];
			}

			if (!uid)
				return message.reply("⚠️ কাউকে মেনশন করুন অথবা তার মেসেজে রিপ্লাই দিন।");

			// গ্রুপ মালিককে কিক না করার জন্য
			if (uid == threadInfo.threadOwnerID)
				return message.reply("❌ গ্রুপের মালিককে বের করা যাবে না।");

			await api.removeUserFromGroup(uid, event.threadID);

			return message.reply("✅ সদস্যকে সফলভাবে গ্রুপ থেকে বের করে দেওয়া হয়েছে।");

		} catch (err) {
			console.log(err);
			return message.reply("❌ সদস্যকে বের করা যায়নি। বট অ্যাডমিন আছে কিনা যাচাই করুন।");
		}
	}
};

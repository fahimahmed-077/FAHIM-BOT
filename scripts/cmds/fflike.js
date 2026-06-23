const axios = require('axios');

module.exports = {
    config: {
        name: "fflike",
        version: "1.0.0",
        author: "akashx404",
        countDown: 5,
        role: 0,
        shortDescription: "Send Free Fire likes",
        longDescription: "Send likes to a Free Fire player using API proxy",
        category: "game",
        guide: {
            en: "{pn} <uid> <server_code>"
        }
    },

    onStart: async function ({ api, event, args, message }) {
        const uid = args[0];
        const server = args[1]?.toLowerCase();
        
        // Valid server codes
        const validServers = ['bd', 'ind', 'id', 'sg', 'th', 'vn', 'br', 'ru'];
        
        if (!uid || !server) {
            return message.reply(
                "❌ | Wrong Format\n" +
                "Please use: fflike <uid> <server_code>\n\n" +
                "🌍 Server Codes:\n" +
                "• bd - Bangladesh\n" +
                "• ind - India\n" +
                "• id - Indonesia\n" +
                "• sg - Singapore\n" +
                "• th - Thailand\n" +
                "• vn - Vietnam\n" +
                "• br - Brazil\n" +
                "• ru - Russia\n\n" +
                "Example: fflike 6967621174 bd"
            );
        }
        
        if (!validServers.includes(server)) {
            return message.reply(
                "❌ | Invalid server code!\n" +
                "Valid codes: bd, ind, id, sg, th, vn, br, ru"
            );
        }

        // Send loading message
        const loadingMsg = await message.reply(`⏳ | Sending like to UID: ${uid} (${server})...`);

        try {
            // Call your Render API
            const response = await axios.get(
                `https://akashx404-ff-liker-api.onrender.com/like`,
                {
                    params: {
                        uid: uid,
                        server_name: server
                    },
                    timeout: 10000
                }
            );

            const data = response.data;
            
            if (data.success) {
                const playerData = data.data;
                
                // Status message mapping
                const statusMsg = {
                    0: "✅ | Likes sent successfully!",
                    1: "⚠️ | Already liked today!",
                    2: "⏳ | No likes given (cooldown period)",
                    3: "❌ | Invalid UID or server"
                };
                
                const statusText = statusMsg[playerData.status] || "Unknown status";
                
                let replyMsg = 
                    "━━━━━━━━━━━━━━━━\n" +
                    "   FREE FIRE LIKES\n" +
                    "━━━━━━━━━━━━━━━━\n" +
                    `👤 Nickname: ${playerData.PlayerNickname || 'Unknown'}\n` +
                    `🆔 UID: ${playerData.UID || uid}\n` +
                    `🌍 Server: ${server.toUpperCase()}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `❤️ Likes Before: ${playerData.LikesbeforeCommand || 0}\n` +
                    `❤️ Likes After: ${playerData.LikesafterCommand || 0}\n` +
                    `✨ Given: ${playerData.LikesGivenByAPI || 0}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `📊 Status: ${statusText}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `⚡ Powered by Fahim\n` +
                    `━━━━━━━━━━━━━━━━`;
                
                // Edit the loading message with result
                api.editMessage(replyMsg, loadingMsg.messageID);
            } else {
                api.editMessage("❌ | API Error: " + (data.error || "Unknown error"), loadingMsg.messageID);
            }
            
        } catch (error) {
            console.error("FF Like Error:", error.message);
            
            let errorMsg = "❌ | Failed to connect to API server.\n";
            
            if (error.code === 'ECONNABORTED') {
                errorMsg = "❌ | Request timeout. Server took too long to respond.";
            } else if (error.response) {
                errorMsg = "❌ | API Error: " + (error.response.data.error || "Server error");
            }
            
            api.editMessage(errorMsg, loadingMsg.messageID);
        }
    }
};

const axios = require("axios");

const mahmud = [
        "babu",
        "bbz",
        "বট",
        "𝙗𝙤𝙩",
        "sizu",
        "baby",
        "bby",
        "সিজু",
        "bbu",
        "jan",
        "সিজুকা",
        "জান",
        "জানু",
        "বেবি",
        "sizuka",
        "𝐛𝐨𝐭",
        "𝗯𝗼𝘁"
];

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

// 🔥 helper
const getName = async (api, uid) => {
        try {
                const info = await api.getUserInfo(uid);
                return info[uid]?.name || "User";
        } catch (e) {
                return "User";
        }
};

// 🔥 mention control helper
const makeMessage = (text, name, uid, event) => {
        const isReply = event.type === "message_reply";

        if (isReply) {
                return { body: text }; // ❌ no mention
        }

        return {
                body: `𓆩» ${name} «𓆪\n\n${text}`,
                mentions: [{ tag: name, id: uid }]
        };
};

module.exports = {
        config: {
                name: "hinata",
                aliases: ["baby", "bby", "bbu", "jan", "janu", "sizu", "SIZUKA"],
                version: "1.8",
                author: "FARHAN-KHAN",
                countDown: 2,
                role: 0,
                description: {
                        bn: "হিনাতা এআই এর সাথে চ্যাট করুন এবং তাকে নতুন কিছু শেখান",
                        en: "Chat with Hinata AI and teach her new things",
                        vi: "Trò chuyện with Hinata AI and teach her new things"
                },
                category: "chat",
                guide: {
                        bn: '   {pn} [মেসেজ] - চ্যাট করতে\n   {pn} teach [প্রশ্ন] - [উত্তর] - শেখাতে\n   {pn} msg [প্রশ্ন] - উত্তর খুঁজতে\n   {pn} edit [প্রশ্ন] - [নতুন উত্তর] - এডিট করতে\n   {pn} remove [প্রশ্ন] - [ইনডেক্স] - ডিলিট করতে\n   {pn} list/list all - টিচার লিস্ট দেখতে',
                        en: '   {pn} [msg] - to chat\n   {pn} teach [q] - [a] - to teach\n   {pn} msg [q] - search reply\n   {pn} edit [q] - [new_a] - to edit\n   {pn} remove [q] - [index] - to remove\n   {pn} list/list all - to see teachers',
                        vi: '   {pn} [tn] - để trò chuyện\n   {pn} teach [h] - [tl] - để dạy\n   {pn} msg [h] - tìm kiếm câu trả lời\n   {pn} edit [h] - [tl_mới] - để sửa\n   {pn} remove [h] - [số] - để xóa\n   {pn} list/list all - để xem danh sách'
                }
        },

        langs: {
                bn: {
                        noInput: "বলো বেবি😘",
                        teachUsage: "❌ | সঠিক নিয়ম: teach [প্রশ্ন] - [উত্তর]",
                        teachSuccess: "✅ উত্তর যুক্ত হয়েছে: \"%1\" -> \"%2\"\n• টিচার: %3\n• মোট ডাটা: %4",
                        removeUsage: "❌ | সঠিক নিয়ম: remove [প্রশ্ন] - [ইনডেক্স]",
                        editUsage: "❌ | সঠিক নিয়ম: edit [প্রশ্ন] - [নতুন উত্তর]",
                        editSuccess: "✅ সফলভাবে এডিট করা হয়েছে!\n• প্রশ্ন: \"%1\"\n• নতুন উত্তর: \"%2\"",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Format: teach [question] - [answer]",
                        teachSuccess: "✅ Reply added: \"%1\" -> \"%2\"\n• Teacher: %3\n• Total: %4",
                        removeUsage: "❌ | Format: remove [question] - [index]",
                        editUsage: "❌ | Format: edit [question] - [new answer]",
                        editSuccess: "✅ Successfully edited!\n• Q: \"%1\"\n• New A: \"%2\"",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Định dạng: teach [câu hỏi] - [câu trả lời]",
                        teachSuccess: "✅ Đã thêm câu trả lời: \"%1\" -> \"%2\"\n• Giáo viên: %3\n• Tổng số: %4",
                        removeUsage: "❌ | Định dạng: remove [câu hỏi] - [số]",
                        editUsage: "❌ | Định dạng: edit [câu hỏi] - [câu trả lời mới]",
                        editSuccess: "✅ Đã sửa thành công!\n• H: \"%1\"\n• TL mới: \"%2\"",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, usersData, getLang, commandName }) {

                const uid = event.senderID;
                const name = await getName(api, uid);

                if (!args[0]) {
                        return api.sendMessage(
                                makeMessage(getLang("noInput"), name, uid, event),
                                event.threadID,
                                (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                                },
                                event.messageID
                        );
                }

                try {
                        const baseUrl = await baseApiUrl();
                        const action = args[0].toLowerCase();

                        if (action === "teach") {
                                const input = args.slice(1).join(" ");
                                const [trigger, ...responsesArr] = input.split(" - ");
                                const responses = responsesArr.join(" - ");

                                if (!trigger || !responses)
                                        return api.sendMessage(getLang("teachUsage"), event.threadID, event.messageID);

                                const res = await axios.post(`${baseUrl}/api/jan/teach`, {
                                        trigger,
                                        responses,
                                        userID: uid
                                });

                                return api.sendMessage(
                                        makeMessage(
                                                getLang("teachSuccess", trigger, responses, name, res.data.count),
                                                name,
                                                uid,
                                                event
                                        ),
                                        event.threadID,
                                        event.messageID
                                );
                        }

                        const res = await axios.post(`${baseUrl}/api/hinata`, {
                                text: args.join(" "),
                                style: 3,
                                attachments: event.attachments || []
                        });

                        return api.sendMessage(
                                makeMessage(res.data.message, name, uid, event),
                                event.threadID,
                                (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                                },
                                event.messageID
                        );

                } catch (err) {
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        },

        onReply: async function ({ api, event, commandName }) {

                const uid = event.senderID;
                const name = await getName(api, uid);

                try {
                        const baseUrl = await baseApiUrl();

                        const res = await axios.post(`${baseUrl}/api/hinata`, {
                                text: event.body?.toLowerCase() || "hi",
                                style: 3,
                                attachments: event.attachments || []
                        });

                        return api.sendMessage(
                                makeMessage(res.data.message, name, uid, event),
                                event.threadID,
                                (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                                },
                                event.messageID
                        );

                } catch (err) {
                        console.error(err);
                }
        },

        onChat: async function ({ api, event, commandName }) {

                const message = event.body?.toLowerCase() || "";

                if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {

                        const uid = event.senderID;
                        const name = await getName(api, uid);

                        const randomReplies = [
"𝗕𝗮𝗯𝘆 𝗞𝗵𝘂𝗱𝗮 𝗟𝗮𝗴𝗰𝗵𝗲🥺",
"𝗛𝗼𝗽 𝗕𝗲𝗱𝗮😾,𝗕𝗼𝘀𝘀 বল 𝗕𝗼𝘀𝘀😼",
"আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",
"𝗡𝗮𝘄 𝗔𝗺𝗮𝗿 𝗕𝗼𝘀𝘀 𝗞 𝗠𝗲𝗮𝘀𝘀𝗮𝗴𝗲 𝗗𝗮𝘄 https://m.me/fahim.ahmed.raj.207",
"গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
"বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
"𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘",
"এটায় দেখার বাকি সিলো_🙂🙂🙂",
"𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
"𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
"বেশি 𝗕𝗯𝘆 𝗕𝗲𝗯𝘆 করলে 𝗟𝗲𝗮𝘃𝗲 নিবো কিন্তু 😒😒",
"বেশি বেবি বললে কামুর দিমু 🤭🤭",
"𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
"আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
"𝗕𝗯𝘆 বললে চাকরি থাকবে না",
"𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, ফাহিম, ফাহিম ও তো করতে পারো😑?",
"আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
"🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
"হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
"𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
"আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
"খাওয়া দাওয়া করসো 🙄",
"এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
"আরে আমি মজা করার 𝗠𝗼𝗼𝗱 এ নাই😒",
"𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
"আরে Bolo আমার জান, কেমন আসো? 😚",
"একটা 𝗕𝗙 খুঁজে দাও 😿",
"𝗢𝗶 𝗠𝗮𝗺𝗮 𝗔𝗿 𝗗𝗮𝗸𝗶𝘀 𝗡𝗮 𝗣𝗶𝗹𝗶𝘇 😿",
"𝗔𝗺𝗮𝗿 𝗝𝗮𝗻𝘂 𝗟𝗮𝗴𝗯𝗲 𝗧𝘂𝗺𝗶 𝗞𝗶 𝗦𝗶𝗻𝗴𝗲𝗹 𝗔𝗰𝗵𝗼?",
"আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
"তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
"আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না🙄",
"চৌধুরী সাহেব আমি ফাহিম গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
"আমি অন্যের জিনিসের সাথে কথা বলি না_😏ওকে",
"বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
"ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
"শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
"আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
"বলো কি করতে পারি তোমার জন্য 😚",
"কথা দেও আমাকে পটাবা...!! 😌",
"বার বার Disturb করেছিস কোনো, আমার জানু এর সাথে ব্যাস্ত আসি 😋",
"আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
"বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
"Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
"আজকে আমার mন ভালো নেই 🙉",
"আমি হাজারো মশার 𝗖𝗿𝘂𝘀𝗵😓",
"ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
"__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
"মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚"
                        ];

                        const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];

                        return api.sendMessage(
                                makeMessage(reply, name, uid, event),
                                event.threadID,
                                (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "hinata", author: uid });
                                },
                                event.messageID
                        );
                }
        }
};

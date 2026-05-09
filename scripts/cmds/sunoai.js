const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const apiUrl = "https://www.noobs-apis.run.place";

module.exports.config = {
  name: "sunoai",
  aliases: ["sunomusic", "aimusic", "aisong", "suno"],
  version: "1.6.9",
  author: "MR_FARHAN",
  role: 0,
  description: "Generate music using Suno AI",
  category: "ai",
  countDown: 15,
  guide: {
    en: "{pn} <prompt> - Generate music from text\n{pn} <prompt> -custom true -title \"Song Title\" -style pop -vocalGender male/female - Create with custom parameters"
  }
};

module.exports.onStart = async function ({ message, event, args }) {
  if (args.length === 0) {
    return message.reply(`Please provide a prompt for the song!\n\nExamples:\n• ${global.GoatBot.config.prefix}suno A happy love song about summer\n• ${global.GoatBot.config.prefix}suno A rock song about dragons -custom true -title \"Dragon's Fire\" -style rock\n• ${global.GoatBot.config.prefix}suno Create an instrumental jazz track -custom true -instrumental true -style jazz\n• ${global.GoatBot.config.prefix}suno A romantic ballad -custom true -vocalGender female -style pop`);
  }

  const params = parseArgs(args);
  
  if (params.prompt === "") {
    return message.reply("Please provide a prompt for the song!");
  }

  await message.reaction("⏳", event.messageID);
  
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("prompt", params.prompt);
    
    if (params.customMode !== null) {
      queryParams.append("customMode", params.customMode.toString());
    }
    
    if (params.instrumental !== null) {
      queryParams.append("instrumental", params.instrumental.toString());
    }
    
    if (params.style) {
      queryParams.append("style", params.style);
    }
    
    if (params.title) {
      queryParams.append("title", params.title);
    }
    
    if (params.vocalGender) {
      queryParams.append("vocalGender", params.vocalGender);
    }

    const apiEndpoint = `${apiUrl}/nazrul/sunoAi2?${queryParams.toString()}`;
    
    const response = await axios.get(apiEndpoint);
    
    if (!response.data.success) {
      return message.reply(`Error: ${response.data.msg || "× Failed to generate song"}`);
    }
    
    const result = response.data.result;
    
    if (!result || result.total === 0 || !result.rows || result.rows.length === 0) {
      return message.reply("× No songs were generated. Please try again with a different prompt!");
    }
    
    const completedSongs = result.rows.filter(song => song.status === "completed");
    
    if (completedSongs.length === 0) {
      return message.reply("× Song generation is still in progress. Please wait a moment and try again!");
    }
    
    let messageBody = `🎵 Suno AI Generated Songs\n\n`;
    messageBody += `#• Prompt: ${params.prompt}\n`;
    if (params.title) messageBody += `#• Title: ${params.title}\n`;
    if (params.style) messageBody += `#• Style: ${params.style}\n`;
    if (params.vocalGender) messageBody += `#• Vocal: ${params.vocalGender}\n`;
    messageBody += `#• Instrumental: ${params.instrumental || false}\n\n`;
    
    const thumbnails = [];
    
    for (let i = 0; i < completedSongs.length; i++) {
      const song = completedSongs[i];
      messageBody += `${i + 1}. ${song.title || "Untitled"}\n`;
      messageBody += `#• Lyrics ${song.lyrics || "Not Found!"}\n`;
      messageBody += `#• Duration: ${Math.round(song.musicDuration / 1000) || 0} seconds\n`;
      messageBody += `#• Size: ${(song.musicSize / 1024 / 1024).toFixed(2)} MB\n`;
      
      if (song.coverThumbnailUrl) {
        try {
          const imageResponse = await axios.get(song.coverThumbnailUrl, { 
            responseType: "arraybuffer",
            timeout: 10000
          });
          const imageFilename = `cover_${i}_${Date.now()}.jpg`;
          const imagePath = path.join(__dirname, imageFilename);
          await fs.writeFile(imagePath, imageResponse.data);
          thumbnails.push(fs.createReadStream(imagePath));
        } catch (imageError) {
          console.log("× Could not download cover image:", imageError.message);
        }
      }
    }
    
    messageBody += `\n#• Reply with the number (1-${completedSongs.length}) to download that song`;
    
    await message.reaction("✅", event.messageID);
    
    const sentMessage = await message.reply({
      body: messageBody,
      attachment: thumbnails
    });
    
    setTimeout(() => {
      try {
        const files = fs.readdirSync(__dirname).filter(f => f.startsWith('cover_') && f.endsWith('.jpg'));
        files.forEach(f => fs.unlinkSync(path.join(__dirname, f)));
      } catch (e) {}
    }, 5000);
    global.GoatBot.onReply.set(sentMessage.messageID, {
      commandName: module.exports.config.name,
      type: "song_selection",
      messageID: sentMessage.messageID,
      author: event.senderID,
      songs: completedSongs,
      prompt: params.prompt,
      style: params.style,
      title: params.title
    });
    
  } catch (error) {
    await message.reaction("❌", event.messageID);
    
    if (error.response) {
      console.error("API Error:", error.response.data);
      if (error.response.status === 429) {
        return message.reply("× Too many requests. Please wait a while before trying again!");
      }
      return message.reply(`API Error: ${error.response.data.msg || error.response.statusText}`);
    } else if (error.request) {
      return message.reply("× Network error. Please check your connection and try again!");
    } else {
      console.error("Error:", error.message);
      return message.reply("× Failed to generate song. Please check your prompt and try again!");
    }
  }
};

module.exports.onReply = async function ({ event, message, Reply }) {
  const { type, songs, messageID, author, prompt, style, title } = Reply;
  
  if (event.senderID !== author) {
    return message.reply("× You can't select songs from someone else's request!");
  }
  
  if (type === "song_selection") {
    const num = parseInt(event.body.trim());
    
    if (isNaN(num) || num < 1 || num > songs.length) {
      return message.reply(`× Please reply with a valid number (1-${songs.length}) to download the song.`);
    }
    
    await message.reaction("⏳", event.messageID);
    
    const selectedSong = songs[num - 1];
    
    try {
      if (!selectedSong.audioUrl) {
        throw new Error("Audio URL not available");
      }
      
      const audioResponse = await axios.get(selectedSong.audioUrl, { 
        responseType: "arraybuffer",
        timeout: 30000
      });
      
      const safeTitle = (selectedSong.title || "AI_Song").replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
      const filename = `${safeTitle}_${Date.now()}.mp3`;
      const filepath = path.join(__dirname, filename);
      
      await fs.writeFile(filepath, audioResponse.data);
      
      const messageBody = `🎵 ${selectedSong.title || "AI Generated Song"}\n\n` +
                         `#• Prompt: ${prompt}\n` +
                         (title ? `#• Custom Title: ${title}\n` : '') +  `#• Lyrics: ${selectedSong.lyrics || "Not Found!"}\n` +
                         `#• Duration: ${Math.round(selectedSong.musicDuration / 1000) || 0} seconds\n` +
                         `#• Size: ${(selectedSong.musicSize / 1024 / 1024).toFixed(2)} MB\n` +
                         `#• Style: ${selectedSong.tags || style || "Not specified"}\n` +
                         `✅ Song ${num} selected and downloaded!\n\n`;
      
      await message.reaction("✅", event.messageID);
      
      await message.reply({
        body: messageBody,
        attachment: fs.createReadStream(filepath)
      });
      
      setTimeout(() => {
        try {
          fs.unlinkSync(filepath);
        } catch (e) {}
      }, 5000);
      
    } catch (error) {
      await message.reaction("❌", event.messageID);
      console.error("Download error:", error.message);
      return message.reply(`Failed to download the selected song: ${error.message}`);
    }
  }
};

function parseArgs(args) {
  const params = {
    prompt: "",
    customMode: null,
    instrumental: null,
    style: "",
    title: "",
    vocalGender: ""
  };
  
  let currentPrompt = [];
  let i = 0;
  
  while (i < args.length && !args[i].startsWith('-')) {
    currentPrompt.push(args[i]);
    i++;
  }
  
  params.prompt = currentPrompt.join(' ');
  
  while (i < args.length) {
    const arg = args[i];
    
    if (arg === '-custom' && i + 1 < args.length) {
      params.customMode = args[i + 1].toLowerCase() === 'true';
      i += 2;
    } else if (arg === '-instrumental' && i + 1 < args.length) {
      params.instrumental = args[i + 1].toLowerCase() === 'true';
      i += 2;
    } else if (arg === '-style' && i + 1 < args.length) {
      params.style = args[i + 1];
      i += 2;
    } else if (arg === '-title' && i + 1 < args.length) {
      params.title = args[i + 1];
      i += 2;
    } else if (arg === '-vocalGender' && i + 1 < args.length) {
      params.vocalGender = args[i + 1].toLowerCase();
      i += 2;
    } else {
      i++;
    }
  }
  
  if (!params.title && params.prompt) {
    params.title = params.prompt.length > 50 
      ? params.prompt.substring(0, 47) + "..."
      : params.prompt;
  }
  
  return params;
}

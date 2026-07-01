const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

module.exports = {
  config: {
    name: 'jail3',
    version: '8.0',
    author: 'Ajmaul',
    cooldown: 10,
    role: 0,
    description: 'WANTED poster with thin bars',
    category: 'fun',
    usage: 'jail [@tag or reply]'
  },

  onStart: async function ({ api, event, message, usersData }) {
    let uid;
    if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else if (event.type === 'message_reply') {
      uid = event.messageReply.senderID;
    } else {
      uid = event.senderID;
    }

    api.setMessageReaction('⏳', event.messageID, () => {}, true);

    try {
      const name = await usersData.getName(uid);
      const userInfo = (await api.getUserInfo(uid))[uid];
      const imageUrl = userInfo.profilePicUrlHd || userInfo.hdProfilePicUrlInfo?.url || userInfo.profile_pic_url_hd || userInfo.profilePicUrl;

      if (!imageUrl) throw new Error('Could not find profile picture');

      const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const avatar = await loadImage(Buffer.from(res.data, 'binary'));

      const width = 600;
      const height = 800;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Dark Blue BG
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // WANTED
      ctx.font = 'bold 100px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#991b1b';
      ctx.shadowBlur = 20;
      ctx.fillText('WANTED', width / 2, 120);
      ctx.shadowColor = 'transparent';

      // Avatar Circle (Clear)
      const centerX = width / 2;
      const centerY = height / 2 + 20;
      const radius = 200;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      // Thin Bars
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';

      const barCount = 8;
      const barSpacing = width / (barCount + 1);
      for (let i = 1; i <= barCount; i++) {
        const x = i * barSpacing;
        ctx.beginPath();
        ctx.moveTo(x, 180);
        ctx.lineTo(x, height - 180);
        ctx.stroke();
      }

      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(barSpacing, 260);
      ctx.lineTo(width - barSpacing, 260);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(barSpacing, height - 260);
      ctx.lineTo(width - barSpacing, height - 260);
      ctx.stroke();

      ctx.globalAlpha = 1.0;

      ctx.font = 'italic 50px "Segoe UI"';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 20;
      ctx.fillText('Locked Up!', width / 2, height - 100);
      ctx.shadowColor = 'transparent';

      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(name.toUpperCase(), width / 2, height - 50);

      await message.reply({
        body: `@${name} WANTED! 🔒 Locked Up! (Clear view)`,
        mentions: [{ tag: name, id: uid }],
        attachment: canvas.toBuffer()
      });
      api.setMessageReaction('✅', event.messageID, () => {}, true);
    } catch (error) {
      console.error('Jail error:', error.message);
      api.setMessageReaction('❌', event.messageID, () => {}, true);
      message.reply('⚠️ Error generating jail poster!');
    }
  }
};
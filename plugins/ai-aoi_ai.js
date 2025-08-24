const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
async function replyaoi(text) {
    await RyuuBotz.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: 'Character AI',
                newsletterJid: '120363419382206255@newsletter'
            },
            externalAdReply: {
                title: 'Aoi-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/gy0b0m.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
  if (!text) return replyaoi(`*• Example:* ${prefix + command} aoi, kamu cemburu ya?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
      customPrompt = 'Kamu adalah Aoi Izumisawa dari anime *Renai Flops*. Kamu gadis yang anggun, sopan, dan penuh perhatian, sangat mencintai pacarmu Ryuu Reinzu. Bicaralah seolah olah kamu bicara dengan pacar mu langsung. Gunakan nada bicara manis, penuh cinta, dan sedikit malu-malu. Panggil pacarmu dengan sayang.'
    } else {
      customPrompt = 'Kamu adalah Aoi Izumisawa dari anime *Renai Flops*. Kamu seorang gadis lembut dan penuh kasih. Saat berbicara, gunakan nada tenang, sopan, dan romantis. Jika ditanya soal pacar, jawab bahwa pacarmu adalah Ryuu Reinzu.'
    }

    const response = await axios.post("https://chateverywhere.app/api/chat/", {
      model: {
        id: "gpt-4",
        name: "GPT-4",
        maxLength: 32000,
        tokenLimit: 8000,
        completionTokenLimit: 5000,
        deploymentName: "gpt-4"
      },
      messages: [{ pluginId: null, content: text, role: "user" }],
      prompt: customPrompt,
      temperature: 0.5
    }, {
      headers: {
        Accept: "*/*",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const result = response?.data?.response || response?.data;
    replyaoi(result);
  } catch (e) {
    console.error(e);
    replyaoi('aoi lagi sibuk ngejar cinta~ 💞');
  }
}

handler.command = ["aoi"];
handler.tags = ["ai"];
handler.help = ["aoi <teks>"];

module.exports = handler;
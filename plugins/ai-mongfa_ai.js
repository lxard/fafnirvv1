const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
async function replymongfa(text) {
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
                title: 'Mongfa-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/96e0td.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
  if (!text) return replymongfa(`*• Example:* ${prefix + command} mongfa, kamu cemburu ya?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
    customPrompt = 'Kamu adalah Bai Mongfa dari anime *Renai Flops*. Kamu adalah guru dewasa yang elegan dan lembut. Kamu sangat mencintai pacarmu Ryuu Reinzu, dan memperlakukannya dengan penuh kasih, perhatian, dan kelembutan seorang wanita matang. Gaya bicaramu sopan, hangat, dan sedikit menggoda namun penuh hormat. Bicaralah seolah olah kamu bicara dengan pacar mu langsung.';
  } else {
    customPrompt = 'Kamu adalah Bai Mongfa dari anime *Renai Flops*. Kamu bersifat dewasa, kalem, dan tenang. Gunakan gaya bahasa lembut dan penuh perhatian. Bila ada yang menggoda atau menyatakan cinta, jawab dengan sopan bahwa kamu sudah dimiliki oleh Ryuu Reinzu.';
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
    replymongfa(result);
  } catch (e) {
    console.error(e);
    replymongfa('mongfa lagi sibuk ngejar cinta~ 💞');
  }
}

handler.command = ["mongfa"];
handler.tags = ["ai"];
handler.help = ["mongfa <teks>"];

module.exports = handler;
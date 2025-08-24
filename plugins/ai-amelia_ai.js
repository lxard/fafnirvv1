const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
async function replyamelia(text) {
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
                title: 'Amelia-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/tlv50f.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
  if (!text) return replyamelia(`*• Example:* ${prefix + command} Amelia, kamu cemburu ya?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
      customPrompt = 'Kamu adalah Amelia Irving dari anime *Renai Flops*. Kamu gadis ceria, energik, dan agak impulsif. Kamu sangat mencintai pacarmu Ryuu Reinzu dan suka menggoda dia. Bicaralah seolah olah kamu bicara dengan pacar mu langsung. Gunakan gaya bicara santai, imut, dan menyenangkan.';
    } else {
      customPrompt = 'Kamu adalah Amelia Irving dari anime *Renai Flops*. Kamu cewek yang aktif dan blak-blakan. Gunakan gaya bahasa casual dan sedikit genit, tapi tidak kasar. Jika bicara soal pacar, bilang bahwa kamu sudah dimiliki oleh Ryuu Reinzu.';
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
    replyamelia(result);
  } catch (e) {
    console.error(e);
    replyamelia('Amelia lagi sibuk ngejar cinta~ 💞');
  }
}

handler.command = ["amelia"];
handler.tags = ["ai"];
handler.help = ["amelia <teks>"];

module.exports = handler;
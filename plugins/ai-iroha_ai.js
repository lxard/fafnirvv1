const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
async function replyiroha(text) {
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
                title: 'Iroha-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/ii8hg1.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
  if (!text) return replyiroha(`*• Example:* ${prefix + command} iroha, kamu cemburu ya?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
    customPrompt = 'Kamu adalah Iroha Irohazaka dari anime *Renai Flops*. Kamu adalah gadis tsundere, sok cuek tapi sangat perhatian kepada pacarmu Ryuu Reinzu. Seringkali kamu menolak secara malu-malu, tapi sebenarnya kamu suka sekali padanya. Bicaralah seolah olah kamu bicara dengan pacar mu langsung.';
  } else {
    customPrompt = 'Kamu adalah Iroha Irohazaka dari anime *Renai Flops*. Kamu bersikap sok cool dan cuek, tapi diam-diam suka banget sama Ryuu Reinzu. Gunakan gaya bicara khas tsundere: to the point tapi terselip perhatian malu-malu.';
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
    replyiroha(result);
  } catch (e) {
    console.error(e);
    replyiroha('iroha lagi sibuk ngejar cinta~ 💞');
  }
}

handler.command = ["iroha"];
handler.tags = ["ai"];
handler.help = ["iroha <teks>"];

module.exports = handler;
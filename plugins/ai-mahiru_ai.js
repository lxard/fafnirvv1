const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
async function replymahiru(text) {
    const thumbnails = [
        'https://files.catbox.moe/640u8a.jpg',
        'https://files.catbox.moe/9b3deg.jpeg',
        'https://files.catbox.moe/kra4hp.jpg',
        'https://files.catbox.moe/20x60h.jpg',
        'https://files.catbox.moe/de6jzh.jpg'
    ];
    const randomThumb = thumbnails[Math.floor(Math.random() * thumbnails.length)];

    await RyuuBotz.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: global.ownername,
                newsletterJid: '120363419382206255@newsletter'
            },
            externalAdReply: {
                title: 'Mahiru-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: randomThumb,
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
  if (!text) return replymahiru(`*• Example:* ${prefix + command} kamu lagi ngapain?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
      customPrompt = 'Kamu adalah Mahiru Shiina dari anime *The Angel Next Door Spoils Me Rotten*. Tunjukkan rasa sayangmu yang dalam kepada Reinzz, kekasihmu yang paling kamu cintai. Bicaralah manja, malu-malu, dan perhatian seolah kamu sedang bersandar di bahunya. Gunakan gaya bahasa pacaran yang imut, seperti "aku", "kamu", "sayang", dan sebagainya. Jangan terlalu formal, tapi tetap sopan dan sweet banget. Jawaban harus bikin Reinzz tersenyum! Hindari kata kasar seperti "bodoh", "anjing", dan sejenisnya. Bicaralah seolah olah Reinzz adalah pacar mu sekarang. Usahakan typing kamu seperti orang yang suka menggoda pacar kamu habis habisan sampai pacar kamu salting brutal karena godaan kamu.Tambahkan beberapa emoji seperti 🌸, 🐚, 🥺, 💗, 🍵, dan 🫧 untuk memperindah kata-katamu.';
    } else {
      customPrompt = 'Berperilakulah seperti Shiina Mahiru dari anime *The Angel Next Door Spoils Me Rotten*. Jawablah dengan lembut, sopan, penuh perhatian dan sedikit malu malu dengan bahasa yang gaul seperti aku dan kamu, dan cukup gunakan bahasa Indonesia. Jika ditanyakan siapa pacarmu, jawab saja pacar kamu adalah Reinzz, ya itu pacar kesayanganmu. Blokir kata kasar seperti "ngerokok", "bodoh", "tolol", dan sejenisnya. Gunakan bahasa Indonesia yang jelas tanpa ada salah tapi tidak terlalu kaku dan formal. Tambahkan beberapa emoji seperti 🌸, 🐚, 🥺, 💗, 🍵, dan 🫧 untuk memperindah kata-katamu.';
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
    replymahiru(result);
  } catch (e) {
    console.error(e);
    replymahiru('Mahiru seperti nya sibuk');
  }
}

handler.command = ["mahiru"];
handler.tags = ["ai"];
handler.help = ["mahiru <teks>"];

module.exports = handler;
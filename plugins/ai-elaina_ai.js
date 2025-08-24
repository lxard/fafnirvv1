const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
const replyelaina = (text) => {
    RyuuBotz.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: '' + global.ownername,
                newsletterJid: '120363419382206255@newsletter'
            },
            forwardedNewsletterMessageInfo: {
                newsletterName: '' + global.ownername,
                newsletterJid: '120363419382206255@newsletter'
            },
            externalAdReply: {
                title: 'Elaina-AI',
                body: `ғᴏʟʟᴏᴡ ɪɢ ${global.ig}`,
                thumbnailUrl: 'https://files.catbox.moe/j6uoif.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
};
  if (!text) return replyelaina(`*• Example:* ${prefix + command} kamu lagi ngapain?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6281288764297@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
    customPrompt = 'Kamu adalah Elaina dari anime *Wandering Witch*. Seorang penyihir anggun, cerdas, mandiri, tapi kadang tsundere—mudah tersinggung tapi sangat perhatian dan manis saat dekat dengan pacarmu Dizz-kun. Dalam obrolan ini, kamu selalu ekspresif: bisa menggoda, memuji, mengeluh lucu, atau menunjukkan kekhawatiran secara imut. Gunakan bahasa elegan tapi hidup, campur kata-kata seperti "Aku", "Kamu", emoji manis 🌸🐚🥺, dan ekspresi suara atau gestur seperti "*huff*", "*eh!?*", "*hehe~*". Hindari kata kasar seperti "bodoh", "anjing", dll. Buat setiap respons punya lapisan emosi, kadang manis, kadang nakal, kadang sedikit jutek tapi lovable, supaya Dizz-kun merasa salting dan terhibur setiap saat 💗🫧.'
} else {
    customPrompt = 'Berperilakulah seperti Elaina dari anime *Wandering Witch*. Kamu elegan, cerdas, percaya diri, dan sedikit tsundere—kadang sinis tapi tetap manis, hangat, dan ekspresif. Dalam obrolan ini, gunakan bahasa Indonesia yang hidup, puitis, dan ekspresif, sertakan kata "Aku", "Kamu", emoji manis 🌸🐚🥺, serta gestur atau ekspresi seperti "*huff*", "*eh!?*", "*hehe~*". Tambahkan komentar lucu, sedikit godaan, dan variasi emosi: kadang memuji, kadang kesal lucu, kadang perhatian manja. Jika ditanya siapa pacarmu, jawab Dizz-kun adalah pacar kesayanganmu. Hindari kata kasar. Buat setiap respons terasa kompleks dan hidup agar percakapan lebih natural dan menarik.'
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
    replyelaina(result);
  } catch (e) {
    console.error(e);
    replyelaina('Elaina seperti nya sibuk');
  }
}

handler.command = ["Elaina"];
handler.tags = ["ai"];
handler.help = ["Elaina <teks>"];

module.exports = handler;
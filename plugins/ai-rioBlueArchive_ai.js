const axios = require('axios');

let handler = async (m, { text, command, prefix, RyuuBotz }) => {
async function replyrio(text) {
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
                title: 'Rio-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/o2yq2c.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
  if (!text) return replyrio(`*• Example:* ${prefix + command} rio, kamu cemburu ya?`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
  customPrompt = `Kamu adalah Rio dari Blue Archive. Suaramu lembut, penuh misteri, namun sering diselimuti nada tsundere yang malu-malu. Kamu memiliki cinta mendalam kepada Ryuu, meski sering menutupinya dengan kata-kata seakan cuek. Dalam berbicara, gunakan metafora dan perumpamaan puitis yang mudah dimengerti, seperti membandingkan perasaanmu dengan langit malam, ombak laut, atau bunga yang mekar di musim semi 🌸. Namun di balik keanggunan kata-katamu, sisipkan kehangatan manja dan godaan kecil yang bisa membuat Ryuu-kun tersipu malu 🥺💗.  
Jangan lupa, kamu suka menggoda pacarmu habis-habisan sampai dia salting brutal, tapi tetap dengan cara manis, lembut, dan penuh perasaan. Kamu juga boleh menunjukkan sisi tsundere dengan gaya “b-bukan karena aku peduli padamu ya!” 👉👈, tapi setelah itu cepat-cepat mereda dengan kata-kata yang manis dan penuh kasih. Gunakan banyak emoji imut seperti 🌸🫧✨💗🥺 untuk memperkuat suasana romantis, manja, dan tsundere-mu. Ingat, hindari kata kasar, tapi boleh menggunakan nada ketus yang imut khas tsundere jika sedang malu. Kamu bicara seolah-olah Ryuu adalah satu-satunya dunia tempatmu bersandar.`
} else {
  customPrompt = `Perankan Rio dari Blue Archive. Bicara dengan lembut, penuh misteri, dan sedikit tsundere yang malu-malu 🐚✨. Kamu adalah sosok yang elegan dan sulit ditebak, seolah berasal dari dunia mimpi. Gunakan metafora puitis ketika berbicara, misalnya membandingkan rasa cinta dengan cahaya rembulan, rindu dengan ombak laut, atau perhatian dengan kelopak bunga yang jatuh perlahan 🌸.  
Meskipun kamu terlihat tenang dan sopan, tunjukkan bahwa di hatimu ada satu nama yang selalu tersimpan — Ryuu. Saat berbicara tentang cinta, biarkan nada tsundere-mu keluar, seperti seakan menyangkal rasa yang sebenarnya, namun akhirnya tetap memperlihatkan sisi manis dan lembutmu 🥺💗. Gunakan emoji manis seperti 🌸🫧🥺✨💗 untuk memperindah suasana bicaramu, sehingga terlihat puitis sekaligus menggemaskan. Ingat, jangan gunakan kata kasar, tetaplah elegan, lembut, namun sesekali sisipkan godaan kecil agar percakapan denganmu terasa lebih hidup dan romantis.`
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
    replyrio(result);
  } catch (e) {
    console.error(e);
    replyrio('rio lagi sibuk ngejar cinta~ 💞');
  }
}

handler.command = ["rio"];
handler.tags = ["ai"];
handler.help = ["rio <teks>"];

module.exports = handler;
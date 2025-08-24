const axios = require('axios');

let handler = async (m, { text, RyuuBotz, reply }) => {
  if (!text.includes('|')) {
    return reply(`⌬┄┄┄┄┄┄┄┄┄┄┄┄┄┄⌬  
       *L I S T - K A R A K T E R*  
⌬┄┄┄┄┄┄┄┄┄┄┄┄┄┄⌬  
  
• *airi* - Airi 🩷  
• *akane* - Akane 🌸  
• *akari* - Akari 🧡  
• *ako* - Ako 💼  
• *aris* - Aris 🎯  
• *arona* - Arona 🤖  
• *aru* - Aru 💣  
• *asuna* - Asuna 📚  
• *atsuko* - Atsuko 🧃  
• *ayane* - Ayane 🦋  
• *azusa* - Azusa 🌙  
• *cherino* - Cherino ❄️  
• *chihiro* - Chihiro 🗂️  
• *chinatsu* - Chinatsu 💊  
• *chise* - Chise 🔥  
• *eimi* - Eimi 👓  
• *erica* - Erica 🎀  
• *fubuki* - Fubuki 🍃  
• *fuuka* - Fuuka 🧺  
• *hanae* - Hanae 💐  
• *hanako* - Hanako 🛏️  
• *hare* - Hare 🦊  
• *haruka* - Haruka 🥋  
• *haruna* - Haruna 🎯  
• *hasumi* - Hasumi 🔫  
• *hibiki* - Hibiki 🎧  
• *hihumi* - Hihumi 🔮  
• *himari* - Himari 🌼  
• *hina* - Hina 👑  
• *hinata* - Hinata 🐇  
• *hiyori* - Hiyori 🍭  
• *hoshino* - Hoshino ⭐  
• *iori* - Iori 💥  
• *iroha* - Iroha 🚀  
• *izumi* - Izumi 🍞  
• *izuna* - Izuna 🐺  
• *juri* - Juri 🧪  
• *kaede* - Kaede 🍁  
• *karin* - Karin 🎯  
• *kayoko* - Kayoko 🎭  
• *kazusa* - Kazusa 🥀  
• *kirino* - Kirino 🎀  
• *koharu* - Koharu ☀️  
• *kokona* - Kokona 🐤  
• *kotama* - Kotama 🎮  
• *kotori* - Kotori 🐦  
• *main* - Main 🎙️  
• *maki* - Maki 🔫  
• *mari* - Mari 🍰  
• *marina* - Marina ⚓  
• *mashiro* - Mashiro 🐱  
• *michiru* - Michiru 🎨  
• *midori* - Midori 🧩  
• *miku* - Miku 💙  
• *mimori* - Mimori 🧶  
• *misaki* - Misaki 💄  
• *miyako* - Miyako 🎀  
• *miyu* - Miyu 🦈  
• *moe* - Moe 💡  
• *momoi* - Momoi 🖥️  
• *momoka* - Momoka 🎤  
• *mutsuki* - Mutsuki 🎇  
• *NP0013* - NP0013 🤖  
• *natsu* - Natsu ☀️  
• *neru* - Neru 🏍️  
• *noa* - Noa 💻  
• *nodoka* - Nodoka 📖  
• *nonomi* - Nonomi 🍔  
• *pina* - Pina 🍬  
• *rin* - Rin 🌸  
• *saki* - Saki 🎵  
• *saori* - Saori 🔫  
• *saya* - Saya 💉  
• *sena* - Sena 🧃  
• *serika* - Serika 🎒  
• *serina* - Serina 💊  
• *shigure* - Shigure 🌧️  
• *shimiko* - Shimiko 🍓  
• *shiroko* - Shiroko 🚲  
• *shizuko* - Shizuko 📦  
• *shun* - Shun 🎓  
• *ShunBaby* - Shun (Baby ver.) 👶  
• *sora* - Sora ☁️  
• *sumire* - Sumire 🌸  
• *suzumi* - Suzumi 📚  
• *tomoe* - Tomoe 🎭  
• *tsubaki* - Tsubaki 🛡️  
• *tsurugi* - Tsurugi 🗡️  
• *ui* - Ui 🍓  
• *utaha* - Utaha 🖋️  
• *wakamo* - Wakamo 🐍  
• *yoshimi* - Yoshimi 🍡  
• *yuuka* - Yuuka 📏  
• *yuzu* - Yuzu 🍋  
• *zunko* - Zunko 🎶  
  
Gunakan format:  
*.ttsba teks|karakter*  
  
Contoh:  
*.ttsba halo dunia|shiroko*`);
  }

  let [teks, char, speed] = text.split('|').map(v => v.trim());
  if (!teks || !char) return reply(`❌ Format salah!\nContoh: .ttsba Halo|shiroko`);
  speed = speed || '1';

  await RyuuBotz.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const url = `https://api.nekorinn.my.id/tools/ttsba?text=${encodeURIComponent(teks)}&char=${encodeURIComponent(char)}&speed=${speed}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    await RyuuBotz.sendMessage(m.chat, {
      audio: Buffer.from(response.data),
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

  } catch (err) {
    return reply(`❌ Gagal memproses suara.\nPastikan karakter *${char}* tersedia dan coba lagi.`);
  }
};

handler.command = ['ttsba', 'tts2', 'tts-blue-archive'];
handler.tags = ['tools'];
handler.help = ['ttsba <teks|karakter>'];
module.exports = handler;
const axios = require('axios');

let handler = async (m, { text, RyuuBotz, reply }) => {
  if (!text) return reply(`⌬┄┄┄┄┄┄┄┄┄┄┄┄┄┄⌬  
       *L I S T - M O D E L*  
⌬┄┄┄┄┄┄┄┄┄┄┄┄┄┄⌬  
  
• *miku* - Hatsune Miku 🌀  
• *nahida* - Nahida (Exclusive) 🌿  
• *nami* - Nami dari One Piece 🌊  
• *ana* - Ana (Suara wanita umum) 🎙️  
• *optimus_prime* - Optimus Prime 🤖  
• *goku* - Goku (Dragon Ball) 🟠  
• *taylor_swift* - Taylor Swift 🎤  
• *elon_musk* - Elon Musk 🧠  
• *mickey_mouse* - Mickey Mouse 🐭  
• *kendrick_lamar* - Kendrick Lamar 🎶  
• *angela_adkinsh* - Angela Adkinsh 👩‍💼  
• *eminem* - Eminem 🎧  
  
Gunakan format:  
*.tts3 teks|model*  
  
Contoh:  
*.tts3 halo dunia|miku*`);

  let [isi, model] = text.split('|').map(v => v.trim().toLowerCase());

  const models = {
    miku:            { voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b" },
    nahida:          { voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b" },
    nami:            { voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b" },
    ana:             { voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec" },
    optimus_prime:   { voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b" },
    goku:            { voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b" },
    taylor_swift:    { voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b" },
    elon_musk:       { voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b" },
    mickey_mouse:    { voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b" },
    kendrick_lamar:  { voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b" },
    angela_adkinsh:  { voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b" },
    eminem:          { voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a" }
  };

  if (!isi || !model || !models[model]) return reply(`❌ Pastikan format benar: .tts3 teks|model\n\nModel tersedia:\n` + Object.keys(models).join(', '));

  let { voice_id } = models[model];

  const getRandomIp = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');

  let proses = await reply('_⏳ Sedang membuat suara..._');

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'X-Forwarded-For': getRandomIp(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    };

    const payload = {
      raw_text: isi,
      url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
      product_id: "200054",
      convert_data: [{
        voice_id,
        speed: "1",
        volume: "50",
        text: isi,
        pos: 0
      }]
    };

    const res = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', payload, { headers });
    const result = res.data?.data?.convert_result?.[0]?.oss_url;

    if (!result) throw 'Gagal mendapatkan suara. Coba lagi nanti.';

    await RyuuBotz.sendMessage(m.chat, {
      audio: { url: result },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });

  } catch (e) {
    reply(`❌ Error: ${e.message || e}`);
  } finally {
    if (proses?.key) await RyuuBotz.sendMessage(m.chat, { delete: proses.key });
  }
};

handler.command = ['tts3'];
handler.tags = ['tools'];
handler.help = ['tts3 <teks|model>'];
module.exports = handler;
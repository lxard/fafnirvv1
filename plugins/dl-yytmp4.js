const fetch = require('node-fetch');

let handler = async (m, { text, prefix, RyuuBotz, reply }) => {
  if (!text) return reply(`*Example:* ${prefix}ytmp4 https://youtube.com/watch?v=czQ2KID9plQ`);
  if (!text.includes('youtu')) return reply('Masukkan link YouTube yang valid!');
  await RyuuBotz.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/youtube?url=${encodeURIComponent(text)}&format=480&type=video`);
    if (!res.ok) throw await res.text();
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) return reply('Gagal mengambil video.');

    const { title, cover, downloadUrl, format } = json.result;
    await RyuuBotz.sendMessage(m.chat, {
      image: { url: cover },
      caption: `🎬 *YouTube Video Found!*\n📌 *Title:* ${title}\n📥 *Format:* ${format}p\n🔗 *Download:* ${downloadUrl}\n_Mengirim video..._`
    }, { quoted: m });

    await RyuuBotz.sendMessage(m.chat, {
      video: { url: downloadUrl },
      caption: `✅ *Berhasil mengunduh video!*\n🎬 ${title}`
    }, { quoted: m });

  } catch (err) {
    console.log('YTMP4 Error:', err);
    reply(`❌ Error saat memproses video:\n${err.message || err}`);
  }
};

handler.command = ["ytmp4"];
handler.tags = ["downloader"];
handler.help = ["ytmp4 <url>"];
module.exports = handler;
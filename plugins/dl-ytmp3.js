const fetch = require('node-fetch');

let handler = async (m, { text, prefix, RyuuBotz, reply }) => {
  if (!text) return reply(`*Example:* ${prefix}ytmp3 https://youtube.com/watch?v=czQ2KID9plQ`);
  if (!text.includes('youtu')) return reply('Masukkan link YouTube yang valid!');
  await RyuuBotz.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

  try {
    const res = await fetch(`https://api.nekoo.qzz.io/downloader/youtube?url=${encodeURIComponent(text)}&format=192&type=audio`);
    if (!res.ok) throw await res.text();
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) return reply('Gagal mengambil audio.');

    const { title, cover, downloadUrl, format } = json.result;
    await RyuuBotz.sendMessage(m.chat, {
      image: { url: cover },
      caption: `🎧 *YouTube Audio Found!*\n🎵 *Title:* ${title}\n🎚️ *Bitrate:* ${format}kbps\n🔗 *Download:* ${downloadUrl}\n_Mengirim audio..._`
    }, { quoted: m });

    await RyuuBotz.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: "audio/mpeg",
      ptt: true,
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (err) {
    console.log('YTMP3 Error:', err);
    reply(`❌ Error saat memproses audio:\n${err.message || err}`);
  }
};

handler.command = ["ytmp3"];
handler.tags = ["downloader"];
handler.help = ["ytmp3 <url>"];
module.exports = handler;
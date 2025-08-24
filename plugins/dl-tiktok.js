const fetch = require('node-fetch');

let handler = async (m, { text, prefix, RyuuBotz, reply }) => {
  if (!text) return reply(`*Example:* ${prefix}tiktok https://vt.tiktok.com/ZSStrGRg1/`);
  if (!text.includes('tiktok.com') && !text.includes('vt.tiktok.com')) return reply('Masukkan link TikTok yang valid!');
  
  await RyuuBotz.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

  try {
    const res = await fetch(`https://ryuu-endss-api.vercel.app/download/tiktok?url=${encodeURIComponent(text)}`);
    if (!res.ok) throw await res.text();
    const json = await res.json();

    if (!json.status || !json.result) return reply('Gagal mengambil data video TikTok.');

    const { title, cover, duration, data, author, music_info, stats } = json.result;

    // Ambil link video no watermark HD kalau ada, kalau nggak fallback ke no watermark biasa
    const videoNowmHD = data.find(v => v.type === 'nowatermark_hd')?.url 
                      || data.find(v => v.type === 'nowatermark')?.url;

    if (!videoNowmHD) return reply('Tidak menemukan video tanpa watermark.');

    await RyuuBotz.sendMessage(m.chat, {
      image: { url: cover },
      caption: `🎬 *TikTok Video Found!*
📌 *Title:* ${title}
🎥 *Duration:* ${duration}
👤 *Author:* ${author.fullname} (@${author.nickname})
🎵 *Music:* ${music_info.title} - ${music_info.author}
👀 *Views:* ${stats.views}
❤️ *Likes:* ${stats.likes}
💬 *Comments:* ${stats.comment}
🔗 *Download:* ${videoNowmHD}
_Mengirim video..._`
    }, { quoted: m });

    await RyuuBotz.sendMessage(m.chat, {
      video: { url: videoNowmHD },
      caption: `✅ *Berhasil mengunduh video!*\n🎬 ${title}`
    }, { quoted: m });

  } catch (err) {
    console.log('TikTok Error:', err);
    reply(`❌ Error saat memproses video:\n${err.message || err}`);
  }
};

handler.command = ["tiktok", "tt"];
handler.tags = ["downloader"];
handler.help = ["tiktok <url>", "tt <url>"];
module.exports = handler;
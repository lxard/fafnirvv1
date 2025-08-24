const fetch = require('node-fetch');

let handler = async (m, { text, prefix, RyuuBotz, reply }) => {
  if (!text) return reply(`*Example:* ${prefix}ytmp3 https://youtube.com/watch?v=...`);
  if (!text.includes('youtu')) return reply('Masukkan link YouTube yang valid!');
  await RyuuBotz.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

  try {
    const res = await fetch(`https://api.ditss.cloud/download/ytmp3?apikey=DitssGanteng&url=${encodeURIComponent(text)}`);
    if (!res.ok) throw await res.text();
    const json = await res.json();

    if (!json.status || !json.result?.link) return reply('Gagal mengambil audio.');

    const { title, link, thumb } = json.result;
    const thumbnail = thumb || 'https://files.catbox.moe/m2xkzf.jpg';

    await RyuuBotz.sendMessage(m.chat, {
      audio: { url: link },
      mimetype: "audio/mp4",
      ptt: true,
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title,
          body: 'YouTube Audio',
          thumbnailUrl: thumbnail,
          sourceUrl: text,
          mediaType: 1,
          renderLargerThumbnail: true,
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.log('YYTMP3 Error:', err);
    reply(`❌ Error saat memproses audio:\n${err.message || err}`);
  }
};

handler.command = ["yytmp3"];
handler.tags = ["downloader"];
handler.help = ["yytmp3 <url>"];
module.exports = handler;
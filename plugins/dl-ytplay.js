const fetch = require('node-fetch');
const fs = require('fs');

let handler = async (m, { text, prefix, RyuuBotz, reply }) => {
  if (!text) return reply("⚠️ Masukkan judul lagu/video YouTube!");
  await RyuuBotz.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  try {
    const apiUrl = `https://ryuu-endss-api.vercel.app/search/youtube?q=${encodeURIComponent(text)}`;

    let res;
    try {
      res = await fetch(apiUrl);
    } catch (fetchErr) {
      console.error("❌ Error saat fetch API:", fetchErr);
      return reply("❌ Gagal terhubung ke API.");
    }

    let response;
    try {
      response = await res.json();
    } catch (jsonErr) {
      console.error("❌ Error saat parsing JSON:", jsonErr);
      return reply("❌ Gagal membaca respon dari API.");
    }

    if (!response.status || !Array.isArray(response.result) || response.result.length === 0) {
      console.error("❌ API mengembalikan data kosong:", response);
      return reply("❌ Video tidak ditemukan atau API error.");
    }

    // Ambil video pertama untuk tampilan
    let firstVideo = response.result[0];
    let { title, channel, duration, imageUrl } = firstVideo;
    
    // Link untuk tombol selalu dari item pertama
    let firstLink = firstVideo.link;

    let menu = `🎵 *${title}*\n\n📺 Channel: ${channel}\n⏳ Durasi: ${duration}\n\n🔗 Link: ${firstLink}`;

    try {
      await RyuuBotz.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      await RyuuBotz.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: `${menu}\n\n> Note: Jika menu button tidak muncul, gunakan:\n> .ytmp4 <link>\n> .ytmp3 <link>`
      }, { quoted: m });
    } catch (thumbErr) {
      console.error("❌ Error kirim thumbnail:", thumbErr);
      reply("⚠️ Thumbnail gagal dikirim, lanjut ke tombol menu...");
    }

    const buttons = [
      { buttonId: `${prefix}ytmp4 ${firstLink}`, buttonText: { displayText: '🎥 Video' } },
      { buttonId: `${prefix}ytmp3 ${firstLink}`, buttonText: { displayText: '🎤 Audio' } }
    ];

    const buttonMessage = {
      document: { url: 'https://raw.githubusercontent.com/Ryuu311/Arisu-Botz/refs/heads/main/README.md' },
      fileName: 'Your Music',
      fileLength: 99999999999999,
      pageCount: 99999999999999,
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      caption: menu,
      footer: `\n© ${global.ownername} - 2025`,
      buttons: buttons,
      headerType: 1,
      contextInfo: {
        externalAdReply: {
          containsAutoReply: true,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: imageUrl,
          title: `© ${global.ownername} - 2025`,
          body: "Asisten Virtual"
        }
      },
      viewOnce: true
    };

    const flowActions = [
      {
        buttonId: `${prefix}owner`,
        buttonText: { displayText: 'Owner' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: "MENU DOWNLOAD LAINNYA",
            sections: [
              {
                title: "Menu Download V2",
                highlight_label: "V2",
                rows: [
                  { title: "🎤 Mp3 Download", description: "Audio Download", id: `${prefix}yytmp3 ${firstLink}` },
                  { title: "🎥 Mp4 Download", description: "Video Download", id: `${prefix}yytmp4 ${firstLink}` }
                ]
              },
              {
                title: "Menu Download V3",
                highlight_label: "V3",
                rows: [
                  { title: "🎤 Mp3 Download", description: "Audio Download", id: `${prefix}yttmp3 ${firstLink}` },
                  { title: "🎥 Mp4 Download", description: "Video Download", id: `${prefix}yttmp4 ${firstLink}` }
                ]
              }
            ]
          })
        },
        viewOnce: true
      }
    ];

    buttonMessage.buttons.push(...flowActions);

    try {
      await RyuuBotz.sendMessage(m.chat, buttonMessage, { quoted: m });
    } catch (buttonErr) {
      console.error("❌ Error kirim button message:", buttonErr);
      return reply("❌ Gagal mengirim tombol menu.");
    }

  } catch (err) {
    console.error("❌ Error umum:", err);
    await RyuuBotz.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    reply("❌ Terjadi kesalahan, coba lagi nanti.");
  }
};

handler.command = ["ytplay", "play"];
handler.tags = ["downloader"];
handler.help = ["ytplay <judul>", "play <judul>"];

module.exports = handler;
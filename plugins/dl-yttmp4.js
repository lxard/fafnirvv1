const fetch = require('node-fetch');

class Youtubers {
  // Sama persis class Youtubers seperti di atas, atau bisa kamu buat file terpisah dan import supaya gak duplikat
  constructor() {
    this.hex = "C5D58EF67A7584E4A29F6C35BBC4EB12";
  }

  async uint8(hex) {
    const pecahan = hex.match(/[\dA-F]{2}/gi);
    if (!pecahan) throw new Error("Format tidak valid");
    return new Uint8Array(pecahan.map(h => parseInt(h, 16)));
  }

  b64Byte(b64) {
    const bersih = b64.replace(/\s/g, "");
    const biner = Buffer.from(bersih, 'base64').toString('binary');
    const hasil = new Uint8Array(biner.length);
    for (let i = 0; i < biner.length; i++) hasil[i] = biner.charCodeAt(i);
    return hasil;
  }

  async key() {
    const crypto = require('crypto');
    const raw = await this.uint8(this.hex);
    return await crypto.webcrypto.subtle.importKey(
      "raw",
      raw,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
  }

  async Data(base64Terenkripsi) {
    const byteData = this.b64Byte(base64Terenkripsi);
    if (byteData.length < 16) throw new Error("Data terlalu pendek");

    const iv = byteData.slice(0, 16);
    const data = byteData.slice(16);

    const kunci = await require('crypto').webcrypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      await this.key(),
      data
    );

    const teks = new TextDecoder().decode(new Uint8Array(kunci));
    return JSON.parse(teks);
  }

  async getCDN() {
    const res = await fetch("https://media.savetube.me/api/random-cdn");
    const data = await res.json();
    return data.cdn;
  }

  async infoVideo(linkYoutube) {
    const cdn = await this.getCDN();
    const res = await fetch(`https://${cdn}/v2/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: linkYoutube }),
    });

    const hasil = await res.json();
    if (!hasil.status) throw new Error(hasil.message || "Gagal ambil data video");

    const isi = await this.Data(hasil.data);
    return {
      judul: isi.title,
      durasi: isi.durationLabel,
      thumbnail: isi.thumbnail,
      kode: isi.key,
      kualitas: isi.video_formats.map(f => ({
        label: f.label,
        kualitas: f.height,
        default: f.default_selected
      })),
      infoLengkap: isi
    };
  }

  async getDownloadLink(kodeVideo, kualitas, type) {
    const cdn = await this.getCDN();
    const res = await fetch(`https://${cdn}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        downloadType: type,
        quality: kualitas,
        key: kodeVideo,
      }),
    });

    const json = await res.json();
    if (!json.status) throw new Error(json.message);
    return json.data.downloadUrl;
  }

  async downloadyt(linkYoutube, kualitas, type) {
    const data = await this.infoVideo(linkYoutube);
    const linkUnduh = await this.getDownloadLink(data.kode, kualitas, type);
    return {
      status: true,
      judul: data.judul,
      kualitasTersedia: data.kualitas,
      thumbnail: data.thumbnail,
      durasi: data.durasi,
      url: linkUnduh,
    };
  }
}

let handler = async (m, { text, prefix, RyuuBotz, reply }) => {
  if (!text) return reply(`*Example:* ${prefix}yttmp4 https://youtube.com/watch?v=czQ2KID9plQ`);
  if (!text.includes('youtu')) return reply('Masukkan link YouTube yang valid!');
  await RyuuBotz.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  try {
    const yt = new Youtubers();
    const kualitas = '720'; // video kualitas default
    const tipe = 'video';

    const hasil = await yt.downloadyt(text, kualitas, tipe);

    if (!hasil.status) return reply('Gagal mengambil data.');

    let teks = `✅ *Download Berhasil*\n\n`;
    teks += `📌 Judul: ${hasil.judul}\n`;
    teks += `⏱️ Durasi: ${hasil.durasi}\n`;
    teks += `🎯 Kualitas: ${kualitas}p\n`;

    await RyuuBotz.sendMessage(m.chat, {
      image: { url: hasil.thumbnail },
      caption: teks
    }, { quoted: m });

    await RyuuBotz.sendMessage(m.chat, {
      video: { url: hasil.url },
      mimetype: 'video/mp4',
      fileName: hasil.judul + '.mp4'
    }, { quoted: m });

  } catch (err) {
    reply(`❌ Terjadi kesalahan: ${err.message || err}`);
  }
};

handler.command = ['yttmp4'];
handler.tags = ['downloader'];
handler.help = ['yttmp4 <url>'];

module.exports = handler;
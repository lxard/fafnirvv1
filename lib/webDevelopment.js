const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

async function addweb(m, RyuuBotz, text, prefix, reply, qmsg, isCreator, mess, example) {
  if (!isCreator) return reply(mess.only.owner);
  if (!text) return example('<namaWeb>');
  if (!qmsg || !/zip|html/.test(qmsg.mimetype)) return reply('Reply file .zip atau .html');

  const webName = text.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
  const domainCheckUrl = `https://${webName}.vercel.app`;

  try {
    await RyuuBotz.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
    const check = await fetch(domainCheckUrl);
    if (check.status === 200) return reply(`[ x ] Nama web *${webName}* sudah digunakan.`);
  } catch (e) {}

  const quotedFile = await RyuuBotz.downloadMediaMessage(qmsg);
  const filesToUpload = [];

  if (qmsg.mimetype.includes('zip')) {
    const zipBuffer = Buffer.from(quotedFile);
    const directory = await unzipper.Open.buffer(zipBuffer);
    for (const file of directory.files) {
      if (file.type === 'File') {
        const content = await file.buffer();
        const filePath = file.path.replace(/^\/+/, '').replace(/\\/g, '/');
        filesToUpload.push({
          file: filePath,
          data: content.toString('base64'),
          encoding: 'base64'
        });
      }
    }
    if (!filesToUpload.some(x => x.file.toLowerCase().endsWith('index.html')))
      return reply('File index.html tidak ditemukan dalam struktur ZIP.');

  } else if (qmsg.mimetype.includes('html')) {
    filesToUpload.push({
      file: 'index.html',
      data: Buffer.from(quotedFile).toString('base64'),
      encoding: 'base64'
    });
  } else {
    return reply('File tidak dikenali. Kirim file .zip atau .html.');
  }

  const headers = {
    Authorization: `Bearer ${global.vercelToken}`,
    'Content-Type': 'application/json'
  };

  await fetch('https://api.vercel.com/v9/projects', {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: webName })
  }).catch(() => {});

  const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: webName,
      project: webName,
      files: filesToUpload,
      projectSettings: { framework: null }
    })
  });

  const deployData = await deployRes.json().catch(() => null);
  if (!deployData || !deployData.url)
    return reply(`Gagal deploy ke Vercel:\n${JSON.stringify(deployData)}`);

  reply(`[ ✓ ] Website berhasil dibuat!\n\n🌐 URL: https://${webName}.vercel.app`);
}

async function delweb(m, RyuuBotz, text, reply, isCreator, mess) {
  if (!isCreator) return reply(mess.only.owner);
  if (!text) return reply('Contoh: .delweb <namaWeb>');

  const webName = text.trim().toLowerCase();
  const headers = { Authorization: `Bearer ${global.vercelToken}` };

  try {
    await RyuuBotz.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

    const response = await fetch(`https://api.vercel.com/v9/projects/${webName}`, {
      method: 'DELETE',
      headers
    });

    if (response.status === 200 || response.status === 204) {
      return reply(`[ ✓ ] Website *${webName}* berhasil dihapus dari Vercel.`);
    } else if (response.status === 404) {
      return reply(`[ x ] Website *${webName}* tidak ditemukan.`);
    } else if ([403, 401].includes(response.status)) {
      return reply(`[ ! ] Token Vercel tidak valid.`);
    } else {
      const result = await response.json().catch(() => ({}));
      return reply(`[ x ] Gagal menghapus website:\n${result.error?.message || 'Tidak diketahui'}`);
    }

  } catch (err) {
    reply(`Terjadi kesalahan saat menghapus:\n${err.message}`);
  }
}

async function listweb(m, reply, isCreator, mess) {
  if (!isCreator) return reply(mess.only.owner);

  const headers = { Authorization: `Bearer ${global.vercelToken}` };
  const res = await fetch('https://api.vercel.com/v9/projects', { headers });
  const data = await res.json();

  if (!data.projects || data.projects.length === 0)
    return reply('Tidak ada website yang ditemukan.');

  let teks = '*🌐 Daftar Website Anda:*\n\n';
  for (let proj of data.projects) {
    teks += `• ${proj.name} → https://${proj.name}.vercel.app\n`;
  }

  reply(teks);
}

async function gethtml(m, RyuuBotz, text, reply, isCreator, mess) {
  if (!isCreator) return reply(mess.only.owner);
  if (!text) return reply('Mana domain/URL-nya?');

  try {
    await RyuuBotz.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

    let res = await fetch(text);
    if (!res.ok) return reply('[ x ] Gagal mengambil data dari URL tersebut');
    let html = await res.text();

    const filePath = path.join(__dirname, '../temp/html_dump.html');
    fs.writeFileSync(filePath, html);

    await RyuuBotz.sendMessage(m.chat, {
      document: fs.readFileSync(filePath),
      mimetype: 'text/html',
      fileName: 'source.html'
    }, { quoted: m });

    fs.unlinkSync(filePath);
  } catch (e) {
    reply('[ x ] Gagal mengambil HTML: ' + e.message);
  }
}

module.exports = { addweb, delweb, listweb, gethtml };
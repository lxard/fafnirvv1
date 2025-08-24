require("./settings");
const { modul } = require("./module");
const { os, axios, baileys, chalk, cheerio, FileType, fs, PhoneNumber, process, moment, speed, ms, util, ytdl,  } = modul;
const {
  default: makeWaSocket,
  socket,
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} = require("@whiskeysockets/baileys");
const { exec, spawn, execSync } = require("child_process")
const { color, bgcolor } = require("./lib/color");
const readFile = util.promisify(fs.readFile);
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const path = require("path");

module.exports = RyuuBotz = async (RyuuBotz, m, chatUpdate, store) => {
try {
const afkPath = path.join(__dirname, './database/afk.json');

// Load DB AFK
let afkDB = fs.existsSync(afkPath) ? JSON.parse(fs.readFileSync(afkPath)) : [];
if (!fs.existsSync(afkPath)) fs.writeFileSync(afkPath, JSON.stringify(afkDB, null, 2));

function saveAFK() {
    fs.writeFileSync(afkPath, JSON.stringify(afkDB, null, 2));
}

// Format waktu
function clockStrink(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [
        d > 0 ? `${d} hari` : "",
        h > 0 ? `${h} jam` : "",
        m > 0 ? `${m} menit` : "",
        s > 0 ? `${s} detik` : ""
    ].filter(Boolean).join(' ');
}

// List thumbnail
const thumbnails = [
    'https://files.catbox.moe/640u8a.jpg',
    'https://files.catbox.moe/9b3deg.jpeg',
    'https://files.catbox.moe/kra4hp.jpg',
    'https://files.catbox.moe/20x60h.jpg',
    'https://files.catbox.moe/de6jzh.jpg'
];

// Cek mention AFK
let mentionUsers = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
for (let jid of mentionUsers) {
    if (!m.key.fromMe) { 
        let afkUser = afkDB.find(u => u.user === jid);
        if (afkUser && afkUser.afkTime > -1) {
            let randomThumb = thumbnails[Math.floor(Math.random() * thumbnails.length)];
            RyuuBotz.sendMessage(m.chat, {
                text: `📢 Jangan tag dia!\n📴 Dia sedang AFK ${afkUser.alasan ? `dengan alasan: ${afkUser.alasan}` : 'tanpa alasan'}\n🕒 Selama ${clockStrink(new Date - afkUser.afkTime)}`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    externalAdReply: {
                        title: 'Jangan di ganggu kocak',
                        body: `Menghilang cuyy`,
                        thumbnailUrl: randomThumb,
                        sourceUrl: '404webb.vercel.app'
                    },
                    mentions: [m.sender]
                }
            }, { quoted: m });
        }
    }
}

// Cek balik dari AFK
let senderAFK = afkDB.find(u => u.user === m.sender);
if (senderAFK && senderAFK.afkTime > -1) {
    let randomThumb = thumbnails[Math.floor(Math.random() * thumbnails.length)];
   await RyuuBotz.sendMessage(m.chat, {
        text: `👋 Kamu telah berhenti AFK${senderAFK.alasan ? ` dengan alasan: ${senderAFK.alasan}` : ''}\n🕒 Selama ${clockStrink(new Date - senderAFK.afkTime)}`,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            externalAdReply: {
                title: 'Dia Kembali dari Afk',
                body: `Lah muncul lagi :v`,
                thumbnailUrl: randomThumb,
                sourceUrl: '404webb.vercel.app'
            },
            mentions: [m.sender]
        }
    }, { quoted: m });

    senderAFK.afkTime = -1;
    senderAFK.alasan = '';
    saveAFK();
}

  async function appenTextMessage(text, chatUpdate) {
    let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: m.mentionedJid,
      },
      {
        userJid: RyuuBotz.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, RyuuBotz.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    RyuuBotz.ev.emit("messages.upsert", msg);
  }
  const { type, quotedMsg, mentioned, now, fromMe } = m;
  let body =
  m.mtype === "interactiveResponseMessage"
    ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id
    : m.mtype === "conversation"
      ? m.message.conversation
      : m.mtype == "imageMessage"
        ? (m.message.imageMessage.caption || "")
        : m.mtype == "videoMessage"
          ? (m.message.videoMessage.caption || "")
          : m.mtype == "extendedTextMessage"
            ? m.message.extendedTextMessage.text
            : m.mtype == "buttonsResponseMessage"
              ? m.message.buttonsResponseMessage.selectedButtonId
              : m.mtype == "listResponseMessage"
                ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                : m.mtype == "templateButtonReplyMessage"
                  ? m.message.templateButtonReplyMessage.selectedId
                  : m.mtype == "messageContextInfo"
                    ? m.message.buttonsResponseMessage?.selectedButtonId ||
                      m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
                      m.text
                    : m.mtype === "editedMessage"
                      ? m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage
                        ? m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage.text
                        : m.message.editedMessage.message.protocolMessage.editedMessage.conversation || ""
                      : "";


// ───────────────────────────────────────────────────────────────────────────────乂 🥀 SETTINGS AllFILE ───────────────────────────────────────────────────────────────乂 \\                                              
const {
getRegisteredRandomId, 
addRegisteredUser, 
createSerial, 
checkRegisteredUser 
} = require('./lib/register.js')

const {
  clockString,
  parseMention,
  formatp,
  isUrl,
  sleep,
  runtime,
  getBuffer,
  jsonformat,
  format,
  capital,
  reSize,
  generateProfilePicture,
} = require("./lib/myfunc");

const premium = JSON.parse(fs.readFileSync("./database/premium.json"))

RyuuBotz.ev.on('group-participants.update', async (anu) => {
let _welcome = (`*❍ 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 𝙈𝙀𝙈𝘽𝙀𝙍 ❍*
*✦ User : @${num.split("@")[0]} 🔥*
*✦ Group : ${metadata.subject}*

*˚₊‧ 𝐂𝐚𝐭𝐚𝐭𝐚𝐧 𝐏𝐞𝐧𝐝𝐚𝐡𝐮𝐚𝐧 ‧₊˚*
*• Harap membaca deskripsi grup sebelum berinteraksi.*
*• Patuhi seluruh aturan yang telah ditetapkan.*
*• Gunakan bahasa yang sopan dan komunikatif.*
*• Simpan kontak admin jika diperlukan untuk keperluan teknis.*`)
    try {
        let metadata = await RyuuBotz.groupMetadata(anu.id);
        let participants = anu.participants;

        for (let num of participants) {
            if (anu.action == 'add') {
                await RyuuBotz.sendMessage(anu.id, {
                    text: _welcome,
                    mentions: [num]
                });
            }

            if (anu.action == 'remove') {
                await RyuuBotz.sendMessage(anu.id, {
                    text: `Sampai jumpa @${num.split("@")[0]} 👋`,
                    mentions: [num]
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
});
//Fungsi skip message channel
if (m.key.remoteJid && m.key.remoteJid.endsWith('@newsletter')) {
    return;
}
// ───────────────────────────────────────────────────────────────────────────────乂 🥀 SETTINGS ADMIN - BOT - OWNER ───────────────────────────────────────────────────────────────乂 \\                                                
const budy = (typeof m.text == 'string' ? m.text : '.')
let preff;
if (global.pref === true) {
    preff = global.prefix;
} else if (global.pref === false) {
    preff = '';
} else {
    preff = '.'; 
}
  const prefix = preff
  const chath = body;
  const pes = body || "";
  const messagesC = pes.slice(0).trim();
  const content = JSON.stringify(m.message);
  const isCmd = body.startsWith(prefix);
  const from = m.key.remoteJid;
  const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase();
  const args = body.trim().split(/ +/).slice(1)
  const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
  const botNumber = await RyuuBotz.decodeJid(RyuuBotz.user.id);
  const isCreator = m.sender === global.ownernumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net";0
  const pushname = m.pushName || "Nothing";
  const text = (q = args.join(" "));
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";
  const qmsg = quoted.msg || quoted;
  const isMedia = /image|video|sticker|audio/.test(mime);
  const isImage = type == "imageMessage";
  const isVideo = type == "videoMessage";
  const isAudio = type == "audioMessage";
  const isSticker = type == "stickerMessage";
  const isQuotedImage =
    type === "extendedTextMessage" && content.includes("imageMessage");
  const isQuotedLocation =
    type === "extendedTextMessage" && content.includes("locationMessage");
  const isQuotedVideo =
    type === "extendedTextMessage" && content.includes("videoMessage");
  const isQuotedSticker =
    type === "extendedTextMessage" && content.includes("stickerMessage");
  const isQuotedAudio =
    type === "extendedTextMessage" && content.includes("audioMessage");
  const isQuotedContact =
    type === "extendedTextMessage" && content.includes("contactMessage");
  const isQuotedDocument =
    type === "extendedTextMessage" && content.includes("documentMessage");
  const sender = m.isGroup
    ? m.key.participant
      ? m.key.participant
      : m.participant
    : m.key.remoteJid;
  const senderNumber = sender.split("@")[0];
  const groupMetadata = m.isGroup
    ? await RyuuBotz.groupMetadata(m.chat).catch((e) => {})
    : "";
  const participants =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  const groupAdmins = m.isGroup
    ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
    : [];
  const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : [];
  const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : [];
  const groupMembership =
    m.isGroup && groupMetadata ? groupMetadata.membership : [];
  const groupMembers =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
  const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
  const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
  const isPremium = premium.includes(m.sender)
  const isRegistered = checkRegisteredUser(m.sender)
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  deviceinfo = /^3A/.test(m.id) ? 'ɪᴏs' : m.id.startsWith('3EB') ? 'ᴡᴇʙ' : /^.{21}/.test(m.id) ? 'ᴀɴᴅʀᴏɪᴅ' : /^.{18}/.test(m.id) ? 'ᴅᴇsᴋᴛᴏᴘ' : 'ᴜɴᴋɴᴏᴡ';
  const ments = (text) => {
  return text.match('@') ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []}
  const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
  const mentionUser = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  const mentionByTag =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.mentionedJid
      : [];
  const mentionByReply =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.participant || ""
      : "";
  const numberQuery =
    q.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net";
  const usernya = mentionByReply ? mentionByReply : mentionByTag[0];
  const Input = mentionByTag[0]
    ? mentionByTag[0]
    : mentionByReply
      ? mentionByReply
      : q
        ? numberQuery
        : false;

// ───────────────────────────────────────────────────────────────────────────────乂 🥀 SETTINGS TIME ───────────────────────────────────────────────────────────────乂 \\                        
  const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
  const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
  const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
  if (time2 < "23:59:00") {
    var timewisher = `Selamat Malam`;
  }
  if (time2 < "19:00:00") {
    var timewisher = `Selamat Malam`;
  }
  if (time2 < "18:00:00") {
    var timewisher = `Selamat Sore`;
  }
  if (time2 < "15:00:00") {
    var timewisher = `Selamat Siang`;
  }
  if (time2 < "11:00:00") {
    var timewisher = `Selamat Pagi`;
  }
  if (time2 < "05:00:00") {
    var timewisher = `Selamat Pagi`;
  }
  // Waktu sekarang di zona Asia/Jakarta
  let sekarang = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );
  // Fungsi tanggal, bulan, tahun
  function tanggal(ms) {
    return new Date(ms).getDate().toString().padStart(2, "0");
  }
  function bulan(ms) {
    return (new Date(ms).getMonth() + 1).toString().padStart(2, "0"); // +1 karena Januari = 0
  }
  function tahun(ms) {
    return new Date(ms).getFullYear();
  }
  // Fungsi jam:menit:detik
  function formatJam(date) {
    let jam = date.getHours().toString().padStart(2, "0");
    let menit = date.getMinutes().toString().padStart(2, "0");
    let detik = date.getSeconds().toString().padStart(2, "0");
    return `${jam}:${menit}:${detik}`;
  }
  // Output akhir
  let futureDescription = `
📅 *Update Kurs:* ${tanggal(sekarang.getTime())}/${bulan(sekarang.getTime())}/${tahun(sekarang.getTime())}
🕰 *Waktu Jakarta (WIB):* ${formatJam(sekarang)}`;

try {
ppuser = await RyuuBotz.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
ppnyauser = await getBuffer(ppuser)
try {
let isNumber = x => typeof x === 'number' && !isNaN(x)
let limitUser = isPremium ? 1000 : 30
let user = global.db.data.users[m.sender]
if (typeof user !== 'object') global.db.data.users[m.sender] = {}
if (user) {
if (!('afkReason' in user)) user.afkReason = ''
if (!isNumber(user.limit)) user.limit = limitUser
} else global.db.data.users[m.sender] = {
afkTime: -1,
afkReason: '',
limit: limitUser,
}
} catch (err) {
console.log(err)
}

// ───────────────────────────────────────────────────────────────────────────────乂 🥀 SETTINGS QUOTED ───────────────────────────────────────────────────────────────乂 \\
const qtext = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `${prefix+command}`}}}
const qbug = {key: {remoteJid: 'status@broadcast', fromMe: false, participant: '0@s.whatsapp.net'}, message: {listResponseMessage: {title: `ꪎ ${global.ownername}`
}}}
const qdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: `ꪎ ${global.ownername}`,jpegThumbnail: ""}}}
const qloc = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `ꪎ ${global.ownername}`,jpegThumbnail: ""}}}
const qloc2 = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `ꪎ ${global.ownername}`,jpegThumbnail: ""}}}
const qpayment = {key: {remoteJid: '0@s.whatsapp.net', fromMe: false, id: `ownername`, participant: '0@s.whatsapp.net'}, message: {requestPaymentMessage: {currencyCodeIso4217: "USD", amount1000: 999999999, requestFrom: '0@s.whatsapp.net', noteMessage: { extendedTextMessage: { text: "Simple Bot"}}, expiryTimestamp: 999999999, amount: {value: 91929291929, offset: 1000, currencyCode: "USD"}}}}
const qtoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast"} : {})}, message: {"productMessage": {"product": {"productImage": {"mimetype": "image/jpeg", "jpegThumbnail": ""}, "title": `ꪎ ${global.ownername}`, "description": null, "currencyCode": "IDR", "priceAmount1000": "999999999999999", "retailerId": `ꪎ ${global.ownername}`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}}
const qlive = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {liveLocationMessage: {caption: `ꪎ ${global.ownername}`,jpegThumbnail: ""}}}

async function replymahiru(text) {
    const thumbnails = [
        'https://files.catbox.moe/640u8a.jpg',
        'https://files.catbox.moe/9b3deg.jpeg',
        'https://files.catbox.moe/kra4hp.jpg',
        'https://files.catbox.moe/20x60h.jpg',
        'https://files.catbox.moe/de6jzh.jpg'
    ];
    const randomThumb = thumbnails[Math.floor(Math.random() * thumbnails.length)];

    await RyuuBotz.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: global.ownername,
                newsletterJid: '120363419382206255@newsletter'
            },
            externalAdReply: {
                title: 'Mahiru-AI',
                body: '404 Official',
                thumbnailUrl: randomThumb,
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}

async function replyaoi(text) {
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
                title: 'Aoi-AI',
                body: '404 Official',
                thumbnailUrl: 'https://files.catbox.moe/gy0b0m.jpg',
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}

async function replyamelia(text) {
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
                title: 'Amelia-AI',
                body: '404 Official',
                thumbnailUrl: 'https://files.catbox.moe/tlv50f.jpg',
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}

async function replyiroha(text) {
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
                title: 'Iroha-AI',
                body: '404 Official',
                thumbnailUrl: 'https://files.catbox.moe/ii8hg1.jpg',
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}

async function replymongfa(text) {
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
                title: 'Mongfa-AI',
                body: '404 Official',
                thumbnailUrl: 'https://files.catbox.moe/96e0td.jpg',
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}

async function replykarin(text) {
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
                title: 'Karin-AI',
                body: '404 Official',
                thumbnailUrl: 'https://files.catbox.moe/jjbu7b.jpg',
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}
async function reply(text) {
const thumbnails = [
        'https://files.catbox.moe/640u8a.jpg',
        'https://files.catbox.moe/9b3deg.jpeg',
        'https://files.catbox.moe/kra4hp.jpg',
        'https://files.catbox.moe/20x60h.jpg',
        'https://files.catbox.moe/de6jzh.jpg'
    ];
    const randomThumb = thumbnails[Math.floor(Math.random() * thumbnails.length)];
    
    RyuuBotz.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: 'Mahiru Botzz',
                newsletterJid: '120363419382206255@newsletter'
            },
            externalAdReply: {
                title: 'Mahiru Assistant',
                body: `404 Official`,
                thumbnailUrl: '' + `${randomThumb}`,
                sourceUrl: '404webb.vercel.app'
            }
        }
    }, { quoted: m });
}
const replyafk = (text) => {
const thumbnails = [
    'https://files.catbox.moe/640u8a.jpg',
    'https://files.catbox.moe/9b3deg.jpeg',
    'https://files.catbox.moe/kra4hp.jpg',
    'https://files.catbox.moe/20x60h.jpg',
    'https://files.catbox.moe/de6jzh.jpg'
];
    const randomThumbs = thumbnails[Math.floor(Math.random() * thumbnails.length)];
    RyuuBotz.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            externalAdReply: {
                title: 'Dia mau Afk',
                body: `Dadahh`,
                thumbnailUrl: randomThumbs,
                sourceUrl: 'https://instagram.com/reinzz311'
            },
            mentions: [m.sender]
        }
    }, { quoted: m });
};
const reply2 = (teks) => {
RyuuBotz.sendMessage(from, { text : teks }, { quoted : m })
}
const example = (teks) => {
return `\n *Contoh Penggunaan :*\n Ketik *${prefix+command}* ${teks}\n`
}

// ───────────────────────────────────────────────────────────────────────────────乂 🥀 SETTINGS PUBLICK - CONSOLE MESSAGE ───────────────────────────────────────────────────────────────乂 \\

if (self_) {
   if (!isCreator) {
   if  (!m.key.fromMe) {
    return;
    }
  }
}
function deleteUnwantedFiles() {
const sessionFolder = path.join(__dirname, "session");
const safeFile = "creds.json";
    fs.readdir(sessionFolder, (err, files) => {
        if (err) {
            console.error("Gagal membaca folder:", err);
            return;
        }
        const filesToDelete = files.filter(file => file !== safeFile);
        let deletedCount = 0;

        filesToDelete.forEach(file => {
            const filePath = path.join(sessionFolder, file);
            try {
                fs.unlinkSync(filePath);
                deletedCount++;
            } catch (err) {
                console.error("Gagal hapus:", file, err);
            }
        });

        console.log(`[AUTO CLEAN] ${deletedCount} file terhapus (${(moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'))})`);
    });
}       
if (m.message) {
    const time = chalk.yellow(moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'))
    const msgType = chalk.cyan(budy ? budy : m.mtype)
    const sender = `${chalk.green(pushname)} ${chalk.gray(`<${m.sender}>`)}`
    const location = m.isGroup
        ? `${chalk.blue('Group:')} ${chalk.yellow(groupName)} ${chalk.gray(`(${m.chat})`)}`
        : chalk.blue('Private Chat')        
    console.log(`${chalk.white('┌' + '─'.repeat(15) + '[ NEW MESSAGE ]' + '─'.repeat(16) + '┐')}
📅 ↳ ${time}
💬 ↳ ${msgType}
✉️ ↳ ${body}
🙋 ↳ ${sender}
📍 ↳ ${location}
${chalk.white('└' + '─'.repeat(48) + '┘')}`)
 RyuuBotz.readMessages([m.key]);
 deleteUnwantedFiles();
const signals = 
`┌─────────[ NEW MESSAGE ]─────────┐
📅 ↳ ${(moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'))}
💬 ↳ ${budy ? budy : m.mtype}
🙋 ↳ ${pushname}
📲 ↳ ${m.sender}
📍 ↳ ${m.isGroup
        ? `Group: ${groupName} (${m.chat})`
        : 'Private Chat'}
└──────────────────────────────┘`;
 if (global.channel_log === true) {
  RyuuBotz.sendMessage('120363420007790159@newsletter', {
    text: signals,
    contextInfo: {
      externalAdReply: {
        title: 'Log Bot',
        body: `Bot information`,
        thumbnailUrl: global.thumbnail,
        sourceUrl: global.saluran,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });
 }
}

// Stiker Anti-Panggil Owner :v\\
try {
  if (typeof m.text === 'string' && new RegExp(`@${global.jidownernumber || global.lidownernumber}`, 'i').test(m.text)) {
    if (!isCreator) {
      const stickerBuffer = fs.readFileSync('./stiker/apa-woi.webp');
      RyuuBotz.sendImageAsSticker(
        m.chat,
        stickerBuffer,
        m,
        {
          packname: `Jangan tag owner ku 😡`
        },
        {
          quoted: m
        }
      );
    }
  }
} catch (err) {
  console.error('Error saat mengirim stiker:', err);
  reply(`Owner ku pusing anj😭\n*Error:* ${err.message}`);
}
// ─────乂 🥀 ALL FUNCTION ────乂 \\

async function CatBox(filePath) {
	try {
    	const BodyForm = require('form-data');
		const fileStream = fs.createReadStream(filePath);
		const formData = new BodyForm();
		formData.append('fileToUpload', fileStream);
		formData.append('reqtype', 'fileupload');
		formData.append('userhash', '');
		const response = await axios.post('https://catbox.moe/user/api.php', formData, {
			headers: {
				...formData.getHeaders(),
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error at Catbox uploader:", error);
		return "Terjadi kesalahan saat upload ke Catbox.";
	}
};

async function loadingBar(m, RyuuBotz) {
try {
if (BarLoad) {
  const createProgressBar = (value, maxValue, length) => {
    const percentage = value / maxValue;
    const progress = Math.round(length * percentage);
    const empty = length - progress;
    return `[${"█".repeat(progress)}${"░".repeat(empty)}]`;
  };

  let progress = 0;
  let message = await RyuuBotz.sendMessage(
    m.chat,
    { text: `Loading...\n${createProgressBar(progress, 100, 20)} ${progress}%` },
    { quoted: m }
  );

  while (progress < 100) {
    await global.sleep(100);
    progress += 5;
    const newText = `Loading...\n${createProgressBar(progress, 100, 20)} ${progress}%`;

    await RyuuBotz.relayMessage(
      m.chat,
      {
        protocolMessage: {
          key: message.key,
          type: 14,
          editedMessage: { conversation: newText }
        }
      },
      {}
    );
  }

  const finalText = `Loading Selesai!!!`;
  await RyuuBotz.relayMessage(
    m.chat,
    {
      protocolMessage: {
        key: message.key,
        type: 14,
        editedMessage: { conversation: finalText }
      }
    },
    {}
  );

  return message;
  } else {
  await RyuuBotz.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });
  }
  } catch(err) {
  console.log('error bang :v', err);
  reply(`Yah error ${err}`);
  }
}

  async function sendconnMessage(chatId, message, options = {}) {
    let generate = await generateWAMessage(chatId, message, options);
    let type2 = getContentType(generate.message);
    if ("contextInfo" in options)
      generate.message[type2].contextInfo = options?.contextInfo;
    if ("contextInfo" in message)
      generate.message[type2].contextInfo = message?.contextInfo;
    return await RyuuBotz.relayMessage(chatId, generate.message, {
      messageId: generate.key.id,
    });
  }
  
  function GetType(Data) {
    return new Promise((resolve, reject) => {
      let Result, Status;
      if (Buffer.isBuffer(Data)) {
        Result = new Buffer.from(Data).toString("base64");
        Status = 0;
      } else {
        Status = 1;
      }
      resolve({
        status: Status,
        result: Result,
      });
    });
  }
  
  function randomId() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  function monospace(string) {
    return '```' + string + '```'
}

function monospa(string) {
    return '`' + string + '`'
}

function getRandomFile(ext) {
return `${Math.floor(Math.random() * 10000)}${ext}`;
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

function randomNomor(min, max = null){
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

function generateRandomPassword() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
const length = 10;
let password = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
password += characters[randomIndex];
}
return password;
}

function generateRandomNumber(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

    async function listbut2(m, teks, listnye, qtext) {
let msg = generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: {
"messageContextInfo": {
"deviceListMetadata": {},
"deviceListMetadataVersion": 2
},
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 999999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: `120363405649403674@newsletter`,
newsletterName: `— ${namabot} AI WhatsApp Bot`,
serverMessageId: 145
}
},
body: proto.Message.InteractiveMessage.Body.create({
text: teks
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: `${namabot} By ${ownername}`
}),
header: proto.Message.InteractiveMessage.Header.create({
title: ``,
thumbnailUrl: "",
gifPlayback: true,
subtitle: "",
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/rj0ok0.jpg' } }, { upload: RyuuBotz.waUploadToServer })),
}),
gifPlayback: true,
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
"name": "single_select",
"buttonParamsJson": JSON.stringify(listnye)
}],
}), })}
}}, {quoted: qtext})
await RyuuBotz.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}

async function dellCase(filePath, caseNameToRemove) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Terjadi kesalahan:', err);
                    return;
                }

                const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
                const modifiedData = data.replace(regex, '');

                fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
                    if (err) {
                        console.error('Terjadi kesalahan saat menulis file:', err);
                        return;
                    }

                    console.log(`Teks dari case '${caseNameToRemove}' telah dihapus dari file.`);
                });
            });
        }
        const { addweb, delweb, listweb, gethtml } = require('./lib/webDevelopment')

// ───────────────────────────────────────────────────────────────────────────────乂 🥀 PLUGINS ───────────────────────────────────────────────────────────────乂 \\                        
    const pluginsLoader = async (directory) => {
      let plugins = [];
      const folders = fs.readdirSync(directory);
      folders.forEach((file) => {
        const filePath = path.join(directory, file);
        if (filePath.endsWith(".js")) {
          try {
            const resolvedPath = require.resolve(filePath);
            if (require.cache[resolvedPath]) {
              delete require.cache[resolvedPath];
            }
            const plugin = require(filePath);
            plugins.push(plugin);
          } catch (error) {
            console.log(`Error loading plugin at ${filePath}:`, error);
          }
        }
      });
      return plugins;
    };

    let pluginsDisable = true;
    const plugins = await pluginsLoader(path.resolve(__dirname, "plugins"));
    const kyykzy = { RyuuBotz, prefix, command, reply, text, isGroup: m.isGroup, isCreator, example, sender, senderNumber, pushname, args, runtime, formatp, sleep, getBuffer, isBotAdmins, isAdmins, isCmd, qtext, isPremium, randomNomor, monospace, pickRandom, getRandomFile };
    for (let plugin of plugins) {
      if (plugin.command.find((e) => e == command.toLowerCase())) {
        pluginsDisable = false;
        if (typeof plugin !== "function") return;
        await plugin(m, kyykzy);
      }
    }
    if (!pluginsDisable) return;
  if (prefix === '.') {
    if (command && !isRegistered && !['daftar', 'regis', 'register'].includes(command)) {
  return reply(mess.notregist);
  }
}
  
  
  switch (command) {  
  case 'daftar': case 'regis': case 'register': {
    if (isRegistered) return reply('ᴋᴀᴍᴜ ᴛᴇʟᴀʜ ᴛᴇʀᴅᴀғᴛᴀʀ');

    const input = text?.includes(',') ? text.split(',') : text?.includes('.') ? text.split('.') : [];
    if (input.length !== 2) return reply('Format Salah! Gunakan: .daftar nama,umur atau .daftar nama.umur');

    const nama = input[0].trim();
    const umur = input[1].trim();

    if (!nama || !umur || isNaN(umur)) return reply('Pastikan Nama dan Umur sudah diisi dengan benar!');
    if (parseInt(umur) > 30) return reply('Maaf, Umur Maksimal Untuk Daftar Adalah 30 Tahun!');

    const serialUser = createSerial(20);
    const detectOperator = (number) => {
  const prefix = number.slice(0, 4);
  const operators = {
    Telkomsel: [
      '0811', '0812', '0813', '0821', '0822', '0823', '0852', '0853', '0851' // Kartu As, Simpati, Loop, By.U
    ],
    Indosat: [
      '0814', '0815', '0816', '0855', '0856', '0857', '0858' // IM3, Matrix
    ],
    XL: [
      '0817', '0818', '0819', '0859', '0877', '0878' // XL, Axis
    ],
    Tri: [
      '0895', '0896', '0897', '0898', '0899'
    ],
    Smartfren: [
      '0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'
    ]
  };

  for (const [name, prefixes] of Object.entries(operators)) {
    if (prefixes.includes(prefix)) return name;
  }

  return 'Tidak Diketahui';
};
    const nomor = m?.sender.split('@')[0];
    const channelJid = '120363419884279670@newsletter';
    const operator = detectOperator(nomor.replace(/[^0-9]/g, '').replace(/^62/, '0').slice(0, 12));

    const mzd = `REGISTERED USERS\n` +
                `Nomor  : @${nomor}\n` +
                `Nama   : ${nama}\n` +
                `Umur   : ${umur}\n` +
                `Status : Sukses✅\n` +
                `Serial : ${serialUser}\n` +
                `Operator: ${operator}\n` +
                `Device: ${deviceinfo}\n\n` +     
                `ᴠᴇʀɪғɪᴋᴀsɪ sᴛᴀᴛᴜs`;

    const notifLog = `REGISTERED USERS\n` +
                `Nomor  : @${nomor}\n` +
                `Nama   : ${nama}\n` +
                `Umur   : ${umur}\n` +
                `Status : Sukses✅\n` +
                `Serial : ${serialUser}\n` +
                `Operator: ${operator}\n` +
                `Device: ${deviceinfo}\n\n` +     
                    `ɪɴғᴏ ʀᴇɢɪsᴛᴇʀ ʙʏ ${namabot}`;

    veri = m?.sender;
    addRegisteredUser(m?.sender, nama, serialUser);

    let ppuser;
    try {
        ppuser = await RyuuBotz.profilePictureUrl(m.sender, 'image');
    } catch {
        ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460960720.png?q=60';
    }

    RyuuBotz.sendMessage(m.chat, {
        text: mzd,
        contextInfo: {
            mentionedJid: [m.chat],
            externalAdReply: {
                title: m.isGroup ? 'R E G I S T E R' : '𝗡 𝗘 𝗪 - 𝗨 𝗦 𝗘 𝗥',
                body: '',
                thumbnailUrl: ppuser,
                sourceUrl: global.ceha,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    });
}
break;
  case 'channel-log':
 case 'c-log': {
 if (!isCreator) return reply(mess.creator)
    if (!text) return reply(`Contoh penggunaan:\n${prefix + command} on\n${prefix + command} off`);
    
    if (text.toLowerCase() === 'on') {
        global.channel_log = true;
        reply(`✅ Channel log diaktifkan\nStatus c-log sekarang ${global.channel_log}`);
    } else if (text.toLowerCase() === 'off') {
        global.channel_log = false;
        reply(`✅ Channel log dimatikan.\nStatus c-log sekarang ${global.channel_log}`);
    } else {
        reply(`❌ Pilihan tidak valid.\nGunakan:\n${prefix + command} on\n${prefix + command} off`);
    }
}
break;
case 'mode':
case 'bot-mode': {
 if (!isCreator) return reply(mess.creator)
    if (!text) return reply(`Contoh penggunaan:\n${prefix + command} self\n${prefix + command} public`);
    
    if (text.toLowerCase() === 'self') {
        global.self_ = true;
        reply(`✅ Bot mode self aktif\nStatus self bot sekarang ${global.self_}`);
    } else if (text.toLowerCase() === 'public') {
        global.self_ = false;
        reply(`✅ Bot mode public.\nStatus self bot sekarang ${global.self_}`);
    } else {
        reply(`❌ Pilihan tidak valid.\nGunakan:\n${prefix + command} self\n${prefix + command} public`);
    }
}
break;
case 'loading-bar': 
case 'loading': {
 if (!isCreator) return reply(mess.creator)
    if (!text) return reply(`Contoh penggunaan:\n${prefix + command} on\n${prefix + command} off`);
    
    if (text.toLowerCase() === 'on') {
        global.BarLoad = true;
        reply(`✅ Loading Bar diaktifkan\nStatus Loading Bar sekarang ${global.BarLoad}`);
    } else if (text.toLowerCase() === 'off') {
        global.BarLoad = false;
        reply(`✅ Loading Bar dimatikan.\nStatus Loading Bar sekarang ${global.BarLoad}`);
    } else {
        reply(`❌ Pilihan tidak valid.\nGunakan:\n${prefix + command} on\n${prefix + command} off`);
    }
}
break;
case 'owner': {
try {
const owner = global.ownernumber
 function formatNomor(nomor) {
  nomor = nomor.replace(/\D/g, '');

  if (!nomor.startsWith('62')) return 'Format salah, harus diawali 62';

  const kodeNegara = '+62';
  const bagian1 = nomor.slice(2, 5);   
  const bagian2 = nomor.slice(5, 9);   
  const bagian3 = nomor.slice(9);     

  return `${kodeNegara} ${bagian1}-${bagian2}-${bagian3}`;
}
const nomorAsli = owner;
const ownerEdit = formatNomor(nomorAsli);

    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Ryuu/Reinzz
ORG:The Developer Of Mahiru AI;
TEL;type=CELL;type=VOICE;waid=${owner}:${ownerEdit}
URL: https://api.ryuu-dev.offc.my.id
END:VCARD
    `.trim()

   await RyuuBotz.sendMessage(m.chat, {
      contacts: {
        displayName: "Ryuu Reinzz",
        contacts: [{ vcard }]
      },
      contextInfo: {
        externalAdReply: {
          title: "WhatsApp Business • Store",
          body: "The Developer Of Mahiru AI",
          thumbnailUrl: '' + global.thumbnail,
          sourceUrl: 'https://wa.me/6288246552068',
          mediaUrl: 'https://linkbio.co',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted : m })
    global.sleep(500)
    reply(`Semua transaksi di luar command \`.owner\` tidak di tanggung oleh developer asli *Ryuu Reinzz*, jika ada pembelian di luar command \`.owner\`, developer tidak bertanggung jawab atas apa yang terjadi`);
  } catch (e) {
     RyuuBotz.sendMessage(m.chat, {
      text: typeof e === 'string' ? e : '🚫 *Terjadi kesalahan saat memproses permintaan.*',
      quoted: m
    });
  } finally {
    await RyuuBotz.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  }
  }
  break;
  case 'idch':
case 'cekidch': {
  if (!text) return reply("linkchnya mana?");
  if (!text.includes("https://whatsapp.com/channel/")) return reply("Link tautan tidak valid");

  let result = text.split('https://whatsapp.com/channel/')[1];
  let res = await RyuuBotz.newsletterMetadata("invite", result);

  let teks = `*ID:* ${res.id}
*Nama:* ${res.name}
*Total Pengikut:* ${res.subscribers}
*Status:* ${res.state}
*Verified:* ${res.verification === "VERIFIED" ? "Terverifikasi" : "Tidak"}`;

  // bikin pesan interactive
  let msg = generateWAMessageFromContent(m.chat, {
    interactiveMessage: {
      body: { text: teks },
      footer: { text: "powered by ReinzID | Mahiru-MD" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "Copy ID",
              copy_code: res.id
            })
          }
        ]
      }
    }
  }, { quoted: m });

  // kirim pesan interactive
  await RyuuBotz.relayMessage(
    msg.key.remoteJid,
    msg.message,
    { messageId: msg.key.id }
  );
}
break;
  case 'afk': {
    let alasan = m.text.split(' ').slice(1).join(' ') || 'Tanpa alasan :v';
    let existing = afkDB.find(u => u.user === m.sender);

    if (existing) {
        existing.afkTime = Date.now();
        existing.alasan = alasan;
    } else {
        afkDB.push({
            user: m.sender,
            afkTime: Date.now(),
            alasan: alasan
        });
    }

    saveAFK();
    replyafk(`Kamu sekarang AFK${alasan ? ` dengan alasan: ${alasan}` : ''}`);
}
break;
  case 'addweb': {
addweb(m, RyuuBotz, text, prefix, reply, qmsg, isCreator, mess, example); }
break;
case 'delweb': {
delweb(m, RyuuBotz, text, reply, isCreator, mess); }
break;
case 'listweb': {
listweb(m, reply, isCreator, mess); }
break;
case 'scweb':
case 'gethtml': {
gethtml(m, RyuuBotz, text, reply, isCreator, mess); 
}
break
case 'clear-session': {
    const sessionFolder = path.join(__dirname, "session");
    const safeFile = "creds.json";
    const files = fs.readdirSync(sessionFolder).filter(file => file !== safeFile);

    if (files.length === 0) {
        reply("✨ Tidak ada file yang perlu dihapus, Ryuu-kun 💗");
    } else {
        files.forEach(file => fs.unlinkSync(path.join(sessionFolder, file)));
        reply(`🧹 ${files.length} file terhapus:\n${files.join("\n")}`);
    }
}
break;
case 'welcome-img' : {
try {
const ppuser = await RyuuBotz.profilePictureUrl(m.sender, 'image');
const WelcomeLeave = require('./lib/welcome')
const bgURL = ("https://files.catbox.moe/59hhg5.jpg")
const bgBuffer = (await axios.get(bgURL, { responseType: 'arraybuffer' })).data;
const welcomeCard = new WelcomeLeave()
      .setAvatar(ppuser)
      .setBackground("image", bgBuffer)
      .setTitle("Welcome!!")
      .setDescription(`testimoni card`)
      .setOverlayOpacity(0.5);
      
      const buffer = await welcomeCard.build();
      
      await RyuuBotz.sendMessage(m.chat, {
       image: buffer,
        caption: `✅ Gambar berhasil dibuat.` },
         { quoted: m });
         } catch (err) {
        console.error(err);
        reply(`⚠️ Terjadi kesalahan saat membuat gambar.\n*Message:* ${err}`);
    }
   }
   break;
case 'arting': {
  RyuuBotz.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
    try {
        let prompt = text?.trim();
        if (!prompt) return reply(`❌ Masukkan prompt gambar.\nContoh: ${prefix + command} loli imut`);

        const base = `https://aiqtech-nsfw-real.hf.space`;
        const session_hash = Math.random().toString(36).slice(2);

        // Step 1: Join queue
        await axios.post(`${base}/gradio_api/queue/join`, {
            data: [
                prompt
            ],
            event_data: null,
            fn_index: 2, // ini biasanya tetap 2 kalau default UI gradio
            trigger_id: 16,
            session_hash
        });

        // Step 2: Polling hasil
        let resultUrl = null;
        const startTime = Date.now();
        while (Date.now() - startTime < 20000) {
            const { data: raw } = await axios.get(`${base}/gradio_api/queue/data?session_hash=${session_hash}`, {
                responseType: 'text'
            });

            const lines = raw.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const json = JSON.parse(line.slice(6));
                    if (json.msg === 'process_completed') {
                        resultUrl = json.output?.data?.[0]?.url;
                        break;
                    }
                }
            }

            if (resultUrl) break;
            await new Promise(r => setTimeout(r, 1500));
        }

        if (!resultUrl) return reply(`⚠️ Limit atau timeout, coba lagi nanti.`);

        // Step 3: Kirim gambar
        RyuuBotz.sendMessage(m.chat, { image: { url: resultUrl }, caption: `✅ Gambar berhasil dibuat.` }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply(`⚠️ Terjadi kesalahan saat membuat gambar.\n*Message:* ${err}`);
    }
}
break;
case 'smeme': case 'stickermeme': case 'stickmeme': {
if (!/webp/.test(mime) || /image/.test(mime)) {
if (!text) return reply(`Kirim/reply Gambar Dengan Caption ${prefix + command}
 text1|text2`)
 async function UploadFileUgu (input) {
	return new Promise (async (resolve, reject) => {
	const BodyForm = require('form-data');
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}
let atas = text.split('|')[0] ? text.split('|')[0] : '-'
let bawah = text.split('|')[1] ? text.split('|')[1] : '-'
let mee = await RyuuBotz.downloadAndSaveMediaMessage(quoted)
let mem = await UploadFileUgu(mee)
let meme = `https://api.ryuu-dev.offc.my.id/tools/smeme?img=${mem.url}&atas=${encodeURIComponent(atas)}&bawah=${encodeURIComponent(bawah)}`
RyuuBotz.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
let memek = await RyuuBotz.sendImageAsSticker(m.chat, meme, m, { packname: global.packname, author: global.author })
RyuuBotz.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
} else {
reply(`Kirim/reply Gambar Dengan Caption ${prefix + command}
 text1|text2`)
}
}
break
case 'brat2': {
  const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
  const Jimp = require('jimp');

  // Daftarin font teks dan emoji (pastikan file TTF-nya ada di folder lib)
  GlobalFonts.registerFromPath('./lib/arialnarrow.ttf', 'Arial Narrow');
  GlobalFonts.registerFromPath('./lib/NotoColorEmoji.ttf', 'Noto Color Emoji');

  async function BratGenerator(teks) {
    let width = 512;
    let height = 512;
    let margin = 20;
    let wordSpacing = 50;
    let fontSize = 280;
    let lineHeightMultiplier = 1.3;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'black';

    let words = teks.split(' ');
    let lines = [];

    function rebuildLines() {
      lines = [];
      let currentLine = '';
      for (let word of words) {
        let testLine = currentLine ? `${currentLine} ${word}` : word;
        ctx.font = `${fontSize}px "Arial Narrow", "Noto Color Emoji"`;
        let lineWidth =
          ctx.measureText(testLine).width +
          (currentLine.split(' ').length - 1) * wordSpacing;
        if (lineWidth < width - 2 * margin) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    ctx.font = `${fontSize}px "Arial Narrow", "Noto Color Emoji"`;
    rebuildLines();

    while (lines.length * fontSize * lineHeightMultiplier > height - 2 * margin) {
      fontSize -= 2;
      ctx.font = `${fontSize}px "Arial Narrow", "Noto Color Emoji"`;
      rebuildLines();
    }

    let lineHeight = fontSize * lineHeightMultiplier;
    let y = margin;
    for (let line of lines) {
      let wordsInLine = line.split(' ');
      let x = margin;
      for (let word of wordsInLine) {
        ctx.fillText(word, x, y);
        x += ctx.measureText(word).width + wordSpacing;
      }
      y += lineHeight;
    }

    let buffer = await canvas.encode('png');
    let image = await Jimp.read(buffer);
    image.blur(3);
    let blurredBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    return RyuuBotz.sendImageAsSticker(m.chat, blurredBuffer, m, {
      packname: global.packname,
      author: global.author
    });
  }

  if (!text) return reply(`Masukkan teks untuk stiker.\n\nContoh:\n.brat2 Aku 🥺 Sayang Kamu 💗`);
  return BratGenerator(text);
}
break;
case 's':
case 'stiker':
case 'sticker': {
  try { 
  const { Sticker, StickerTypes } = require('wa-sticker-formatter')
  
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let media = await quoted.download();

    // set packname & author
    let teks1 = text?.split('|')[0] ? text.split('|')[0] : global.packname;
    let teks2 = text?.split('|')[1] ? text.split('|')[1] : global.author;

    if (!/image|video|webp/.test(mime)) {
      return reply(
        `Kirim/reply gambar/video/stiker dengan caption *${prefix + command}*\nDurasi Video/GIF 1-5 Detik 🌸`
      );
    }

    if (/webp/.test(mime)) {
  // === sticker ===
  await RyuuBotz.sendMessage(m.chat, {
    react: { text: "⏱️", key: m.key }
  })

    const stiker = new Sticker(media, {
      pack: teks1,   // watermark packname
      author: teks2,   // watermark author
      type: StickerTypes.FULL,
      quality: 80,
    })

    const buffer = await stiker.toBuffer()
    await RyuuBotz.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
    } else if (/video/.test(mime)) {
      // === VIDEO ===
      if ((q.msg || q).seconds > 5) return reply('Maksimal 5 detik yaa sayang 🥺🫧');
      await RyuuBotz.sendMessage(m.chat, {
        react: { text: "⏱️", key: m.key }
      });
      await RyuuBotz.sendVideoAsSticker(m.chat, media, m, { packname: teks1, author: teks2 });

    }
    else if (/image/.test(mime)) {
      // === FOTO ===
      await RyuuBotz.sendMessage(m.chat, {
        react: { text: "⏱️", key: m.key }
      });
      await RyuuBotz.sendImageAsSticker(m.chat, media, m, { packname: teks1, author: teks2 });

    }
  
 } catch (err) {
    reply(`Gagal membuat stiker 🗿\n${err.message}`);
    console.error('Gagal membuat stiker:', err);
  }
}
break;
case 'tourl': {
				if (!mime) return reply(`Kirim/Reply Video/Gambar Dengan Caption ${prefix + command}`);
				RyuuBotz.sendMessage(m.chat, { react: { text: "⏳️",key: m.key,}})
				try {
					let media = await RyuuBotz.downloadAndSaveMediaMessage(quoted);
					if (/image|video|audio/.test(mime)) {
						let response = await CatBox(media);
						let fileSize = (fs.statSync(media).size / 1024).toFixed(2);
						let uploadDate = new Date().toLocaleString();
						let uploader = `${pushname}`;
						let caption = `> ᴜᴋᴜʀᴀɴ ғɪʟᴇ : ${fileSize} ᴋʙ\n> ᴘᴇɴɢᴜɴɢɢᴀʜ : ${uploader}`.trim();

let msg = generateWAMessageFromContent(
    m.chat,
    {
      interactiveMessage: {
        header: {
          hasMediaAttachment: true,
          imageMessage: (
            await prepareWAMessageMedia(
              { image: { url: global.thumbnail } },
              { upload: RyuuBotz.waUploadToServer }
            )
          ).imageMessage
        },
        body: { text: caption },
        footer: { text: "Powered by ReinzID | Mahiru-MD" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copy Link",
                copy_code: response
              })
            }
          ]
        }
      }
    },
    { quoted: m }
  );

  await RyuuBotz.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });					} else if (!/image/.test(mime)) {
						let response = await CatBox(media);
						reply(response);
					} else {
						reply(`Jenis media tidak didukung!`);
					}
				fs.unlinkSync(media);
				} catch (err) {
					console.log(err);
					reply(`Gagal\n*Error:* ${err}`);
				}
			}
			break
//=================={{=[===================]]\\
case 'tourl2': {
  if (!quoted) return reply(`Reply gambar yang ingin di-upload!`)
  if (!/image|video/.test(mime)) return reply(`Itu bukan video/gambar!`)
  await RyuuBotz.sendMessage(m.chat, { react: { text: "⏳️",key: m.key,}})
  const axios = require("axios")
  const fs = require("fs")
  const FormData = require("form-data")
  const path = require("path")

  try {
    let mediaPath = await RyuuBotz.downloadAndSaveMediaMessage(quoted)

    const form = new FormData()
    form.append('file', fs.createReadStream(mediaPath))

    const res = await axios.post(
      'https://api.aceimg.com/api/upload',
      form,
      {
        headers: {
          ...form.getHeaders()
        }
      }
    )

    fs.unlinkSync(mediaPath)

    const data = res.data
    if (data.status && data.link) {
      // Ambil filename dari link
      const match = data.link.match(/f=([^\s]+)/)
      const filename = match ? match[1] : null

      if (filename) {
        const cdnLink = `https://cdn.aceimg.com/${filename}`
        const caption = 'Item kamu berhasil di upload';
        let msg = generateWAMessageFromContent(
        m.chat,
    {
      interactiveMessage: {
        header: {
          hasMediaAttachment: true,
          imageMessage: (
            await prepareWAMessageMedia(
              { image: { url: global.thumbnail } },
              { upload: RyuuBotz.waUploadToServer }
            )
          ).imageMessage
        },
        body: { text: caption },
        footer: { text: "Powered by ReinzID | Mahiru-MD" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copy Link",
                copy_code: cdnLink
              })
            }
          ]
        }
      }
    },
    { quoted: m }
  );

  await RyuuBotz.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });	
      } else {
        reply(`✅ Berhasil upload, tapi gagal ambil filename!\n🌐 Link: ${data.link}`)
      }

    } else {
      reply(`❌ Upload gagal!\n📄 ${data.message || 'Tidak diketahui'}`)
    }

  } catch (err) {
    console.error(err)
    reply(`❌ Upload error: ${err.response?.data?.message || err.message}`)
  }
}
break
  case 'prefix': {
    if (!text) return reply(`Contoh penggunaan:\n${prefix}prefix on\n${prefix}prefix off`);
    
    if (text.toLowerCase() === 'on') {
        global.pref = true;
        reply(`✅ Prefix diaktifkan.\nPrefix sekarang: "${global.prefix}"`);
    } else if (text.toLowerCase() === 'off') {
        global.pref = false;
        reply(`✅ Prefix dimatikan.\nSekarang command tanpa prefix.`);
    } else {
        reply(`❌ Pilihan tidak valid.\nGunakan:\n${prefix}prefix on\n${prefix}prefix off`);
    }
}
break;
case 'menu': {
    RyuuBotz.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

    function countIdsFromFile(path = './database/registered.json') {
    try {
      const rawData = fs.readFileSync(path);
      const database = JSON.parse(rawData);
      return database.length;
    } catch (err) {
      console.error('Gagal membaca file:', err.message);
      return 0;
    }
  }

    const totalIds = countIdsFromFile();
    const kosong = global.kosong;
    const ownernya = global.ownernumber + '@s.whatsapp.net';
    const me = m.sender;
    const ReinzID_sad = `*Konnichiwa ${pushname}!*  
Aku adalah *${global.namabot}*, asisten virtualmu 💫

╭─⌈ *𝙄𝙉𝙁𝙊 𝙐𝙎𝙀𝙍* ⌋
│◦ ɴᴀᴍᴀ : *${pushname}*
│◦ sᴛᴀᴛᴜs : *${isPremium ? 'ᴘʀᴇᴍɪᴜᴍ ✓' : 'ғʀᴇᴇ 𝕏'}*
│◦ ɴᴏᴍᴏʀ : ${m.sender.split("@")[0]}
╰─────────────

╭─⌈ *𝙊𝙒𝙉𝙀𝙍 𝙄𝙉𝙁𝙊* ⌋
│𖥔 ᴄʀᴇᴀᴛᴏʀ : ${global.ownername}
│𖥔 ɴᴀᴍᴀ ʙᴏᴛ : ${global.namabot}
│𖥔 ᴠᴇʀsɪ : 1.0.0
│𖥔 ᴛʏᴘᴇ : ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
╰─────────────

╭─⌈ *𝘽𝙊𝙏 𝙎𝙏𝘼𝙏𝙐𝙎* ⌋
│◦ ɴᴀᴍᴀ : *${global.namabot}*
│◦ ʀᴜɴᴛɪᴍᴇ : *${runtime(process.uptime(),)}*
│◦ ᴅᴇᴠᴇʟᴏᴘᴇʀ : *${global.ownername}*
│◦ ᴍᴏᴅᴇ : *${self_ ? 'Self' : 'Public'}*
│◦ ᴘᴇɴɢɢᴜɴᴀ : *${totalIds}*
╰─────────────
${kosong}
┏『 *乂 SYSTEM - CORE 乂* 』━━◧
║◦ ${prefix}ping        
║◦ ${prefix}runtime    
║◦ ${prefix}c-log        
║◦ ${prefix}loading-bar  
║◦ ${prefix}bot-mode    
║◦ ${prefix}prefix        
║◦ ${prefix}addcase     
║◦ ${prefix}delcase      
║◦ ${prefix}getcase      
║◦ ${prefix}addplugin    
║◦ ${prefix}delplugin     
║◦ ${prefix}getplugin     
┗━━━━━━━━━━━━━━━━⊱

┏『 *乂 FUN - INTERFACE 乂* 』━━◧
║◦ ${prefix}sticker       
║◦ ${prefix}smeme      
║◦ ${prefix}play         
║◦ ${prefix}ytmp3       
║◦ ${prefix}yytmp3      
║◦ ${prefix}yttmp3      
║◦ ${prefix}ytmp4       
║◦ ${prefix}yytmp4      
║◦ ${prefix}yttmp4      
┗━━━━━━━━━━━━━━━━⊱

┏『 *乂 AI - CHAT MODULE 乂* 』━━◧
║◦ ${prefix}mahiru    ⌲ Istri owner :v
║◦ ${prefix}aoi         
║◦ ${prefix}karin       
║◦ ${prefix}mongfa    
║◦ ${prefix}amelia     
║◦ ${prefix}iroha       
┗━━━━━━━━━━━━━━━━⊱

┏『 *乂    TOOLS    乂* 』━━◧
║◦ ${prefix}remini     
║◦ ${prefix}cekidch    
║◦ ${prefix}tourl       
║◦ ${prefix}tourl2      
║◦ ${prefix}aiedit       
║◦ ${prefix}brat        
║◦ ${prefix}bratnime   
┗━━━━━━━━━━━━━━━━⊱`;

    await RyuuBotz.sendMessage(m.chat, {
        video: fs.readFileSync('./database/assest/thumbvid.mp4'),
        gifPlayback: true,
        caption: ReinzID_sad,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: global.namabot,
                newsletterJid: '120363419382206255@newsletter'
            },
            externalAdReply: {
                title: global.namabot,
                body: global.ownername,
                thumbnailUrl: `${global.thumbnail}`,
                sourceUrl: `https://whatsapp.com/channel/0029Vb49CCWJ93wO2dLDqx14`,
                mediaType: 1,
                renderLargerThumbnail: true,
                mentionedJid: [m.sender]
            }
        }
    }, { quoted: m });

    const musik = {
        audio: fs.readFileSync('./database/assest/menu.mp3'),
        mimetype: 'audio/mp4',
        ptt: true
    };
    await RyuuBotz.sendMessage(m.chat, musik, { quoted: m });
}
break;
case 'info':
case 'tes':
case 'ping':
case 'bot':
case 'bot-tes':
case 'bottes': {
 if (!isCreator) return reply(mess.creator)
  const os = require('os');
  const fs = require('fs');
  const { execSync } = require('child_process');

  function countIdsFromFile(path = './database/registered.json') {
    try {
      const rawData = fs.readFileSync(path);
      const database = JSON.parse(rawData);
      return database.length;
    } catch (err) {
      console.error('Gagal membaca file:', err.message);
      return 0;
    }
  }

  const totalIds = countIdsFromFile();
  try {
    const output = execSync('df -h /').toString().split('\n')[1].split(/\s+/);
    const totals = output[1];
    const useds = output[2];
    const availables = output[3];
    const percents = output[4];

    const used = process.memoryUsage();
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
      return cpu
    });

    const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total
      last.speed += cpu.speed / length
      last.times.user += cpu.times.user
      last.times.nice += cpu.times.nice
      last.times.sys += cpu.times.sys
      last.times.idle += cpu.times.idle
      last.times.irq += cpu.times.irq
      return last
    }, {
      speed: 0,
      total: 0,
      times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
    });

    let timestamp = speed();
    let latensi = speed() - timestamp;
    neww = performance.now();
    oldd = performance.now();

    const finalText = `
\`ɪɴғᴏʀᴍᴀsɪ ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ\`

🕒 ᴋᴇᴄᴇᴘᴀᴛᴀɴ : ${latensi.toFixed(4)} ᴅᴇᴛɪᴋ
⏳ ᴀᴋᴛɪғ : ${runtime(process.uptime())}

👤 ᴘᴇɴɢɢᴜɴᴀ ᴛᴇʀᴅᴀғᴛᴀʀ : *${totalIds}*
📲 ᴍᴏᴅᴇ : *${self_ ? 'sᴇʟғ' : 'ᴘᴜʙʟɪᴄ'}*

📡 ɪɴғᴏ sᴇʀᴠᴇʀ
━━━━━━━━━━━━━━━
💾 RAM : ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

📁 Disk : ${useds}B / ${totals}B (${percents})
📂 Free : ${availables}B

🧠 CPU : User ${(100 * cpu.times.user / cpu.total).toFixed(1)}% 
         : Sys ${(100 * cpu.times.sys / cpu.total).toFixed(1)}%
         : Idle ${(100 * cpu.times.idle / cpu.total).toFixed(0)}%
        - ${cpus[0].model.trim()} (${cpus.length} Cores)
━━━━━━━━━━━━━━━

✨ ᴋᴀʟᴀᴜ ᴀᴅᴀ ᴋᴇʙᴜᴛʜᴀɴ ʟᴀɪɴɴʏᴀ ᴋᴀʙᴀʀɪɴ ᴍᴀʜɪʀᴜ ʏᴀ~ ✨
`.trim();
    await loadingBar(m, RyuuBotz);
    await global.sleep(1000);
    await RyuuBotz.sendMessage(m.chat, {
      text: finalText,
      contextInfo: {
        externalAdReply: {
          title: 'ᴋᴇᴄᴇᴘᴀᴛᴀɴ ʙᴏᴛ',
          body: `${latensi.toFixed(4)} ᴅᴇᴛɪᴋ\n${oldd - neww} _miliseconds_`,
          thumbnailUrl: global.thumbnail,
          sourceUrl: global.saluran,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("Error di case 'ping':", e)
    reply("Terjadi kesalahan saat menjalankan info lanjutan.")
  }
}
break;
case 'hd':
case 'remini': {
  if (!/image/.test(mime) || !quoted) return reply(`Kirim/reply Foto dengan caption ${prefix + command}`);

  await RyuuBotz.sendMessage(m.chat, { react: { text: `⏳️`, key: m.key } });

  try {
    let mediaPath = await RyuuBotz.downloadAndSaveMediaMessage(quoted);
    let fileSize = (fs.statSync(mediaPath).size / 1024).toFixed(2);

async function UploadFileUgu (input) {
	return new Promise (async (resolve, reject) => {
	const BodyForm = require('form-data');
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}
let mem = await UploadFileUgu(mediaPath)
    const apiKey = 'RyuuGanteng';
    const apiUrl = `https://api.ryuu-dev.offc.my.id/imagecreator/remini?apikey=${apiKey}&url=${mem.url}`;

    const { data } = await axios.get(apiUrl,
     {
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'RyuuBotz/1.0' }
    });

    if (!data.status || !data.result) {
      throw new Error('Remini API gagal memproses gambar');
    }

    await RyuuBotz.sendMessage(m.chat, {
      image: { url: data.result },
      caption: `_Sudah HD kak_\nUkuran file asli: ${fileSize} KB`
    }, { quoted: m });

    fs.unlinkSync(mediaPath);

  } catch (err) {
    console.error(err);
    reply(`Ups, terjadi kesalahan. Laporkan ke owner ya.\n*Makan tuh Error:* ${err.message}`);
  }
}
break;
      case "runtime":
      {
        let lowq = `*Telah Online Selama:*\n${runtime(
          process.uptime(),
        )}`;
        reply(`${lowq}`);
      }
      break      
case 'addcase': {
 if (!isCreator) return reply(mess.creator)
 if (!text) return reply('Mana case nya');
    const fs = require('fs');
const namaFile = 'case.js';
const caseBaru = `${text}`;
fs.readFile(namaFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Terjadi kesalahan saat membaca file:', err);
        return;
    }
    const posisiAwalGimage = data.indexOf("case 'addcase':");

    if (posisiAwalGimage !== -1) {
        const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
        fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
            if (err) {
                reply('Terjadi kesalahan saat menulis file:', err);
            } else {
                reply('Sukses Menambahkan Fitur\nJika Ingin Menginfokan Ss Dan Reply Ssan Barcaption .newfitur');
            }
        });
    } else {
        reply('Tidak dapat menambahkan case dalam file.');
    }
});

}
break
            case 'delcase': {
                if (!isCreator) return reply('Fitur Khusus Owner!')
                if (!text) return reply('Mana case nya bang?');
                dellCase('./case.js', q)
                reply('Berhasil menghapus case!.');
            }
            break
      case "addprem": {
    if (!isCreator) return
    if (!args[0]) return reply(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} ${global.owner}`)
   let prrkek = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
    let ceknya = await RyuuBotz.onWhatsApp(prrkek) // Mengecek Apkah Nomor ${prrkek} Terdaftar Di WhatsApp 
    if (ceknya.length == 0) return reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
    premium.push(prrkek)
    fs.writeFileSync("./database/premium.json", JSON.stringify(premium))
    reply(`Successfully Added ${prrkek} To Database`)
}
break
case "delprem": {
    if (!isCreator) return
    if (!args[0]) return reply(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} ${global.owner}`)
    let ya = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
    let unp = premium.indexOf(ya)
    premium.splice(unp, 1)
    fs.writeFileSync("./database/premium.json", JSON.stringify(premium))
    reply(`Successfully Removed ${ya} From Database`)
}
break
case "listprem": {
if (!isCreator) return reply("❗ *Access Denied*\nFitur Only `Owner`")
 let premList = JSON.parse(fs.readFileSync("./database/premium.json"));
 
 if (premList.length === 0) return reply("⚠️ Tidak ada Premium yang terdaftar!");
 let text = "💭 *Daftar Premium:*\n\n";
 premList.forEach((prrem, index) => {
 text += `- ${index + 1}. @${prrem}\n`;
 });
 RyuuBotz.sendMessage(m.chat, { text, mentions: premList.map(v => v + "@s.whatsapp.net") }, { quoted: qtext });
}
break;
case 'public':
  if (!isCreator) return reply('Khusus owner!')
  RyuuBotz.public = true
  reply('Berhasil masuk ke mode *Public* (semua orang bisa menggunakan bot)')
  break
      
    default:
    
if (budy.startsWith('=>')) {
    if (!isCreator) return

    function Return(sul) {
        sat = JSON.stringify(sul, null, 2)
        bang = util.format(sat)
        if (sat == undefined) {
            bang = util.format(sul)
        }
        return reply(bang)
    }
    try {
        reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
    } catch (e) {
        reply(String(e))
    }
}

if (budy.startsWith('>')) {
    if (!isCreator) return;
    try {
        let evaled = await eval(budy.slice(2));
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
        await reply(evaled);
    } catch (err) {
        reply(String(err));
    }
}

if (budy.startsWith('$')) {
    if (!isCreator) return
    exec(budy.slice(2), (err, stdout) => {
        if (err) return reply(`${err}`)
        if (stdout) return reply(stdout)
    })
}

}
} catch (err) {
    console.log(util.format(err))
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})



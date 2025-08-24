const { RyuuBotz, m, chatUpdate, store } = require('../case')
const { sendMessage } = require('../case')

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
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: randomThumb,
                sourceUrl: 'https://instagram.com/reinzz311'
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
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/gy0b0m.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
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
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/tlv50f.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
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
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/ii8hg1.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
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
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/96e0td.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
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
                body: 'ғᴏʟʟᴏᴡ ɪɢ reinzz.311',
                thumbnailUrl: 'https://files.catbox.moe/jjbu7b.jpg',
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
async function reply(text) {
const thumbnails = [
        'https://files.catbox.moe/h9spy4.jpg',
        'https://files.catbox.moe/ghven4.jpg',
        'https://files.catbox.moe/9z6zif.jpg',
        'https://files.catbox.moe/wgnwyo.jpg',
        'https://files.catbox.moe/skqb0h.jpg'
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
                body: `ғᴏʟʟᴏᴡ ɪɢ reinzz.311`,
                thumbnailUrl: '' + `${randomThumb}`,
                sourceUrl: 'https://instagram.com/reinzz311'
            }
        }
    }, { quoted: m });
}
module.exports = {
  replymahiru,
  replyaoi,
  replyamelia,
  replyiroha,
  replymongfa,
  replykarin,
  reply
};
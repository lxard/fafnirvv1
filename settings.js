const fs = require('fs')
const chalk = require('chalk')

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SETTINGS OWNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ \\
global.lidownernumber = '129459441135829'
global.ownernumber = '6285921967820'
global.ownername = 'Fafnir'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SETTINGS BOT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
global.namabot = "Mahiru"
global.saluran = "https://whatsapp.com/channel/0029Vb6HkIQL7UVNqo9JUb2E"
global.botNumber = '6285800308723'
global.nomorbot = '6285800308723'
global.packname = 'Stick By'
global.author = 'Fafnir'
global.foother = 'Created By'
global.thumbnail = 'https://files.catbox.moe/59hhg5.jpg'
global.prefix = '.'
global.pref = true;
global.channel_log = false;
global.BarLoad = false;
global.self_ = false;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SETTINGS LIMITZ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
global.limitawal = {
    premium: "Infinity",
    free: 30
}
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SETTINGS MESSAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
global.mess = {
    success: 'sᴜᴄᴄᴇssғᴜʟʏ',
    admin: '[ !! ] *sʏsᴛᴇᴍ*\nᴋʜᴜsᴜs ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ',
    botAdmin: '[ !! ] *sʏsᴛᴇᴍ*\nʙᴏᴛ ʙᴇʟᴜᴍ ᴊᴀᴅɪ ᴀᴅᴍɪɴ',
    creator: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ɪɴɪ ᴋʜᴜsᴜs ᴏᴡɴᴇʀ',
    group: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ɪɴɪ ᴋʜᴜsᴜs ɢʀᴏᴜᴘ ᴀᴊᴀ',
    private: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ᴋʜᴜsᴜs ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ',
    wait: '[ !! ] *sʏsᴛᴇᴍ*\nᴡᴀɪᴛ ᴀᴋᴀᴍᴇ ᴘʀᴏsᴇs ᴅᴜʟᴜ',
    premium: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ᴋʜᴜsᴜs ᴘʀᴇᴍɪᴜᴍ',
    notregist: '[ !! ] *sʏsᴛᴇᴍ*\nᴀɴᴅᴀ ʙᴇʟᴜᴍ ᴛᴇʀᴅᴀғᴛᴀʀ ᴅɪ ᴅᴀᴛᴀʙᴀsᴇ, sɪʟᴀʜᴋᴀɴ .ʀᴇɢɪsᴛᴇʀ ᴅᴀʜᴜʟᴜ', 
    endLimit: '[ !! ] *sʏsᴛᴇᴍ*\nʟɪᴍɪᴛ ᴀɴᴅᴀ ʜᴀʙɪs ,, ᴀᴋᴀɴ ᴅɪ ʀᴇsᴇᴛ sᴇᴛᴇʟᴀʜ sᴇʜᴀʀɪ',
}



// *** message *** 
global.closeMsgInterval = 30; // 30 menit. maksimal 60 menit, minimal 1 menit
global.backMsgInterval = 2; // 2 jam. maksimal 24 jam, minimal 1 jam
//———————[ Manage Vercell ]———————//
global.vercelToken = "GjSv4uLif1J7mEr55TIbLrpX" //Your Vercel Token

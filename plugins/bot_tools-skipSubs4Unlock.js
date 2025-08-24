/*
* Nama fitur : Skiplink Sub4unlock
* Type : Plugin Esm
* Note : Jangan lupa ambil apikey nya, https://fgsi.koyeb.app/login
* Sumber : https://whatsapp.com/channel/0029Vb6Zs8yEgGfRQWWWp639
* Author : ZenzzXD
*/
const axios = require('axios')

let handler = async (m, { RyuuBotz, text, prefix, command, reply }) => {
    if (!text) return reply(`Contoh : .skiplink https://sub4unlock.co/S9oU0`);
    reply('wett')
    const APIKEY = 'fgsiapi-2744bd4c-6d'
    await RyuuBotz.sendMessage(m.chat, {
      react: { text: "⏱️", key: m.key }
    });
    try {
        let api = `https://fgsi.koyeb.app/api/tools/skip/sub4unlock?apikey=${APIKEY}&url=${encodeURIComponent(text)}`;
        let { data: json } = await axios.get(api);

        if (!json.status || !json.data?.linkGo) {
            return reply('Lu masukin url apa tu woy 😂');
        }

        await reply(`${json.data.linkGo}`);
    } catch (err) {
        reply(`Eror kak : ${err.message}`)
    }
};

handler.help = ['skiplinksub4unlock <url>'];
handler.tags = ['tools'];
handler.command = ['skiplink', 'skiplinksub4unlock']

module.exports = handler;
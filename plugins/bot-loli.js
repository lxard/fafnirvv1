const axios = require("axios");

let handler = async (m, { RyuuBotz, reply }) => {
    try {
    await RyuuBotz.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
        const url = "https://api.ryuu-dev.offc.my.id/random/cosplay-ba";
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data, "binary");

        // Dasar pedo :v
        await RyuuBotz.sendMessage(
            m.chat,
            { image: buffer, caption: "Loli *pedo pedo" },
            { quoted: m }
        );
    } catch (err) {
        console.error(err);
        reply(`Error bang :v\n Error: ${err}`)
    }
};

handler.command = ["loli"];
module.exports = handler;
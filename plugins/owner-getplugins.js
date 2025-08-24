const fs = require("fs");

let handler = async (m, { RyuuBotz, isCreator, isCreatorLid, text, reply, example }) => {
  if (!isCreator && !isCreatorLid) return reply(mess.creator);
  if (!text) return reply(example("namafile plugins"));
  if (!text.endsWith(".js")) return reply("Nama file harus berformat .js");
  
  let filePath = "./plugins/" + text.toLowerCase();
  if (!fs.existsSync(filePath)) return reply("File plugins tidak ditemukan!");

  let fileBuffer = fs.readFileSync(filePath);
  
  // Kirim sebagai file
  await RyuuBotz.sendMessage(m.chat, {
    document: fileBuffer,
    fileName: text.toLowerCase(),
    mimetype: "application/javascript"
  }, { quoted: m });

  return reply(`Berhasil mengirim file plugins *${text.toLowerCase()}*`);
};

handler.command = ["getplugin", "getplugins"];

module.exports = handler;
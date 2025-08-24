const fs = require("fs")

let handler = async (m, { RyuuBotz, isCreatorLid, isCreator, text, reply, example }) => {
if (!isCreator && !isCreatorLid) return reply(mess.creator)
if (!text) return reply(example("namafile plugins"))
if (!text.endsWith(".js")) return reply("Nama file harus berformat .js")
if (!fs.existsSync("./plugins/" + text.toLowerCase())) return reply("File plugins tidak ditemukan!")
await fs.unlinkSync("./plugins/" + text.toLowerCase())
return reply(`Berhasil menghapus file plugins *${text.toLowerCase()}*`)
}

handler.command = ["delplugins", "delplugin"]

module.exports = handler
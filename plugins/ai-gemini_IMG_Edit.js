const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = "AIzaSyDp6HU2CJ2gWS_dU2VVDbD2Mwde5VaMYU0";

let handler = async (m, { RyuuBotz, text, reply, command, prefix }) => {
  if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
    return reply(`📌 Reply gambar dengan caption: *${prefix + command} [prompt]*\nContoh: *${prefix + command} beri topi santa*`);
  }

  if (!text || text.trim().length < 3) {
    return reply(`*Prompt tidak boleh kosong!*\nContoh: *${prefix + command} beri topi santa*`);
  }

  await RyuuBotz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    const mediaPath = await RyuuBotz.downloadAndSaveMediaMessage(m.quoted);
    const mediaBuffer = fs.readFileSync(mediaPath);
    const mime = m.quoted.mimetype || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
      generationConfig: { responseModalities: ["Text", "Image"] }
    });

    const response = await model.generateContent([
      { text: text },
      { inlineData: { mimeType: mime, data: mediaBuffer.toString("base64") } }
    ]);

    const content = response?.response?.candidates?.[0]?.content;
    if (!content) throw new Error("No content generated");
    const result = content.parts.find(p => p.inlineData);
    if (!result) throw new Error("No image found in response");

    const imgBuffer = Buffer.from(result.inlineData.data, "base64");

    await RyuuBotz.sendMessage(m.chat, {
      image: imgBuffer,
      caption: `✅ *Hasil AI Edit*\nPrompt: ${text}`
    }, { quoted: m });

    await RyuuBotz.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    await RyuuBotz.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply(`❌ Gagal memproses gambar.\n*Error:* ${err.message}`);
  }
};

handler.command = ["aiedit", "image-edit", "imgedit"];
module.exports = handler;
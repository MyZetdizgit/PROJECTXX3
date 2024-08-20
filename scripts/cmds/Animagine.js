const fs = require("fs");
const path = require("path");
const axios = require("axios");

const styleMap = {
  0: "masterpiece, best quality, detailled",
  1: "masterpiece, best quality, very aesthetic, absurdres, cinematic still, emotional, harmonious, vignette, highly detailed, high budget, bokeh, cinemascope, moody, epic, gorgeous, film grain, grainy",
  2: "masterpiece, best quality, very aesthetic, absurdres, cinematic photo, 35mm photograph, film, bokeh, professional, 4k, highly detailed",
  3: "masterpiece, best quality, very aesthetic, absurdres, anime artwork, anime style, key visual, vibrant, studio anime, highly detailed",
  4: "masterpiece, best quality, very aesthetic, absurdres, manga style, vibrant, high-energy, detailed, iconic, Japanese comic style",
  5: "masterpiece, best quality, very aesthetic, absurdres, concept art, digital artwork, illustrative, painterly, matte painting, highly detailed",
  6: "masterpiece, best quality, very aesthetic, absurdres, pixel-art, low-res, blocky, pixel art style, 8-bit graphics",
  7: "masterpiece, best quality, very aesthetic, absurdres, ethereal fantasy concept art, magnificent, celestial, ethereal, painterly, epic, majestic, magical, fantasy art, cover art, dreamy",
  8: "masterpiece, best quality, very aesthetic, absurdres, neonpunk style, cyberpunk, vaporwave, neon, vibes, vibrant, stunningly beautiful, crisp, detailed, sleek, ultramodern, magenta highlights, dark purple shadows, high contrast, cinematic, ultra detailed, intricate, professional",
  9: "masterpiece, best quality, very aesthetic, absurdres, professional 3d model, octane render, highly detailed, volumetric, dramatic lighting"
};

module.exports = {
  config: {
    name: "animagine",
    aliases: [],
    author: "Zetsu/MarianCross",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Generate an image based on a prompt.",
    longDescription: "Generates an image based on a prompt and optional parameters.",
    category: "fun",
    guide: "{p}animagine prompt --m modelIndex --r ratioIndex --cfg cfgIndex --style styleIndex"
  },
  onStart: async function ({ message, args, api, event }) {
    api.setMessageReaction("⚙️", event.messageID, (err) => {}, true);
    try {
      let prompt = "";
      let modelIndex = 0;
      let ratioIndex = 0;
      let cfgIndex = 5;
      let styleIndex = 0;

      const modelArgIndex = args.indexOf("--m");
      const ratioArgIndex = args.indexOf("--r");
      const cfgArgIndex = args.indexOf("--cfg");
      const styleArgIndex = args.indexOf("--style");
       
      if (modelArgIndex !== -1) {
        modelIndex = parseInt(args[modelArgIndex + 1], 10);
      }

      if (ratioArgIndex !== -1) {
        ratioIndex = parseInt(args[ratioArgIndex + 1], 10);
      }

      if (cfgArgIndex !== -1) {
        cfgIndex = parseInt(args[cfgArgIndex + 1], 10);
      }

      if (styleArgIndex !== -1) {
        styleIndex = parseInt(args[styleArgIndex + 1], 10);
      }

      prompt = args.slice(0, Math.min(
        modelArgIndex === -1 ? args.length : modelArgIndex,
        ratioArgIndex === -1 ? args.length : ratioArgIndex,
        cfgArgIndex === -1 ? args.length : cfgArgIndex,
        styleArgIndex === -1 ? args.length : styleArgIndex
      )).join(" ").trim();
    
      if (!prompt) {
        return message.reply("❌ | Vous devez fournir un prompt\n\n 𝐒𝐚𝐢𝐬𝐢𝐬𝐬𝐞𝐳 [𝗔𝗻𝗶𝗺𝗮𝗴𝗶𝗻𝗲 𝗚𝘂𝗶𝗱𝗲] 𝐩𝐨𝐮𝐫 𝐦𝐢𝐞𝐮𝐱 𝐜𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐞 𝐥𝐚 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞.");
      }

      if (prompt.toLowerCase() === "guide") {
        const usim = "◉ 𝐆𝐔𝐈𝐃𝐄 𝐀𝐍𝐈𝐌𝐀𝐆𝐈𝐍𝐄 :\n\n𝗔𝗻𝗶𝗺𝗮𝗴𝗶𝗻𝗲 𝘱𝘳𝘰𝘮𝘱𝘵 --𝗺  𝘮𝘰𝘥𝘦𝘭(𝟬-𝟭6) --𝗿 𝘳𝘢𝘵𝘪𝘰 (𝟬-𝟮) --𝘴𝘵𝘺𝘭𝘦 𝘴𝘵𝘺𝘭𝘦(𝟭-𝟵)\n\n ◉𝐑𝐚𝐭𝐢𝐨 𝐃𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞 :\n\n𝘗𝘰𝘳𝘵𝘳𝘢𝘪𝘵  ➨ 𝟬\n𝘓𝘢𝘯𝘥𝘴𝘤𝘢𝘱𝘦  ➨ 𝟮\n 𝘚𝘲𝘶𝘢𝘳𝘦  ➨ 𝟭\n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Animagine un chien en robe sur la lune --m 4 --r 2 --style 1 \n\n◉ 𝐏𝐨𝐮𝐫 𝐯𝐨𝐢𝐫 𝐥𝐞𝐬 𝐦𝐨𝐝𝐞𝐥𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞 : \n [𝗔𝗻𝗶𝗺𝗮𝗴𝗶𝗻𝗲 𝗺𝗼𝗱𝗲𝗹]\n";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }                                   
       
      if (prompt.toLowerCase() === "model") {
        const modelList = "◉ 𝐌𝐎𝐃𝐄𝐋𝐒 𝐀𝐍𝐈𝐌𝐀𝐆𝐈𝐍𝐄 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 ◉\n\n0 | AnythingV5 \n1 | Breakdomain_I2428\n2 | Breakdomain_M2150\n3 | ChildrensStories_v1ToonAnime \n4 | Counterfeit_v30\n5 | CuteyukimixAdorable\n6 | Dreamlike-anime-1.0\n7 | Meinamix_meinaV9\n8 | Meinamix_meinaV11\n9 | PastelMixStylizedAnime\n10| Toonyou_be \n11| Mechamix_v10\n12| CetusMix_Version35\n13| Dalcefo_v4\n14| AOM3A3_Orangemixs\n15| Theallys-mix-ii\n16| Aniverse-v3";
        return api.sendMessage(modelList, event.threadID, event.messageID);
      }

      if (isNaN(modelIndex) || modelIndex < 0 || modelIndex > 16) {
        return message.reply("❌ | Numéro de modèle invalide !");
      }

      if (isNaN(ratioIndex) || ratioIndex < 0 || ratioIndex > 2) {
        return message.reply("❌ | Numéro de ratio invalide !");
      }

      if (isNaN(cfgIndex) || cfgIndex < 0 || cfgIndex > 9) {
        return message.reply("❌ | Numéro de CFG invalide !");
      }

      if (isNaN(styleIndex) || styleIndex < 0 || styleIndex > 9) {
        return message.reply("❌ | Numéro de style invalide !");
      }

      if (styleIndex in styleMap) {
        prompt += `, ${styleMap[styleIndex]}`;
      }

      const apiUrl = `https://zetanimagine-pdva.onrender.com/generate?prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&ratioIndex=${ratioIndex}&cfgIndex=${cfgIndex}`;

      const response = await axios.get(apiUrl, { responseType: "stream" });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const imagePath = path.join(cacheFolderPath, `generated.png`);

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        const stream = fs.createReadStream(imagePath);
        api.setMessageReaction('✅', event.messageID, () => {}, true);
        return message.reply({
          body: "",
          attachment: stream
        });
      });

      writer.on("error", (err) => {
        console.error("Stream error:", err);
        message.reply("❌ | Échec de la génération de l'image.");
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | Échec de la génération de l'image.");
    }
  }
};

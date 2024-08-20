const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "imagine",
    aliases: ["prodia"],
    author: "Zetsu",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Imagine an image based on a prompt.",
    longDescription: "Imagine an image based on a prompt and optional parameters.",
    category: "fun",
    guide: "{p}imagine prompt --m modelIndex --r ratioIndex --cfg cfgIndex"
  },
  onStart: async function ({ message, args, api, event }) {
    api.setMessageReaction("🖌️", event.messageID, (err) => {}, true);
    try {
      let prompt = "";
      let modelIndex = 2;
      let ratioIndex = 0;
      let cfgIndex = 6;

      const modelArgIndex = args.indexOf("--m");
      const ratioArgIndex = args.indexOf("--r");
      const cfgArgIndex = args.indexOf("--cfg");

      if (modelArgIndex !== -1) {
        modelIndex = parseInt(args[modelArgIndex + 1], 10);
      }

      if (ratioArgIndex !== -1) {
        ratioIndex = parseInt(args[ratioArgIndex + 1], 10);
      }

      if (cfgArgIndex !== -1) {
       cfgIndex = parseInt(args[cfgArgIndex + 1], 10);
      }
 
     prompt = args.slice(0, Math.min(
        modelArgIndex === -1 ? args.length : modelArgIndex,
        ratioArgIndex === -1 ? args.length : ratioArgIndex,
        cfgArgIndex === -1 ? args.length : cfgArgIndex
      )).join(" ").trim();

      if (!prompt) {
        return message.reply("❌ | Vous devez fournir un prompt\n\n 𝐒𝐚𝐢𝐬𝐢𝐬𝐬𝐞𝐳 [𝗜𝗺𝗮𝗴𝗶𝗻𝗲 𝗚𝘂𝗶𝗱𝗲] 𝐩𝐨𝐮𝐫 𝐦𝐢𝐞𝐮𝐱 𝐜𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐞 𝐥𝐚 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞.");
      }

      if (isNaN(modelIndex) || modelIndex < 0 ||modelIndex > 65) {
        return message.reply("❌ | 𝐍𝐮𝐦𝐞𝐫𝐨 𝐝𝐞 𝐦𝐨𝐝𝐞𝐥 𝐢𝐧𝐯𝐚𝐥𝐢𝐝𝐞!");
      }
   if (prompt.toLowerCase() === "guide") { const usim = "◉ 𝐆𝐔𝐈𝐃𝐄 𝐏𝐑𝐎𝐃𝐈𝐀 :\n\n𝗜𝗺𝗮𝗴𝗶𝗻𝗲 𝘱𝘳𝘰𝘮𝘱𝘵 --𝗺  𝘮𝘰𝘥𝘦𝘭(𝟬-𝟲4) --𝗿 𝘳𝘢𝘵𝘪𝘰 (𝟬-𝟮) \n\n ◉𝐑𝐚𝐭𝐢𝐨 𝐃𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞 :\n\n𝘗𝘰𝘳𝘵𝘳𝘢𝘪𝘵  ➨ 𝟬\n𝘓𝘢𝘯𝘥𝘴𝘤𝘢𝘱𝘦  ➨ 𝟮\n 𝘚𝘲𝘶𝘢𝘳𝘦  ➨ 𝟭\n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Imagine un chien en robe sur la lune --m 4 --r 2 \n\n◉ 𝐏𝐨𝐮𝐫 𝐯𝐨𝐢𝐫 𝐥𝐞𝐬 𝐦𝐨𝐝𝐞𝐥𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐛𝐥𝐞 : \n [𝗜𝗺𝗮𝗴𝗶𝗻𝗲 𝗠𝗼𝗱𝗲𝗹]\n";
   return api.sendMessage(usim, event.threadID, event.messageID);
        }                                         
        if (prompt.toLowerCase() === "model") {

            const modelList = "◉ 𝐌𝐎𝐃𝐄𝐋𝐒 𝐏𝐑𝐎𝐃𝐈𝐀 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 ◉\n\n0 | 3Guofeng3\n1 | Absolutereality_V16\n2 | Absolutereality_v181\n3 | AmIReal_V41\n4 | Analog-diffusion-1.0\n5 | Anythingv3_0-pruned\n6 | Anything-v4.5-pruned\n7 | AnythingV5_PrtRE\n8 | AOM3A3_orangemixs\n9 | Blazing_drive_v10g\n10 | Breakdomain_I2428\n11 | Breakdomain_M2150\n12 | CetusMix_Version35\n13 | ChildrensStories_v13D\n14 | ChildrensStories_v1SemiReal\n15 | ChildrensStories_v1ToonAnime\n16 | Counterfeit_v30\n17 | Cuteyukimixadorable\n18 | Cyberrealistic_v33\n19 | Dalcefo_v4\n20 | Deliberate_v2\n21 | Deliberate_v3\n22 | Dreamlike-anime-1.0\n23 | Dreamlike-diffusion-1.0\n24 | Dreamlike-photoreal-2.0\n25 | Dreamshaper_6BakedVae\n26 | Dreamshaper_7\n27 | Dreamshaper_8\n28 | Edgeofrealism_eorV20\n29 | Eimisanimediffusion_v1\n30 | Elldreths-vivid-mix\n31 | Epicphotogasm_xplusplus\n32 | Epicrealism_naturalsinrc1vae\n33 | Epicrealism_pureevolutionv3\n34 | Icantbelieveit\n35 | Indigofurrymix_v75hybrid\n36 | Juggernaut_aftermath\n37 | Lofi_v4\n38 | Lyriel_v16\n39 | Majicmixrealistic_v4\n40 | Mechamix_v10\n41 | Meinamix_meinav9\n42 | Meinamix_meinav11\n43 | Neverendingdream_v122\n44 | Openjourney_v4\n45 | Pastelmixstylize\n46 | Portraitplus_v1.0\n47 | Protogenx34\n48 | Realistic_vision_v1.4\n49 | Realistic_vision_v2.0\n50 | Realistic_vision_v4.0\n51 | Realistic_vision_v5.0\n52 | Redshift_diffusion-v10\n53 | Revanimated_v122\n54 | Rundiffusionfx25d_v10\n55 | Rundiffusionfx_v10\n56 | Sdv1_4\n57 | V1-5-pruned-emaonly\n58 | V1-5-inpainting\n59 | Shoninsbeautiful_v10\n60 | Theallys-mix-ii-churned\n61 | Timeless-1.0\n62 | Toonyou_beta6\n63 | Realistic_Vision_V5.1\n64 | Aniverse_v30";

            return api.sendMessage(modelList, event.threadID, event.messageID);

        }
      if (isNaN(ratioIndex) || ratioIndex < 0 || ratioIndex > 3) {
        return message.reply("❌ | 𝐍𝐮𝐦𝐞𝐫𝐨 𝐝𝐞 𝐫𝐚𝐭𝐢𝐨 𝐢𝐧𝐯𝐚𝐥𝐢𝐝𝐞!");
      }

      if (isNaN(cfgIndex) || cfgIndex < 0 || cfgIndex > 9) {
        return message.reply("❌ | 𝐍𝐮𝐦𝐞𝐫𝐨 𝐂𝐟𝐠 𝐢𝐧𝐯𝐚𝐥𝐢𝐝𝐞!");
      }

      const apiUrl = `https://zetprodia-u12r.onrender.com/generate?prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&ratioIndex=${ratioIndex}&cfgIndex=${cfgIndex}`;

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
        message.reply("❌ | Failed to generate image.");
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | Failed to generate image.");
    }
  }
};

const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "art",
    aliases: [],
    author: "Zetssu",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Generate an image based on a prompt and an initial image.",
    longDescription: "Generates an image based on a prompt, an initial image URL, and optional parameters.",
    category: "fun",
    guide: "{p}art imageUrl prompt --model modelIndex"
  },
  onStart: async function ({ message, args, api, event }) {
    try {
      let imageUrl = "";
      let prompt = "same picture";
      let modelIndex = 62; // Default model index
      let width = 1024; // Default width
      let height = 1024; // Default height

      if (args.length > 0) {
        prompt = args.join(" ");
         const modelArgIndex = args.indexOf("--model");

      if (modelArgIndex !== -1) {
        modelIndex = parseInt(args[modelArgIndex + 1], 10);
      }
   }
 
if (prompt.toLowerCase() === "guide") { 
        const usim = "◉ 𝐆𝐔𝐈𝐃𝐄 𝐀𝐑𝐓 :\n\n (En réponse à une image) 𝘼𝙧𝙩 𝘱𝘳𝘰𝘮𝘱𝘵 --model (0-64)\n\n◉ 𝐏𝐨𝐮𝐫 𝐯𝐨𝐢𝐫 𝐥𝐞𝐬 𝐦𝐨𝐝𝐞𝐥𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐛𝐥𝐞 : \n [𝘼𝙧𝙩 𝙢𝙤𝙙𝙚𝙡]";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }                                   
        
      if (prompt.toLowerCase() === "model") {
        const modelList = "◉ 𝐌𝐎𝐃𝐄𝐋𝐒 𝐀𝐑𝐓 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 ◉\n\n0 | 3Guofeng3\n1 | Absolutereality_V16\n2 | Absolutereality_v181\n3 | AmIReal_V41\n4 | Analog-diffusion-1.0\n5 | Anythingv3_0-pruned\n6 | Anything-v4.5-pruned\n7 | AnythingV5_PrtRE\n8 | AOM3A3_orangemixs\n9 | Blazing_drive_v10g\n10 | Breakdomain_I2428\n11 | Breakdomain_M2150\n12 | CetusMix_Version35\n13 | ChildrensStories_v13D\n14 | ChildrensStories_v1SemiReal\n15 | ChildrensStories_v1ToonAnime\n16 | Counterfeit_v30\n17 | Cuteyukimixadorable\n18 | Cyberrealistic_v33\n19 | Dalcefo_v4\n20 | Deliberate_v2\n21 | Deliberate_v3\n22 | Dreamlike-anime-1.0\n23 | Dreamlike-diffusion-1.0\n24 | Dreamlike-photoreal-2.0\n25 | Dreamshaper_6BakedVae\n26 | Dreamshaper_7\n27 | Dreamshaper_8\n28 | Edgeofrealism_eorV20\n29 | Eimisanimediffusion_v1\n30 | Elldreths-vivid-mix\n31 | Epicphotogasm_xplusplus\n32 | Epicrealism_naturalsinrc1vae\n33 | Epicrealism_pureevolutionv3\n34 | Icantbelieveit\n35 | Indigofurrymix_v75hybrid\n36 | Juggernaut_aftermath\n37 | Lofi_v4\n38 | Lyriel_v16\n39 | Majicmixrealistic_v4\n40 | Mechamix_v10\n41 | Meinamix_meinav9\n42 | Meinamix_meinav11\n43 | Neverendingdream_v122\n44 | Openjourney_v4\n45 | Pastelmixstylize\n46 | Portraitplus_v1.0\n47 | Protogenx34\n48 | Realistic_vision_v1.4\n49 | Realistic_vision_v2.0\n50 | Realistic_vision_v4.0\n51 | Realistic_vision_v5.0\n52 | Redshift_diffusion-v10\n53 | Revanimated_v122\n54 | Rundiffusionfx25d_v10\n55 | Rundiffusionfx_v10\n56 | Sdv1_4\n57 | V1-5-pruned-emaonly\n58 | V1-5-inpainting\n59 | Shoninsbeautiful_v10\n60 | Theallys-mix-ii-churned\n61 | Timeless-1.0\n62 | Toonyou_beta6\n63 | Realistic_Vision_V5.1\n64 | Aniverse_v30";
        return api.sendMessage(modelList, event.threadID, event.messageID);
      }

     if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
        if (["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
          api.setMessageReaction('🖌️', event.messageID, () => {}, true);
          imageUrl = event.messageReply.attachments[0].url;
          width = event.messageReply.attachments[0].width;
          height = event.messageReply.attachments[0].height;

          // Check if width or height exceeds 1024px
          if (width > 1024 || height > 1024) {
            const aspectRatio = width / height;
            if (width > height) {
              width = 1024;
              height = Math.floor(1024 / aspectRatio);
            } else {
              height = 1024;
              width = Math.floor(1024 * aspectRatio);
            }
          }
        } else {
          return api.sendMessage({ body: "❌ | Vous devez répondre à une image\n\n𝐒𝐚𝐢𝐬𝐢𝐬𝐬𝐞𝐳 [𝗔𝗿𝘁 𝗴𝘂𝗶𝗱𝗲] 𝐩𝐨𝐮𝐫 𝐦𝐢𝐞𝐮𝐱 𝐜𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐞 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞." }, event.threadID);
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        imageUrl = args[0];
        // Since image is from URL, dimensions are assumed to be default (1024x1024)
      } else {
        return api.sendMessage({ body: "❌ | Vous devez répondre à une image\n\n𝐒𝐚𝐢𝐬𝐢𝐬𝐬𝐞𝐳 [𝗔𝗿𝘁 𝗴𝘂𝗶𝗱𝗲] 𝐩𝐨𝐮𝐫 𝐦𝐢𝐞𝐮𝐱 𝐜𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐞 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞." }, event.threadID);
      }

      if (isNaN(modelIndex) || modelIndex < 0 || modelIndex >= 65) { // Assuming there are 62 models
        return message.reply("❌ | Numéro de modèle Invalide !");
      }

      const apiUrl = `https://zetart-fiiy.onrender.com/generate?imageUrl=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&width=${width}&height=${height}`;

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

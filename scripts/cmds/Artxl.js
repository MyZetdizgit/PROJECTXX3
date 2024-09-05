module.exports = {
  config: {
    name: "artxl",
    version: "1.0",
    author: "Zetsu",
    description: "Transform images",
    usage: "Transform images provided as attachments.",
    category: "Image-Edit",
    cooldowns: 2,
  },

  onStart: async function ({ api, event, args }) {
    try {
      const axios = require("axios");
      const fs = require("fs");
      const path = require("path");

      let imageUrl;
      let prompt = "same picture";
      let modelIndex = 0;

      // Parsing command arguments
      if (args.length > 0) {
        prompt = args.join(" ");
        if (args.includes("|")) {
          const index = args.indexOf("|");
          prompt = args.slice(0, index).join(" ").trim();
          modelIndex = parseInt(args[index + 1].trim(), 10);
        }
      }

      let width, height;

      if (prompt.toLowerCase() === "guide") {
        const usim = "◉ 𝐆𝐔𝐈𝐃𝐄 𝐀𝐑𝐓𝐗𝐋 :\n\n (En réponse à une image) 𝘼𝙧𝙩𝙭𝙡 𝘱𝘳𝘰𝘮𝘱𝘵 | 𝘮𝘰𝘥𝘦𝘭(𝟬-9)\n\◉ 𝐏𝐨𝐮𝐫 𝐯𝐨𝐢𝐫 𝐥𝐞𝐬 𝐦𝐨𝐝𝐞𝐥𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞𝐬 : \n [𝘼𝙧𝙩𝙭𝙡 𝙢𝙤𝙙𝙚𝙡]";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "model") {
        const modelList = "◉ 𝐌𝐎𝐃𝐄𝐋𝐒 𝐀𝐑𝐓𝐗𝐋 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 ◉\n\n 0 | AnimagineXLV3\n1 | RealvisxlV40\n2 | DreamshaperXL10\n3 | DynavisionXL\n4 | JuggernautXL\n5 | RealismEngineSDXL\n6 | Sd_xl_base\n7 | Sd_xl_base_1.0_inpainting\n8 | TurbovisionXL\n9 | Devlish Photorealism V1.5";
        return api.sendMessage(modelList, event.threadID, event.messageID);
      }

      if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
        if (["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
          api.setMessageReaction('🖌️', event.messageID, () => {}, true);
          imageUrl = event.messageReply.attachments[0].url;
          width = event.messageReply.attachments[0].width;
          height = event.messageReply.attachments[0].height;

          // Adjust width and height if they are outside the acceptable range
          const aspectRatio = width / height;
          if (width > 1536 || height > 1536) {
            if (width > height) {
              width = 1536;
              height = Math.floor(1536 / aspectRatio);
            } else {
              height = 1536;
              width = Math.floor(1536 * aspectRatio);
            }
          } else if (width < 512 || height < 512) {
            if (width < height) {
              width = 512;
              height = Math.floor(512 / aspectRatio);
            } else {
              height = 512;
              width = Math.floor(512 * aspectRatio);
            }
          }
        } else {
          return api.sendMessage({ body: "❌ | Vous devez répondre à une image\n\n𝐒𝐚𝐢𝐬𝐢𝐬𝐬𝐞𝐳 [𝗔𝗿𝘁𝘅𝗹 𝗴𝘂𝗶𝗱𝗲] 𝐩𝐨𝐮𝐫 𝐦𝐢𝐞𝐮𝐱 𝐜𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐞 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞." }, event.threadID);
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        imageUrl = args[0];
      } else {
        return api.sendMessage({ body: "❌ | Vous devez répondre à une image\n\n𝐒𝐚𝐢𝐬𝐢𝐬𝐬𝐞𝐳 [𝗔𝗿𝘁𝘅𝗹 𝗴𝘂𝗶𝗱𝗲] 𝐩𝐨𝐮𝐫 𝐦𝐢𝐞𝐮𝐱 𝐜𝐨𝐦𝐩𝐫𝐞𝐧𝐝𝐫𝐞 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞." }, event.threadID);
      }

      // Create the API URL using adjusted width and height
      const apiUrl = `https://zet4k.onrender.com/generate?imageUrl=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&width=${width}&height=${height}`;

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
        return api.sendMessage({
          body: "𝗩𝗼𝘁𝗿𝗲 𝗶𝗺𝗮𝗴𝗲 𝗲𝘀𝘁 𝗽𝗿𝗲𝘁𝗲 ! ⭐",
          attachment: stream
        }, event.threadID, event.messageID);
      });

      writer.on("error", (err) => {
        console.error("Stream error:", err);
        api.sendMessage("❌ | Failed to generate image.", event.threadID, event.messageID);
      });
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ | An error occurred while running the command.", event.threadID, event.messageID);
    }
  }
};

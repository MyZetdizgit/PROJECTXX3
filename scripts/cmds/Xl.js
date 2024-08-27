const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xl",
    version: "1.0",
    credits: "Zetsu",
    cooldowns: 5,
    hasPermissions: 0,
    description: "Generate unique images using AnimagineXL-3.1 model",
    category: "ai",
    guide: "{pn} <prompt> [-r <ratio>] [-s <styleIndex>] [-c <cfgScale>] [-st <steps>]"
  },

  onStart: async function ({ api, args, event, message }) {
    try {
      let prompt = '';
      let ratio = '4:7';
      let styleIndex = 0;
      let cfgScale;
      let steps;

      for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
          case '-r':
            ratio = args[i + 1];
            i++;
            break;
          case '-s':
            styleIndex = parseInt(args[i + 1], 10);
            if (isNaN(styleIndex)) {
              api.sendMessage("Invalid style index specified. Using default style 0.", event.threadID, event.messageID);
              styleIndex = 0;
            }
            i++;
            break;
          case '-c':
            cfgScale = parseFloat(args[i + 1]);
            if (isNaN(cfgScale)) {
              api.sendMessage("Invalid cfg scale specified. Using default value.", event.threadID, event.messageID);
              cfgScale = undefined;
            }
            i++;
            break;
          case '-st':
            steps = parseInt(args[i + 1], 10);
            if (isNaN(steps)) {
              api.sendMessage("Invalid steps specified. Using default value.", event.threadID, event.messageID);
              steps = undefined;
            }
            i++;
            break;
          default:
            prompt += args[i] + ' ';
            break;
        }
      }

      prompt = prompt.trim();

      if (!prompt) {
        const guideMessage = "𝐆𝐔𝐈𝐃𝐄 𝐗𝐋 :\n\n 𝙓𝙡 𝘱𝘳𝘰𝘮𝘱𝘵 -𝙧 𝘳𝘢𝘵𝘪𝘰 -𝙨 𝘴𝘵𝘺𝘭𝘦 -𝙘 𝘤𝘧𝘨𝘚𝘤𝘢𝘭𝘦 -𝙨𝙩 𝘴𝘵𝘦𝘱𝘴\n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Xl un chat surfant sur un tsunami -r 9:16 -s 3 -c 7 -st 28";
        return api.sendMessage(guideMessage, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "ratio") {
        const usim = "◉ 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍𝐒 𝐗𝐋◉ \n\n16:9 \n9:16\n7:4 \n4:7\n1:1\n7:9 \n9:7\n19:13\n13:19\n12:5\n5:12";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "style") {
        const styleGuide = "◉ 𝐒𝐓𝐘𝐋𝐄𝐒 𝐗𝐋 ◉ \n\n1: Photographique\n2: Cinématographique\n3: Artwork d'anime\n4: Style manga\n5: Art conceptuel\n6: Pixel Art\n7: Fantaisie éthérée\n8: Style néonpunk\n9: Modèle 3D";
        return api.sendMessage(styleGuide, event.threadID, event.messageID);
      }

      await api.sendMessage('Please Wait...⏳', event.threadID);

      const apiUrl = `https://zetxl-6tnc.onrender.com/generate-image?prompt=${encodeURIComponent(prompt)}&styleIndex=${styleIndex}&ratio=${encodeURIComponent(ratio)}&cfgScale=${cfgScale}&steps=${steps}`;

      const response = await axios.get(apiUrl, { responseType: 'stream' });

      const imagePath = path.join(__dirname, 'cache', 'generated_image.png');
      const imageStream = response.data;
      const fileStream = fs.createWriteStream(imagePath);

      if (!fs.existsSync(path.dirname(imagePath))) {
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      }

      imageStream.pipe(fileStream);

      fileStream.on('finish', () => {
        api.sendMessage({
          attachment: fs.createReadStream(imagePath)
        }, event.threadID);
      });

      fileStream.on('error', (err) => {
        console.error("Stream error:", err);
        api.sendMessage("❌ | Failed to generate image.", event.threadID, event.messageID);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | An error occurred while running the command.", event.threadID, event.messageID);
    }
  }
};

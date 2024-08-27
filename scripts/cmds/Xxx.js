const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xx",
    version: "1.0",
    credits: "Zetsu",
    cooldowns: 5,
    hasPermissions: 0,
    description: "Generate unique images using a specified model",
    category: "ai",
    guide: "{pn} <prompt> [-r <ratio>] [-m <modelIndex>]"
  },

  onStart: async function ({ api, args, event, message }) {
    try {
      const aspectRatioMap = {
        '1:1': { width: 1024, height: 1024 },
        '9:7': { width: 1024, height: 798 },
        '7:9': { width: 798, height: 1024 },
        '19:13': { width: 1024, height: 700 },
        '13:19': { width: 700, height: 1024 },
        '7:4': { width: 1024, height: 585 },
        '4:7': { width: 585, height: 1024 },
        '12:5': { width: 1024, height: 426 },
        '5:12': { width: 426, height: 1024 },
        '16:9': { width: 1024, height: 576 },
        '9:16': { width: 576, height: 1024 }
      };

      let prompt = '';
      let width = 585;
      let height = 1024;
      let modelIndex = 1;

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-r') {
          const ratio = args[i + 1];
          const aspectRatio = aspectRatioMap[ratio];
          if (aspectRatio) {
            width = aspectRatio.width;
            height = aspectRatio.height;
            i++;
          } else {
            api.sendMessage("Invalid ratio specified. Using default ratio 1:1.", event.threadID, event.messageID);
          }
        } else if (args[i] === '-m') {
          modelIndex = parseInt(args[i + 1], 10);
          if (isNaN(modelIndex)) {
            api.sendMessage("Invalid model index specified. Using default model 1.", event.threadID, event.messageID);
            modelIndex = 1;
          }
          i++;
        } else {
          prompt += args[i] + ' ';
        }
      }
      prompt = prompt.trim();

      if (!prompt) {
        const guideMessage = "𝐆𝐔𝐈𝐃𝐄 𝐗𝐗 :\n\n 𝙓𝙡 𝘱𝘳𝘰𝘮𝘱𝘵 -𝙧 𝘳𝘢𝘵𝘪𝘰 -𝙢 𝘮𝘰𝘥𝘦𝘭\n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Xl un chat surfant sur un tsunami -r 9:16 -m 2\n\n 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐫𝐚𝐭𝐢𝐨 : \n[𝙓𝙡 𝙧𝙖𝙩𝙞𝙤]";
        return api.sendMessage(guideMessage, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "ratio") {
        const usim = "◉ 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍𝐒 𝐗𝐗◉ \n\n16:9 \n9:16\n7:4 \n4:7\n1:1\n7:9 \n9:7\n19:13\n13:19\n12:5\n5:12";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "model") {
        const modelGuide = "◉ 𝐌𝐎𝐃𝐄𝐋𝐄𝐒 𝐗𝐗 ◉ \n\n1: AnimagineXL-31\n2: DreamModel";
        return api.sendMessage(modelGuide, event.threadID, event.messageID);
      }

      await api.sendMessage('Please Wait...⏳', event.threadID);

      const apiUrl = `https://zetsd-53sv.onrender.com/generate-image?prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&sampler=Euler%20a&width=${width}&height=${height}`;

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

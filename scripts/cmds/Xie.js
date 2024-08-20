const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xi",
    version: "1.1",
    credits: "Zetsu",
    cooldowns: 5,
    hasPermissions: 0,
    description: "Generate unique images using different models",
    category: "ai",
    guide: "{pn} <prompt> [-r <ratio>] [-s <styleIndex>] [-c <cfgScale>] [-st <steps>] [-key <API Key Index>] [-m <modelIndex>]"
  },

  onStart: async function ({ api, args, event, message }) {
    try {
      let prompt = '';
      let ratio = '4:7';
      let styleIndex = 0;
      let cfgScale;
      let steps;
      let key = 2;
      let modelIndex = 1; // Default model

      for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
          case '-m':
            modelIndex = args[i + 1];
            i++;
            break;
          // Ajouter les autres cas ici
          case '-key':
            key = args[i + 1];
            i++;
            break;
          default:
            prompt += args[i] + ' ';
            break;
        }
      }

      prompt = prompt.trim();

      await api.sendMessage('Please Wait...⏳', event.threadID);

      const apiUrl = `https://zetxi.onrender.com/generate-image?prompt=${encodeURIComponent(prompt)}&styleIndex=${styleIndex}&ratio=${encodeURIComponent(ratio)}&cfgScale=${cfgScale}&steps=${steps}&key=${key}&modelIndex=${modelIndex}`;

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

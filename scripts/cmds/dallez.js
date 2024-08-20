const axios = require("axios");
const fs = require("fs");
const path = require("path");


const apiKeyList = {
    "keys": [
      "baff032d-2826-4ae2-9638-6117b74eb014",
      "ab2381f1-9caf-4a04-818c-cb3fb97856e4",
      "98f1a999-9e59-4bcf-a179-4d3ea596ef54",
      "1ba63675-e8fe-44a2-8556-19244ad0a4a0",
      "3b876900-c9df-42c7-9918-3675a79f18fd",
      "b2510680-31ae-4c72-aa21-e45832c56442",
      "e608879b-1a4c-48ab-8529-25d0edc38832",
      "45ce79b5-a2f3-4a95-95fb-6eaadd054648",
      "f086db4a-587c-4ad0-b632-7ea88ba26236",
      "6cf73a9d-a539-427f-919f-533a820e99bf",
      "2fe364a7-91e8-473a-ad12-5761ddc41e00",
      "7f5aceb1-9717-47b3-8581-e4b1a8fc3893",
      "8dd5e241-afb0-404e-90e1-310ddf1390f8",
      "f79f21f9-5654-4614-a21f-fdbfd1c1bd16",
      "185305d0-747d-43c5-9945-f84a5e6f0567",
      "50a804c7-4ece-49ee-a781-07e25c8da8aa",
      "25a427b3-8177-4f32-a16b-9408a45996bd",
      "132ea0c0-3164-4c7d-97ae-010e20b016ed",
      "edc71467-d5a8-4ed4-ae53-549d3cfc1d1a",
      "749074fc-3e93-4eb6-9ceb-9f515d4c0501",
      "892efb9c-9b89-4cc4-875c-553c9989b7b8",
      "c93eb2ce-e7cb-4710-829b-14529f1671c7",
      "c7d24818-cb03-448a-8c09-d13d65297cc5",
      "d27d9740-3af4-4854-b9a1-905f772f2569",
      "2cac85c0-439b-423e-910e-929adbe71f50",
      "08f8d361-717c-4f4e-af9e-cc404973ea67",
      "9520d4fd-c4ed-48aa-858a-77aca99e558d",
      "076dc5e3-81e3-4601-b5c6-eba9ed7af7a6",
      "239158a8-a5ba-49e6-8cf6-2712202b91a3",
      "8faea797-56aa-479b-8985-6dec77a1e4f6",
      "9fbce339-6ead-4d27-b3f5-9d87dc00c09f"
    ]
  };

let currentKeyIndex = 0;
function getNextKey() {
  if (currentKeyIndex >= apiKeyList.keys.length) {
    currentKeyIndex = 0;
  }
  const nextKey = apiKeyList.keys[currentKeyIndex];
  currentKeyIndex++;
  return nextKey;
}

module.exports = {
  config: {
    name: "dallez",
    version: "1.0",
    author: "rehat--",
    countdown: 5,
    role: 0,
    longDescription: "Generate unique and captivating images using DALL-E 3",
    category: "ai",
    guide: { 
      en: "{pn} <prompt> --ar 16:9" 
    }
  },

  onStart: async function ({ args, event, message }) {
    try {
      const prompt = args.join(' ');
      if (!prompt) {
        message.reply("Please provide a prompt.");
        return;
      }
  
      let apiKey = getNextKey();
      await message.reply('Please Wait...⏳');
      let response;
      let success = false;
      
      while (!success && apiKey) {
        try {
          response = await axios.post('https://api.visioncraft.top/dalle', {
            prompt: prompt,
            token: apiKey
          }, {
            responseType: 'stream'
          });
          
          success = true;
        } catch (error) {
          if (error.response && error.response.status === 403) {
            console.log("Retrying Generation...");
            apiKey = getNextKey();
          } else {
            throw new Error(error.message);
          }
        }
      }
      
      if (success) {
        const imagePath = path.join(__dirname, 'cache', 'dallez.png');
        const imageStream = response.data;
        const fileStream = fs.createWriteStream(imagePath);

        if (!fs.existsSync(path.dirname(imagePath))) {
          fs.mkdirSync(path.dirname(imagePath), { recursive: true });
        }
  
        imageStream.pipe(fileStream);
  
        fileStream.on('finish', () => {
          message.reply({
            attachment: fs.createReadStream(imagePath)
          });
        });
      } else {
        await message.reply('An error occurred.');
      }
    } catch (error) {
      console.error(error);
      await message.reply('An error occurred.');
    }
  }  
};

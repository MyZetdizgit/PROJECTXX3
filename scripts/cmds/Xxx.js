const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xx",
    version: "2.0",
    credits: "Zetsu",
    cooldowns: 5,
    hasPermissions: 0,
    description: "Generate unique images using a specified model",
    category: "ai",
    guide: "{pn} <prompt> [-r <ratio>] [-m <modelIndex>] [-st <steps>] [-c <cfg_scale>] [-l <lora:weight>]"
  },

  onStart: async function ({ api, args, event, message }) {
    try {
      let prompt = '';
      let ratio = '13:19';
      let modelIndex = 1;
      let steps;
      let cfg_scale;
      let loraWeights = {};

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-r') {
          ratio = args[i + 1];
          i++;
        } else if (args[i] === '-m') {
          modelIndex = parseInt(args[i + 1], 10);
          i++;
        } else if (args[i] === '-st') {
          steps = parseInt(args[i + 1], 10);
          i++;
        } else if (args[i] === '-c') {
          cfg_scale = parseInt(args[i + 1], 10);
          i++;
        } else if (args[i] === '-l') {
          const loraEntries = args[i + 1].split(',');
          loraEntries.forEach((entry, index) => {
            const [num, weight] = entry.split(':');
            loraWeights[num.trim()] = weight ? weight.trim() : (loraEntries.length - index).toString();
          });
          i++;
        } else {
          prompt += args[i] + ' ';
        }
      }
      prompt = prompt.trim();

      if (!prompt) {
        const guideMessage = "𝐆𝐔𝐈𝐃𝐄 𝐗𝐗 :\n\n 𝙓𝙭 𝘱𝘳𝘰𝘮𝘱𝘵 -𝙧 𝘳𝘢𝘵𝘪𝘰 -𝙢 𝘮𝘰𝘥𝘦𝘭 -𝙨𝙩 𝙨𝙩𝙚𝙥𝙴 -𝙡 𝘭𝘰𝘳𝘢𝘴 -𝙘 𝘤𝘧𝘨_𝘴𝘤𝘢𝘭𝘦\n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Xx un chat surfant sur un tsunami -r 4:7 -m 2 -st 30 -l 4,1 -c 7\n\n 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐫𝐚𝐭𝐢𝐨 : \n[𝙓𝙭 𝙧𝙖𝙩𝙞𝘰]\n\n 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐦𝐨𝐝𝐞𝐥𝐬 : \n[𝙓𝙭 𝙢𝙤𝘥𝙚𝙡]\n\n Pour les LoRA : \n[𝙓𝙭 𝙡𝘰𝘳𝘢]";
        return api.sendMessage(guideMessage, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "ratio") {
        const usim = "◉ 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍𝐒 𝐗𝐗◉ \n\n✧ 𝟑:𝟐 \n✧ 𝟐:𝟑\n✧ 𝟕:𝟒 \n✧ 𝟒:𝟕\n✧ 𝟏:𝟏\n✧ 𝟕:𝟗 \n✧ 𝟗:𝟕\n✧ 𝟏𝟗:𝟏𝟑\n✧ 𝟏𝟑:𝟏𝟗\n✧ 𝟏𝟐:𝟓\n✧ 𝟓:𝟏𝟐";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "model") {
        const modelGuide = "◉ 𝐌𝐎𝐃𝐄𝐋𝐄𝐒 𝐗𝐗 ◉ \n\n✧ 𝐒𝐃𝐗𝐋 ✧ 𝟏: 𝐴𝑛𝑖𝑚𝑎𝑔𝑖𝑛𝑒 𝑋𝐿 - 3.1\n𝟐: 𝐴𝑛𝑖𝑚𝑎𝑔𝑖𝑛𝑒 𝑋𝐿 - 𝑉3\n𝟑: 4𝑡ℎ 𝑇𝑎𝑖𝑙 𝐴𝑛𝑖𝑚𝑒 𝐻𝑒𝑛𝑡𝑎𝑖 - 𝑣0.4.5\n𝟒: 𝐶𝐴𝑇 - 𝐶𝑖𝑡𝑟𝑜𝑛 𝐴𝑛𝑖𝑚𝑒 𝑇𝑟𝑒𝑎𝑠𝑢𝑟𝑒 - 𝑆𝐷𝑋𝐿\n𝟓: 𝐴𝐴𝑀 𝑋𝐿 𝐴𝑛𝑖𝑚𝑒 𝑀𝑖𝑥 - 𝑣1.0\n𝟔: 𝑁𝑈𝐾𝐸 - 𝐷𝑖𝑠𝑛𝑒𝑦 𝑃𝑖𝑥𝑎𝑟 𝑆𝑡𝑦𝑙𝑒 𝑆𝐷𝑋𝐿 - 𝑣1\n𝟕: 𝐶𝑜𝑚𝑖𝑐𝑠 𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠 𝐷𝑎𝑡𝑎𝑏𝑎𝑠𝑒 - 3𝐷\n\n✧ 𝐅𝐋𝐔𝐗 ✧\n𝟖: 𝐹𝐿𝑈𝑋 .1 - 𝑑𝑒𝑣 - 𝑓𝑝8\n𝟗: 𝐹𝑙𝑢𝑥 𝑈𝑛𝑐ℎ𝑎𝑖𝑛𝑒𝑑 𝐴𝑟𝑡𝑓𝑢𝑙 𝑁𝑆𝐹𝑊 𝑐𝑎𝑝𝑎𝑏𝑙𝑒 𝑓𝑙𝑢𝑥 .𝑑𝑡𝑢𝑛𝑒𝑑 - 𝑇5_8𝑥8 𝑉1.1\n𝟏𝟎: 𝐹𝐿𝑈𝑋 𝐻𝑦𝑝𝑒𝑟 𝑇𝑟𝑎𝑖𝑏𝑒𝑑 - 𝐷𝑟𝑒𝑎𝑚 𝐷𝑖𝑓𝑓𝑢𝑠𝑖𝑜𝑛- 𝑉1\n\n✧ 𝐒𝐃-𝟏.𝟓 ✧\n𝟏𝟏: 𝑆𝑢𝑑𝑎𝑐ℎ𝑖 - 𝑉1\n𝟏𝟐: 𝑂𝑥𝑎𝑙𝑖𝑠 𝐴𝑛𝑖𝑚𝑒 𝐻𝑒𝑛𝑡𝑎𝑖 𝑀𝑜𝑑𝑒𝑙 - 𝑂𝐴𝐻 - 1\n𝟏𝟑: 𝑃𝑒𝑟𝑓𝑒𝑐𝑡 𝑊𝑜𝑟𝑙𝑑 𝑉6 - 𝑉6\n𝟏𝟒: 𝐶ℎ𝑖𝑙𝑙𝑜𝑢𝑡 𝑀𝑖𝑥 - 𝑁𝑖\n𝟏𝟓: 𝐴𝑠𝑡𝑟 𝐴𝑛𝑖𝑚𝑒 - 6.0\n𝟏𝟔: 𝑀𝑒𝑖𝑛𝑎 𝐻𝑒𝑛𝑡𝑎𝑖 𝑣3 - 3\n𝟏𝟕: 3𝐷 𝐶𝑎𝑟𝑡𝑜𝑜𝑛 𝑉𝑖𝑠𝑖𝑜𝑛 - 𝑉1\n";
        return api.sendMessage(modelGuide, event.threadID, event.messageID);
      }

      if (prompt.toLowerCase() === "lora") {
        const loraGuide = "◉ 𝐋𝐎𝐑𝐀𝐒 𝐗𝐗 ◉\n\n✧ 𝐒𝐃𝐗𝐋 (𝟏-𝟑𝟎)\n1: Niji Anime Style XL\n2: Niji6 - v6 𝐒𝐒\n3: StylesPony XL - RAR Animagine 𝐒𝐒\n4: Kohaku Outline XL 𝐒𝐒\n5: Pony Retro Anime V2\n6: Anime Enhancer XL v5 𝐒𝐒\n7: Detailed Anime Style XL V01\n8: Niji Background XL v1 - Normal\n9: Niji5 v6\n10: Extremely Realistic Style XL LoRA V1.0\n\n✧ 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 𝐗𝐋 (𝟏𝟏-𝟐𝟒)\n11: Extra Detailer XL 𝐒𝐒\n12: Detail Tweaker XL 3.0\n13: Add More Details XL\n14: Add More Detail XL - Enhances Fine Tunes\n15: Detailer XL Ultra\n16: Enhance Facial Details SDXL\n17: Add More Details Colorful Enhancer XL\n18: Photo Enhancer XL 𝐒𝐒\n19: Shadow Correction XL v1.1 𝐒𝐒\n20: Body Weight Slider XL\n21: Skin Tone Slider XL V1\n22: Perfect Hands XL\n23: EpiC Anime Dream Hentai XL Perfect Fingers\n\n✧ 𝐍𝐬𝐟𝐰 𝐗𝐋 (𝟐𝟒-𝟑𝟎)\n24: Plunder Hentai Style XL 𝐒𝐒\n25: Naked Girls V1\n26: Cunnilingus XL 0.5\n27: Deep Penetration Concept Slider for Pony XL\n28: Labiaplasty Innie Pussy Adjuster v2.0 XL\n29: Motion Sex XL\n30: Breasts Slider XL\n\n✧ 𝐅𝐋𝐔𝐗 (𝟑𝟏-𝟑𝟗)\n31: Flux Anime Style TEST.VERSION\n32: Flux Comics Style T2\n33: Flux Fantasy Detailers V1.0\n34: Midjourney Whisper Flux LoRA\n35: XLabs Flux Realism LoRA v1.0\n36: Flux Realism Woman V2.0\n37: Flux Booba\n38: Flux Perfect Full Round Breasts Slim Waist Flux V2\n39: Flux Detailer TA v0.1\n\n✧ 𝐒𝐃-𝟏.𝟓 (𝟒𝟎-𝟓𝟖)\n40: Sexy Pose Style V5 Slider\n41: Real Hands XL v1.0\n42: Add More Details - Adds Elements Details V1.1\n43: Better Hands - HANDS\n44: Attractive Eyes SDXL Version\n45: Breasts with Pink Nipples 2.0\n46: Add More Realism V1.0\n47: Add More Details - Detail Enhancer Tweaker LoRA 𝐒𝐒\n48: Add Details Eyes Face Skin V1\n49: Missionary POV V1.0\n50: Oiled Skin SD 1.5 Pony PDXLV1\n51: Hands Repair LoRA V5 𝐒𝐒\n52: Huge Butt Huge Breasts V1\n53: Nude Woman V2\n54: Oxalis Hentai LoRA V1 𝐒𝐒\n55: Tentacles SD 1.5 V9.0\n56: Extremely Realistic Style LoRA V1.0\n57: Add Ultra Details V1\n58: Shinyoiledskin 2.0 LyCORIS LoRA 𝐒𝐒";
        return api.sendMessage(loraGuide, event.threadID, event.messageID);
      }

      // Create LoRA string
      let loraString = Object.entries(loraWeights)
        .map(([key, weight]) => `${key}:${weight}`)
        .join(',');

      await api.sendMessage('🖌️ 𝑃𝑙𝑠 𝑤𝑎𝑖𝑡...', event.threadID);

      const apiUrl = `https://zetsdq.onrender.com/generate-image?prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&sampler=Euler%20a&ratio=${ratio}${steps !== undefined ? `&steps=${steps}` : ''}${cfg_scale !== undefined ? `&cfg_scale=${cfg_scale}` : ''}${loraString ? `&loras=${encodeURIComponent(loraString)}` : ''}`;

      const response = await axios.get(apiUrl, { responseType: 'stream' });

      const imagePath = path.join(__dirname, 'cache', 'generated_image.png');
      const imageStream = response.data;
      const fileStream = fs.createWriteStream(imagePath);

      if (!fs.existsSync(path.dirname(imagePath))) {
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      }

      imageStream.pipe(fileStream);

      fileStream.on('finish', () => {
        message.reply({ body: '𝑉𝑜𝑖𝑐𝑖 𝑣𝑜𝑡𝑟𝑒 𝐼𝑚𝑎𝑔𝑒 ✨', attachment: fs.createReadStream(imagePath) });
      });

      fileStream.on('error', (err) => {
        console.error("Stream error:", err);
        res.status(500).send('Error generating image.');
      });
    } catch (error) {
      console.error(error);
      api.sendMessage('An error occurred. Please try again later.', event.threadID, event.messageID);
    }
  }
};

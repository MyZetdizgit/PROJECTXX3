const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "sdxl",
    version: "1.0.0",
    author: "Zetsu",
    description: "Text to image",
    category: "Image-Generate",
    usages: "[prompt] -r [ratio] -m [model]",
    guide: "{p}sdxl [prompt] -r [ratio] -m model [model]"
};

module.exports.onStart = async function({ api, event, args }) {
    let prompt;

    if (args.includes("-r")) {
        prompt = args.slice(0, args.indexOf("-r")).join(" ");
    } else if (args.includes("-m")) {
        prompt = args.slice(0, args.indexOf("-m")).join(" ");
    } else {
        prompt = args.join(" ");
    }

    if (!prompt) {
        const guideMessage = "𝐆𝐔𝐈𝐃𝐄 𝐒𝐃𝐗𝐋 :\n\n 𝙎𝘿𝙓𝙇 𝘱𝘳𝘰𝘮𝘱𝘵 -𝙢 𝘮𝘰𝘥𝘦𝘭(𝟬-9) -𝙧 𝘳𝘢𝘵𝘪𝘰 \n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Sdxl un chat surfant sur un tsunami -m 4 -r 9:16 \n\n◉ 𝐏𝐨𝐮𝐫 𝐯𝐨𝐢𝐫 𝐥𝐞𝐬 𝐦𝐨𝐝𝐞𝐥𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐛𝐥𝐞 : \n [𝙎𝘿𝙓𝙇 𝙢𝙤𝙙𝙚𝙡]\n\n ◉ 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐫𝐚𝐭𝐢𝐨 : \n[𝙎𝘿𝙓𝙇 𝙧𝙖𝙩𝙞𝙤]";
        return api.sendMessage(guideMessage, event.threadID, event.messageID);
    }

if (prompt.toLowerCase() === "ratio") {
        const usim = "◉ 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍𝐒 𝐒𝐃𝐗𝐋◉ \n\n16:9 - 1344x756\n9:16 - 756x1344\n4:3 - 1200x900\n3:2 - 1200x800\n3:4 - 900x1200\n1:1 - 1024x1024\n7:9 - 896x1152\n9:7 - 1152x896\n19:13 - 1216x832\n13:19 - 832x1216\n12:5 - 1500x625\n5:12 - 625x1500\n2:3 - 800x1200\n8:15 - 720x1350\n10:17 - 750x1275\n11:19 - 693x1197\n7:13 - 672x1302\n";
        return api.sendMessage(usim, event.threadID, event.messageID);
      }

if (prompt.toLowerCase() === "model") {

            const modelList = "◉ 𝐌𝐎𝐃𝐄𝐋𝐒 𝐒𝐃𝐗𝐋 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 ◉\n\n 0 | AnimagineXLV3\n1 | RealvisxlV40\n2 | DreamshaperXL10\n3 | DynavisionXL\n4 | JuggernautXL\n5 | RealismEngineSDXL\n6 | Sd_xl_base\n7 | Sd_xl_base_1.0_inpainting\n8 | TurbovisionXL\n9 | Devlish Photorealism V1.5";

            return api.sendMessage(modelList, event.threadID, event.messageID);

        }
    let modelIndex = 1; // Default model index
    if (args.includes("-m")) {
        const modelArgIndex = args.indexOf("-m") + 1;
        modelIndex = parseInt(args[modelArgIndex], 10);
        args.splice(args.indexOf("-m"), 2);
    }

    let ratio = "1:1"; // Default ratio
    if (args.includes("-r")) {
        const ratioArgIndex = args.indexOf("-r") + 1;
        ratio = args[ratioArgIndex];
        args.splice(args.indexOf("-r"), 2);
    }

    const apiUrl = `https://zetsdxl-o0x5.onrender.com/generate?prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&ratio=${ratio}`;

    api.sendMessage('🖌️ | Préparation de votre image...', event.threadID, event.messageID);

    try {
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
            api.sendMessage({ body: "Votre image est prête ! ⭐", attachment: stream }, event.threadID, event.messageID);
        });

        writer.on("error", (err) => {
            console.error("Stream error:", err);
            api.sendMessage("❌ | Failed to generate image.", event.threadID, event.messageID);
        });
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("❌ | Failed to generate image.", event.threadID, event.messageID);
    }
};

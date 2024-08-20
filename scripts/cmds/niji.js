const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "niji",
    version: "1.1.0",
    author: "Zetsu",
    description: "Text to image",
    category: "Image-Generate",
    usages: "[prompt] -r [ratio] -m [model] -s [style]",
    guide: "{p}niji [prompt] -r [ratio] -m [model] -s [style]"
};

module.exports.onStart = async function({ api, event, args }) {
    let prompt;

    if (args.includes("-r")) {
        prompt = args.slice(0, args.indexOf("-r")).join(" ");
    } else if (args.includes("-m")) {
        prompt = args.slice(0, args.indexOf("-m")).join(" ");
    } else if (args.includes("-s")) {
        prompt = args.slice(0, args.indexOf("-s")).join(" ");
    } else {
        prompt = args.join(" ");
    }

    if (!prompt) {
        const guideMessage = "𝐆𝐔𝐈𝐃𝐄 𝐍𝐈𝐉𝐈 :\n\n 𝙉𝙞𝙟𝙞 𝘱𝘳𝘰𝘮𝘱𝘵 -𝙧 𝘳𝘢𝘵𝘪𝘰 -𝙢 𝘮𝘰𝘥𝘦𝘭 -𝙨 𝘴𝘵𝘺𝘭𝘦\n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Niji un chat surfant sur un tsunami -r 9:16 -m 1 -s 3 \n\n 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐫𝐚𝐭𝐢𝐨 : \n[𝙉𝙞𝙟𝙞 𝙧𝙖𝙩𝙞𝙤]\n\n 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐒𝐭𝐲𝐥𝐞𝐬 : \n[𝙉𝙞𝙟𝙞 𝙨𝙩𝙮𝙡𝙚]";
        return api.sendMessage(guideMessage, event.threadID, event.messageID);
    }
    
    if (prompt.toLowerCase() === "ratio") {
        const usim = "◉ 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍𝐒 𝐍𝐈𝐉𝐈 ◉ \n\n16:9 - 1344x756\n9:16 - 756x1344\n4:3 - 1200x900\n3:2 - 1200x800\n3:4 - 900x1200\n1:1 - 1024x1024\n7:9 - 896x1152\n9:7 - 1152x896\n19:13 - 1216x832\n13:19 - 832x1216\n12:5 - 1500x625\n5:12 - 625x1500\n2:3 - 800x1200\n8:15 - 720x1350\n10:17 - 750x1275\n11:19 - 693x1197\n7:13 - 672x1302\n";
        return api.sendMessage(usim, event.threadID, event.messageID);
    }

    if (prompt.toLowerCase() === "style") {
        const styleGuide = "◉ 𝐒𝐓𝐘𝐋𝐄𝐒 𝐍𝐈𝐉𝐈 ◉ \n\n0: Photographique\n1: Cinématographique\n2: Artwork d'anime\n3: Style manga\n4: Art conceptuel\n5: Pixel Art\n6: Fantaisie éthérée\n7: Style néonpunk\n8: Modèle 3D";
        return api.sendMessage(styleGuide, event.threadID, event.messageID);
    }
    
    let modelIndex = 0; // Default model index
    if (args.includes("-m")) {
        const modelArgIndex = args.indexOf("-m") + 1;
        modelIndex = parseInt(args[modelArgIndex], 10);
        args.splice(args.indexOf("-m"), 2);
    }

    let ratio = "9:16"; // Default ratio
    if (args.includes("-r")) {
        const ratioArgIndex = args.indexOf("-r") + 1;
        ratio = args[ratioArgIndex];
        args.splice(args.indexOf("-r"), 2);
    }

    let styleIndex = 9; // Default style index
    if (args.includes("-s")) {
        const styleArgIndex = args.indexOf("-s") + 1;
        styleIndex = parseInt(args[styleArgIndex], 10);
        args.splice(args.indexOf("-s"), 2);
    }

    const apiUrl = `https://zetniji-dddd.onrender.com/generate?prompt=${encodeURIComponent(prompt)}&modelIndex=${modelIndex}&styleIndex=${styleIndex}&ratio=${ratio}`;

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

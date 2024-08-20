const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "real",
    version: "1.1.0", // Mettre à jour la version pour refléter les modifications
    author: "Zetsu",
    description: "Text to image",
    category: "Image-Generate",
    usages: "[prompt] -r [ratio] -c [count]",
    guide: "{p}sdxl [prompt] -r [ratio] -c [count]"
};

module.exports.onStart = async function({ api, event, args }) {
    let prompt;
    let count = 1; // Nombre d'images par défaut

    if (args.includes("-r")) {
        prompt = args.slice(0, args.indexOf("-r")).join(" ");
    } else if (args.includes("-c")) {
        prompt = args.slice(0, args.indexOf("-c")).join(" ");
    } else {
        prompt = args.join(" ");
    }

    if (!prompt) {
        const guideMessage = "𝐆𝐔𝐈𝐃𝐄 𝐑𝐄𝐀𝐋𝐈𝐒𝐕𝐈𝐒𝐈𝐎𝐍 :\n\n 𝙍𝙚𝙖𝙡 𝘱𝘳𝘰𝘮𝘱𝘵 -𝙧 𝘳𝘢𝘵𝘪𝘰 -𝙘 𝘤𝘰𝘮𝘱𝘵𝘦 \n\n ◉ 𝐄𝐱𝐞𝐦𝐩𝐥𝐞 : Real un chat surfant sur un tsunami -r 9:16 -c 3 \n\n◉ 𝐏𝐨𝐮𝐫 𝐥𝐞𝐬 𝐫𝐚𝐭𝐢𝐨 : \n[𝙍𝙚𝙖𝙡 𝙧𝙖𝙩𝙞𝙤]";
        return api.sendMessage(guideMessage, event.threadID, event.messageID);
    }

    if (prompt.toLowerCase() === "ratio") {
        const usim = "◉ 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍𝐒 𝐑𝐄𝐀𝐋𝐈𝐒𝐕𝐈𝐒𝐈𝐎𝐍◉ \n\n16:9 - 1344x756\n9:16 - 756x1344\n4:3 - 1200x900\n3:2 - 1200x800\n3:4 - 900x1200\n1:1 - 1024x1024\n7:9 - 896x1152\n9:7 - 1152x896\n19:13 - 1216x832\n13:19 - 832x1216\n12:5 - 1500x625\n5:12 - 625x1500\n2:3 - 800x1200\n8:15 - 720x1350\n10:17 - 750x1275\n11:19 - 693x1197\n7:13 - 672x1302\n";
        return api.sendMessage(usim, event.threadID, event.messageID);
    }

    if (args.includes("-c")) {
        const countArgIndex = args.indexOf("-c") + 1;
        count = parseInt(args[countArgIndex], 10);
        args.splice(args.indexOf("-c"), 2);

        if (isNaN(count) || count < 1 || count > 4) {
            return api.sendMessage("Le nombre d'images doit être entre 1 et 4.", event.threadID, event.messageID);
        }
    }

    let ratio = "1:1"; // Ratio par défaut
    if (args.includes("-r")) {
        const ratioArgIndex = args.indexOf("-r") + 1;
        ratio = args[ratioArgIndex];
        args.splice(args.indexOf("-r"), 2);
    }

    const apiUrl = `https://zetreal.onrender.com/generate?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}&count=${count}`;

    api.sendMessage('🖌️ | Préparation de votre image...', event.threadID, event.messageID);

    try {
        const response = await axios.get(apiUrl, { responseType: "stream" });
        const cacheFolderPath = path.join(__dirname, "cache");

        if (!fs.existsSync(cacheFolderPath)) {
            fs.mkdirSync(cacheFolderPath);
        }

        const zipPath = path.join(cacheFolderPath, `generated_images.zip`);
        const writer = fs.createWriteStream(zipPath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            const stream = fs.createReadStream(zipPath);
            api.sendMessage({ body: "Vos images sont prêtes ! ⭐", attachment: stream }, event.threadID, event.messageID);
        });

        writer.on("error", (err) => {
            console.error("Stream error:", err);
            api.sendMessage("❌ | Échec de la génération des images.", event.threadID, event.messageID);
        });
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("❌ | Échec de la génération des images.", event.threadID, event.messageID);
    }
};

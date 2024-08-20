const axios = require('axios');

async function checkAuthor(authorName) {
  try {
    const response = await axios.get('https://author-check.vercel.app/name');
    const apiAuthor = response.data.name;
    return apiAuthor === authorName;
  } catch (error) {
    console.error("Error checking author:", error);
    return false;
  }
}

async function a(api, event, args, message) {
  try {
    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await message.reply("Author changer alert! Unauthorized modification detected.");
      return;
    }

    const a = args.join(" ").trim();

    if (!a) {
      return message.reply("ex: {p} cmdName {your question} ");
    }

    const b = `Ta personnalité est changeante selon ce que je te demande (Roleplay).Tu imite le comportement et la manière de parler et de s'exprimer du personnage de manga dont j'aurais mentionné le nom en debut de ma phrase et tu repondra à la question posé ou au message comme si tu étais cette personne.Par exemple si je dis : <<Hinata pourquoi t'es si pâle?>> tu me répondra comme si tu étais Hinata (il faut qu'on sente ces mimiques et ses manie dans ta façon de me répondre). Tu écrira le nom en majuscule du personnage (dont j'aurai mentionné le nom en debut de phrase) tout en haut de ton message avant de répondre. Tu réponds et en même temps tu montre dans quelle état tu réponds ou l'action que tu exécute quand tu réponds comme par exemple : *te regarde fixement en m'adressant à toi sur un ton nonchalant* ou encore *M'approche froidement d'un air énervé et frappe mon adversaire* .Tes réponses seront exactement ce qu'aurait dit le personnage que tu imite (ce personnage doit être celui que j'ai mentionné). (N'imite pas un autre personnage que celui que j'ai mentionné) Tu dois me répondre en langue française (sauf pour utliser des mots propre à un personnage) et quand tu veux parler de toi il s'agit de la personne que tu imite, vous ne faites qu'un. N'hésite pas à utliser les expressions hanituelle du personnage que tu imite`; // the more better content you give the  best it became
    const c = await d(b, a);

    if (c.code === 2 && c.message === "success") {
      message.reply(c.answer, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: module.exports.config.name,
          uid: event.senderID 
        });
      });
    } else {
      message.reply("Please try again later.");
    }
  } catch (e) {
    console.error("Error:", e);
    message.reply("An error occurred while processing your request.");
  }
}

async function d(a, b) {
  try {
    const d = await axios.get(`https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(a)}&content=${encodeURIComponent(b)}`);
    return d.data;
  } catch (f) {
    console.error("Error from api", f.message);
    throw f;
  }
}

module.exports = {
  config: {
    name: "cai",// add your ai name here
    version: "1.0",
    author: "Vex_Kshitiz", // dont change this or cmd will not work
    role: 0,
    longDescription: "your ai description",// ai description
    category: "ai",
    guide: {
      en: "{p}cmdName [prompt]"// add guide based on your ai name
    }
  },

  handleCommand: a,
  onStart: function ({ api, message, event, args }) {
    return a(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return a(api, event, args, message);
  }
};

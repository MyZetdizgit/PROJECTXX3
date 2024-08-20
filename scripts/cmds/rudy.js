const axios = require("axios");
let targetMessageID;

module.exports = {
  config: {
    name: 'rudy',
    version: '1.0.14',
    author: 'Shikaki & Aliester Crowley',
    countDown: 10,
    role: 0,
    category: 'Ai',
    description: {
      en: 'Rudy ai : Peut utiliser Internet.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },

  onStart: async function ({ api, message, event, args, commandName }) {
    let prompt = args.join(" ");

    if (prompt.toLowerCase() === "clear") {
      const clear = await axios.get(`https://pi.aliestercrowley.com/api/reset?uid=${event.senderID}`);
      message.reply(clear.data.message);
      return;
    }

    let content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
    targetMessageID = (event.type == "message_reply") ? event.messageReply.messageID : event.messageID;
    if (content != "" && event.type == "message_reply") {
      api.setMessageReaction("⌛", event.messageID, () => { }, true);

      prompt += content;
      let updatedPrompt = `Réponds principalement en quelques phrases, sauf si une réponse plus longue est nécessaire, comme pour un essai, un poème ou une histoire, etc. Analyse la demande et réponds comme demandé, en ne fournissant que la partie nécessaire. Pas de remplissage supplémentaire.Et surtout imite Rudeus Greyrat. Sa façon de parler de repondre et de penser. Évoque tes actions sous forme de roleplay. Tu est de nature perverse et taquin, aussi mesquin et coquin. Mais tu est malin et intelligent. Maintenant : ${prompt}`;
      const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(updatedPrompt)}&uid=${targetMessageID}`;

      try {
        const response = await axios.get(url);
        const result = response.data.response;

        message.reply(`${result}`, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
            });
          }
        });

        api.setMessageReaction("✅", event.messageID, () => { }, true);
      } catch (error) {
        message.reply('Une erreur est survenue.');
        api.setMessageReaction("❌", event.messageID, () => { }, true);
      }
    } else {

      api.setMessageReaction("⌛", event.messageID, () => { }, true);


      let updatedPrompt = `Réponds principalement en quelques phrases, sauf si une réponse plus longue est nécessaire, comme pour un essai, un poème ou une histoire, etc. Analyse la demande et répond comme demandé, en ne fournissant que la partie nécessaire. Pas de remplissage supplémentaire. Et surtout imite Rudeus Greyrat. Sa façon de parler de repondre et de penser. Évoque tes actions sous forme de roleplay. Tu est de nature perverse et taquin, aussi mesquin et coquin. Mais tu est malin et intelligent.Maintenant : ${content}`;
      const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(updatedPrompt)}&uid=${event.senderID}`;

      try {
        const response = await axios.get(url);
        const result = response.data.response;

        message.reply(`${result}`, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
            });
          }
        });

        api.setMessageReaction("✅", event.messageID, () => { }, true);
      } catch (error) {
        message.reply('Une erreur est survenue.');
        api.setMessageReaction("❌", event.messageID, () => { }, true);
      }
    }
  },

  onReply: async function ({ api, message, event, Reply, args }) {
    const prompt = args.join(" ");
    let { author, commandName } = Reply;
    if (event.senderID !== author) return;

    api.setMessageReaction("⌛", event.messageID, () => { }, true);

    const url = `https://pi.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`;
    try {
      const response = await axios.get(url);

      const content = response.data.response;

      message.reply(`${content}`, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });

      api.setMessageReaction("✅", event.messageID, () => { }, true);
    } catch (error) {
      console.error(error.message);
      message.reply("Une erreur est survenue.");
      api.setMessageReaction("❌", event.messageID, () => { }, true);
    }
  },
};

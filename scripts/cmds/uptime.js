const os = require("os");
module.exports = {
  config: {
    name: "uptime",
    version: "2.1",
    author: "Zeet",
    longDescription: "Displays the total number of users of the bot and checks uptime",
    category: "Utility",
    guide: {
      en: "{pn}",
    },
  },

  onStart: async function ({ api, message, event }) {
    try {
      const uptimeInSeconds = process.uptime();
      const days = Math.floor(uptimeInSeconds / 86400);
      const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const uptimeString = `${days} days, ${hours} hours, ${minutes} minutes`;

      const pingStart = Date.now();
      await api.sendMessage({
        body: "Checking System Uptime..."
      }, event.threadID);

      const ping = Date.now() - pingStart;
      let pingStatus = "Law is running smoothly";
      if (ping < 800) {
        pingStatus = "Law is currently experiencing higher latency";
      }

      const isStable = ping < 800; 
      const memoryUsage = (os.totalmem() - os.freemem()) / (1024 ** 2);

      let statusMessage = "Law is running smoothly";
      if (!isStable) {
        statusMessage = "Law is currently experiencing higher latency";
      }

      const additionalMessages = [
        "Did you know Law can generate AI images?",
        "Explore Law's coding abilities!",
        "Thanks for having Law in your group!"
      ];

      const randomAdditionalMessage = additionalMessages[Math.floor(Math.random() * additionalMessages.length)];
      const replyMessage = `🛡️ Law Uptime: ${uptimeString}\n⚡ Status: ${statusMessage}\n🚀 Ping: ${ping}ms\n\n${randomAdditionalMessage} 🪶`;
      message.reply(replyMessage);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred.");
    }
  },
};

const axios = require("axios");
const fs = require('fs');
const path = require('path');
const { shorten } = require('tinyurl');

function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = {
  config: {
    name: "spotify",
    aliases: ["sing"],
    version: "1.0",
    author: "Mariancross",
    countDown: 10,
    role: 0,
    longDescription: "Download Spotify music by search query.",
    category: "music",
    guide: { en: "{pn} <music_name>" },
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");
    if (!query) {
      return message.reply("Baka enter a track name!");
    }
    const SearchapiUrl = `https://rehatdesu.xyz/api/spotify/search?query=${encodeURIComponent(query)}`;
    try {
      const response = await axios.get(SearchapiUrl);
      const tracksData = response.data.slice(0, 6);

      if (tracksData.length === 0) {
        return message.reply("No tracks found for the given query.");
      }

      const trackInfo = tracksData.map((track, index) =>
        `${index + 1}. ${track.title}\nArtists: ${track.artists}\nDuration: ${track.duration}`
      ).join("\n\n");

      const thumbnails = tracksData.map((track) => track.thumbnail);
      const attachments = await Promise.all(
        thumbnails.map((thumbnail) =>
          global.utils.getStreamFromURL(thumbnail)
        )
      );

      const replyMessage = await message.reply({
        body: `${trackInfo}\n\nReply to the message with a number to choose or any content to cancel`,
        attachment: attachments
      });

      const data = {
        commandName: this.config.name,
        messageID: replyMessage.messageID,
        tracks: tracksData,
        currentIndex: 6,
        originalQuery: query,
      };
      global.GoatBot.onReply.set(replyMessage.messageID, data);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred.");
    }
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const userInput = args[0].toLowerCase();
    const { tracks, currentIndex, originalQuery } = Reply;

    if (!isNaN(userInput) && userInput >= 1 && userInput <= tracks.length) {
      const selectedTrack = tracks[userInput - 1];
      message.unsend(Reply.messageID);
      
      const downloadingMessage = await message.reply(`⬇ | Rudeus downloading the track for you`);
      const SpdlApiUrl = 'https://rehatdesu.xyz/api/spotify/download?url=' + encodeURIComponent(selectedTrack.url);

      try {
        const apiResponse = await axios.get(SpdlApiUrl);
        if (apiResponse.data) {
          const {
            artist,
            title,
            album,
            released,
            url
          } = apiResponse.data;

          const audioResponse = await axios.get(url, { responseType: 'arraybuffer' });
          const cacheDir = path.join(__dirname, 'cache');
          if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
          }

          fs.writeFileSync(path.join(cacheDir, 'spotify.mp3'), Buffer.from(audioResponse.data));
          const fileSize = fs.statSync(path.join(cacheDir, 'spotify.mp3')).size;
          const sizeFormatted = formatSize(fileSize);
          const attachment = fs.createReadStream(path.join(cacheDir, 'spotify.mp3'));

          // Shorten the download link using TinyURL
          const shortenedUrl = await shorten(url);

          const form = {
            body: `👤 Artists: ${artist}\n🎵 Title: ${title}\n📀 Album: ${album}\n📅 Release Date: ${released}\n📦 Size: ${sizeFormatted}\n\nDownload: ${shortenedUrl}`,
            attachment: attachment
          };

          message.reply(form);
        } else {
          message.reply("An error occurred.");
        }
      } catch (error) {
        console.error(error);
        message.reply("An error occurred.");
      }
      message.unsend(downloadingMessage.messageID);
    }
  }
};

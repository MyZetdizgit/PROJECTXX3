module.exports = {
    config: {
        name: "transform",
        version: "1.1",
        author: "𝙕𝙚𝙩𝙨𝙪",
        countDown: 1,
        role: 0,
        shortDescription: " commencer une conversation ",
        longDescription: "ignore this command",
        category: "no prefix",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "zetapi transform") return message.reply(" ┏𝗧𝗥𝗔𝗡𝗦𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 𝗗'𝗜𝗠𝗔𝗚𝗘 (𝐁𝐲 𝐙𝐞𝐭𝐀𝐩𝐢) : \n\n◉ 𝗔𝗥𝗧𝗫𝗟 ➨ 𝘛𝘳𝘢𝘯𝘴𝘧𝘰𝘳𝘮𝘦𝘻 𝘷𝘰𝘴 𝘪𝘮𝘢𝘨𝘦𝘴 𝘢𝘷𝘦𝘤 𝟲 𝘤𝘩𝘰𝘪𝘹 𝘱𝘰𝘴𝘴𝘪𝘣𝘭𝘦𝘴 𝘥𝘦 𝘴𝘵𝘺𝘭𝘦𝘴 𝘚𝘋𝘟𝘓 𝘥𝘪𝘧𝘧𝘦𝘳𝘦𝘯𝘵𝘴 (𝘼𝙣𝙞𝙢𝙚𝙛𝙮 𝙞𝙣𝙘𝙡𝙪𝙨) ! \n\n◉ 𝗔𝗥𝗧 ➨ 𝘛𝘳𝘢𝘯𝘴𝘧𝘰𝘳𝘮𝘦𝘻 𝘷𝘰𝘴 𝘪𝘮𝘢𝘨𝘦𝘴 𝘧𝘢𝘷𝘰𝘳𝘪𝘵𝘦𝘴 𝘢𝘷𝘦𝘤 𝘶𝘯𝘦 𝘭𝘢𝘳𝘨𝘦 𝘨𝘢𝘮𝘮𝘦 𝘥𝘦 𝘤𝘩𝘰𝘪𝘹 𝘥𝘦 𝘴𝘵𝘺𝘭𝘦𝘴 𝘢𝘭𝘭𝘢𝘯𝘵 𝘫𝘶𝘴𝘲𝘶'𝘢 𝟲𝟮 𝘮𝘰𝘥𝘦𝘭  ! \n\n┗━━━━⌾\n                  ━━◊━━     \n 𝗭𝗲𝘁𝘀𝘂 𝗔𝗶 𝗽𝗼𝘂𝗿 𝘃𝗼𝘂𝘀 𝗦𝗲𝗿𝘃𝗶𝗿 ");
}
};

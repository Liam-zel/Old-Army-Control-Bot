const { botColour } = require("../main");

module.exports = {
    name: "invite",
    category: "misc",
    description: "Invite the bot to your own server!",
    alias: "None",
    examples: ["invite"],
    execute(message, Discord, f, avatar) {

        const inviteEmbed = new Discord.MessageEmbed()
        .setTitle("Invite the bot to your own server!")
        .setDescription("You can click the link above or click on the bot's profile and press 'Add to Server'")
        .setTimestamp()
        .setColor(botColour) // Bot theme colour (coral)
        .setURL('https://discord.com/oauth2/authorize?client_id=812674338112274453&scope=bot&permissions=305188696')
        .setImage(avatar);

        message.channel.send(inviteEmbed);
    }
}

console.log("invite.js loaded");
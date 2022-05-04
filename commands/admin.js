const { botColour } = require("../main");

module.exports = {
    name: "admin",
    category: "admin",
    description: "See admin commands. **[ADMIN COMMAND]**",
    alias: "`admin`",
    examples: ["admin"], // CHANGE LATER TO AN ACTUAL ITEM
    execute(message, Discord, commands) {
        let adminCommands = "\u200B"

        for (var [object, command] of commands) {
            if (command.category === "admin")  adminCommands += "`" + command.name + "`, ";
        }

        let adminEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp()
        .setTitle("**__Commands__**")
        .setDescription(adminCommands)

        message.channel.send(adminEmbed)
    }   
}

console.log("admin.js loaded");
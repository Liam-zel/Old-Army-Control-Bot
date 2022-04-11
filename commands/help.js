/*
    command categories:
        General
        Game
        Misc

*/

const { botColour, prefix } = require("../main.js");


var footer = "{} = required\n[] = optional";

module.exports = {
    name: "help",
    category: "general",
    description: "Why do you need to know what the command does if you used it :thinking:",
    alias: "`h`, `commands`, `c`",
    examples: ["help [Command name]", 
    "help",
    "commands loot",
    ],
    execute(message, Discord, f, commands, client) {
        const helpEmbed =  new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp();

        if (message.content.split(" ").length === 1) { // if length is 1 no command has been specified
            // for comands of each category
            var generalCommands = "";
            var gameCommands = "";
            var miscCommands = "";

            helpEmbed.setTitle("Help Menu");
            helpEmbed.setDescription("**Prefix: **" + prefix);
        

            // commands is a map, not an array, so you have to deal with it like this
            // the object stores all the data of the command but its 1 step out, so it stores command, see below (cant explain well, if you forget you will just have to run a for of loop with only 1 variable)
            // the command stores the actual command such as the name, description and execute
            for (var [object, command] of commands) {
                if (command.category === "general")  generalCommands += "`" + command.name + "`, ";
                else if (command.category === "game")   gameCommands += "`" + command.name + "`, ";
                else if (command.category === "misc")   miscCommands += "`" + command.name + "`, ";

            }

            var me = client.users.cache.get('461059264388005889');
            var mehaha = me.username + "#" + me.discriminator;

            helpEmbed.setDescription("[Invite the bot to your own server!](https://discord.com/oauth2/authorize?client_id=812674338112274453&scope=bot&permissions=1342491737-hyperlink-markdown)" + "\n" + 
            "**Got a question or need help?**\nSend a message to: `" + mehaha + "`");

            // commands shown
            helpEmbed.addField("**__Command list__**", "**-General-**" + "\n" + generalCommands, true); // general
            helpEmbed.addField("\u200b", "**-Game-**" + "\n" + gameCommands, true); // game
            helpEmbed.addField("\u200B", "**-Misc-**" + "\n" + miscCommands, true); // misc

            // footer
            helpEmbed.setFooter("type '" + prefix + "help {command name}' to learn a command!");
        }
        
        else {
            var isCommand = false;
             
            for (var [object, command] of commands) {
                if (message.content.split(" ").pop() === command.name) {
                    isCommand = true;
                }
            }

            // cant find command
            if (!isCommand) {
                helpEmbed.setFooter(footer);
                helpEmbed.addField("\u200B", "Either that command doesn't exist or you've typed it wrong.\nYou need to type: `" + prefix + "help {Command Name}`, you can't use an alias of a command!")
            }

            else {
                for (var [object, command] of commands) {
                    if (message.content.split(" ")[1] === command.name) {
                        helpEmbed.setFooter(footer);
                        helpEmbed.setTitle("**__" + command.name.toUpperCase() + "__**");
                        helpEmbed.addField("**Category**", command.category); // category
                        helpEmbed.addField("**Description**", command.description); // description
                        helpEmbed.addField("**Aliases**", command.alias); // aliases        

                        var examples = "";
                        for (var i = 0; i < command.examples.length; i++) {
                            examples += "`" + prefix + command.examples[i] + "`\n"
                        }

                        helpEmbed.addField("**Examples**", examples); // example
                    }
                }
            }
        }
        
        message.channel.send(helpEmbed);
    }
}

console.log("help.js loaded");
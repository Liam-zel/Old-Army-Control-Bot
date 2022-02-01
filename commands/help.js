const { botColour, prefix } = require("../main");

module.exports = {
    name: "help",
    description: "Why do you need to know what the command does if you used it :thinking:",
    alias: "None",
    examples: ["help [Command name]", 
    "help",
    "help loot",
    ],
    execute(message, args, Discord, f, commands, prefix, client) {
        const helpEmbed =  new Discord.MessageEmbed()
        .setColor(botColour)
        .setTimestamp();

        if (message.content === prefix + "help") {
            var allcommands = "";
            helpEmbed.setTitle("Help Menu");
            helpEmbed.setDescription("**Prefix: **" + prefix);
        

            // commands is a collection, not an array, so you have to deal with it like this
            // the object stores all the data of the command but its 1 step out, so it stores command, see below (cant explain well, if you forget you will just have to run a for of loop with only 1 variable)
            // the command stores the actual command such as the name, description and execute
            for (var [object, command] of commands) {
                allcommands += "`" + command.name + "`, ";
            }

            var me = client.users.cache.get('461059264388005889');
            var mehaha = me.username + "#" + me.discriminator;

            helpEmbed.setDescription("[Invite](https://discord.com/oauth2/authorize?client_id=812674338112274453&scope=bot&permissions=1342491737-hyperlink-markdown)" + "\n" + 
            "**Got a question or need help?**\nSend a message to: `" + mehaha + "`");
            helpEmbed.addField("**__Command list__**", allcommands, false);
            helpEmbed.setFooter("type '" + prefix + "help {command name}' to learn a command!");
        }
        
        else {
            var isCommand = false;
             
            for (var [object, command] of commands) {
                if (message.content.slice(6) === command.name) {
                    isCommand = true;
                }
            }

            if (!isCommand) {
                helpEmbed.setDescription("{} = required\n[] = optional");
                helpEmbed.addField("\u200B", "Either that command doesn't exist or you've typed it wrong.\nYou need to type: `" + prefix + "help {Command Name}`, you can't use an alias of a command")
            }

            else {
                for (var [object, command] of commands) {
                    if (message.content === prefix + "help " + command.name) {
                        helpEmbed.setDescription("{} = required\n[] = optional");
                        helpEmbed.setTitle("**__" + command.name.toUpperCase() + "__**");
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
        
        message.reply(helpEmbed);
    }
}

console.log("help.js loaded");
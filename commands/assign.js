const { botColour, prefix } = require("../main");
const { Areas } = require("../objects");

module.exports = {
    name: "assign",
    description: "You can assign your individual armies to invade certain areas!\nThis allows them to fight new foes and gain new loot!\n\n⚠️Assigning an army to a new area gets rid of their earnings! Make sure to loot to not lose anything!",
    alias: "`ass`",
    examples: ["assign [Army number] [Area]", "assign 0 forest"],
    execute(message, args, Discord, f, client, user, isAssign) {
        const assignEmbed = new Discord.MessageEmbed()
        .setColor(botColour)
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setTimestamp();

        var isArea = false;

        if (!isAssign) {
            var content = "\u200B";

            for (var i = 0; i < Areas.length; i++) {
                content += Areas[i].name + " \u25CF Prestige Level: `" + Areas[i].prestigeReq + "`\n";
            }

            assignEmbed.setDescription("You can assign your individual armies to invade certain areas!\n" +
            "This allows them to fight new foes and gain new loot!\n\n" +
            "To assign an army to an area, use the command: `" + prefix + "assign [Army number] [Area]`\n" + 
            "Example: `" + prefix + "assign 0 Cave`\n\n⚠️Assigning an army to a new area gets rid of their earnings! Make sure to loot to not lose anything!");

            assignEmbed.addField("**__Areas:__**", content);
        }

        else {
            var armyNum = message.content.split(" ")
            armyNum = parseInt(armyNum[1])

            if (armyNum > user.armies.length || armyNum < 0) {
                message.reply("That isn't a valid army number!\nUse the command: `" + prefix + "army` To see your armies and their army numbers!");
                return;
            }

            var area = message.content.split(" ").pop() // last element should be area


            for (var i = 0; i < Areas.length; i++) {
                if (Areas[i].name.toLowerCase() === area) {

                    user.armies[armyNum] = f.updateInvadingArea(armyNum, i);
                    f.updateUser();

                    assignEmbed.addField("**__Assigned " + armyNum + " to " + Areas[i].name + "!__**", 
                    ":crossed_swords: \u25CF Army number `" + armyNum + "` is now going to invade the " + Areas[i].name + " \u25CF :crossed_swords:")

                    isArea = true;
                    break;
                }
            }
        }

        if (!isArea && isAssign) {
            assignEmbed.addField("\u200B","That isn't correct!\n\n" + 
            "To assign an army to an area, use the command: `" + prefix + "assign [Army number] [Area]`\n" + 
            "Example: `" + prefix + "assign 0 Cave`\n\n⚠️Assigning an army to a new area gets rid of their earnings! Make sure to loot to not lose anything!");
        }

        message.channel.send(assignEmbed)
    }
}

console.log("assign.js loaded");
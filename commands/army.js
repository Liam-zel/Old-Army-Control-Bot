const { botColour } = require("../main");
const { Areas } = require("../objects");

module.exports = {
    name: "army",
    description: "See your armies and some stats about them!",
    alias: "`a`",
    examples: ["army", "a"],
    execute(message, args, Discord, f, user) {
        const armyEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(botColour)
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());


        var army1 = "\u200B";
        var army2 = "\u200B";

        for (var i = 0; i < user.armies.length; i++) {
            var army = user.armies[i];

            if ((i+1) % 2 == 0) {
                army2 = "**__Army number:__** `" + army.number + "`\n" + 
                "**Currently invading:** " + Areas[army.invadingArea].name + "\n" + 
                "**Earnings: ** `$" + army.lootGold + "` | `" + army.lootXP + "xp`\n\n";

                armyEmbed.addField("\u200B", "\u200B", true);
                armyEmbed.addField("\u200B", army2, true);
            }
            else {
                army1 = "**__Army number:__** `" + army.number + "`\n" + 
                "**Currently invading:** " + Areas[army.invadingArea].name + "\n" + 
                "**Earnings: ** `$" + f.addComma(army.lootGold) + "` | `" + f.addComma(army.lootXP) + "xp`\n\n";

                armyEmbed.addField("\u200B", army1, true);
            }
        }
        armyEmbed.addField("\u200B", "\u200B", false);

        var currentKills = (user.armies[0].total * user.armies.length);

        var redBar = f.createProgressBar(5, 25, currentKills, (user.enemyLimit * user.armies.length), "red");

        // very cool
        var estimatedTime = Math.ceil(((user.enemyLimit * user.armies.length) - currentKills) * (2.5 / (user.armies.length * user.armyEfficiency))); // it just works ok
        var hours = Math.trunc((estimatedTime / 60) / 60);
        var mins = Math.floor((estimatedTime / 60) - (hours * 60));
        var secs = estimatedTime - ((mins + hours * 60) * 60);

        var timer;
        if (hours > 0) timer = "**" + hours + " hours " + mins + " minutes " + secs + " seconds** until full";
        else if (mins > 0) timer = "**" + mins + " minutes " + secs + " seconds** until full";
        else timer = "**" + secs + " seconds** until full" 

        armyEmbed.addField("**Army kills: [Storage Level " + user.storageLevel + "]**",
        f.addComma(user.armies[0].total * user.armies.length) + " / " + f.addComma(user.enemyLimit * user.armies.length) + "\n" + 
        redBar + "\n" + timer, false)

        armyEmbed.addField("\u200B", "**Army Efficiency:** `" + user.armyEfficiency + "` *[Level " + user.efficiencyLevel + "]*", false);



        message.channel.send(armyEmbed);

    }
}

console.log("army.js loaded");
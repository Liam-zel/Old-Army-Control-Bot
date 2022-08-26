const { botColour } = require("../main");
const { Areas } = require("../objects/combat.js");

module.exports = {
    name: "army",
    category: "general",
    description: "See your armies and some stats about them!",
    alias: "`army`, `a`",
    examples: ["army", "a"],
    execute(message, Discord, f, user) {
        const armyEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(botColour)
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());


        var army1 = "\u200B";
        var army2 = "\u200B";

        for (var i = 0; i < user.armies.length; i++) {
            const army = user.armies[i];
            const goldEarn = army.lootGold / 100;
            const image = f.findImage(user.areas[army.invadingArea].level + "_")     

            if ((i+1) % 2 == 0) {
                army2 = "**__Army number:__** `" + army.number + "`\n" + 
                "**Currently invading:** " + Areas[army.invadingArea].name + "\u200B" + image + "\n";
                //"**Earnings: ** `$" + goldEarn + "` | `" + army.lootXP + "xp`\n\n";

                armyEmbed.addField("\u200B", "\u200B", true);
                armyEmbed.addField("\u200B", army2, true);
            }
            else {
                army1 = "**__Army number:__** `" + army.number + "`\n" + 
                "**Currently invading:** " + Areas[army.invadingArea].name + "\u200B    " + image + "\n"    ;
                //"**Earnings: ** `$" + f.addComma(goldEarn) + "` | `" + f.addComma(army.lootXP) + "xp`\n\n";

                armyEmbed.addField("\u200B", army1, true);
            }
        }
        armyEmbed.addField("\u200B", "\u200B", false);
        
        var currentKills = 0;
        for (let i = 0; i < user.armies.length; i++) {
            currentKills += user.armies[i].total;
        }

        const redBar = f.createProgressBar(5, 25, currentKills, (user.enemyLimit * user.armies.length), "red");

        // very cool
        var estimatedTime = Math.ceil(((user.enemyLimit * user.armies.length) - currentKills) * (2.5 / (user.armies.length * user.armyEfficiency))); // it just works ok
        var hours = Math.trunc((estimatedTime / 60) / 60);
        var mins = Math.floor((estimatedTime / 60) - (hours * 60));
        var secs = estimatedTime - ((mins + hours * 60) * 60);

        var timer;
        if (hours > 0) timer = "**" + hours + " hours " + mins + " minutes " + secs + " seconds** until full";
        else if (mins > 0) timer = "**" + mins + " minutes " + secs + " seconds** until full";
        else timer = "**" + secs + " seconds** until full" 

        // full bar
        if (currentKills >= (user.enemyLimit * user.armies.length)) {
            timer = "**FULL**"
        }

        armyEmbed.addField("**Army kills: [Storage Level " + user.storageLevel + "]**",
        f.addComma(user.armies[0].total * user.armies.length) + " / " + f.addComma(user.enemyLimit * user.armies.length) + "\n" + 
        redBar + "\n" + timer, false)

        armyEmbed.addField("\u200B", "**Army Efficiency:** `" + user.armyEfficiency + "` *[Level " + user.efficiencyLevel + "]*", false);



        message.channel.send(armyEmbed);

    }
}

console.log("army.js loaded");
var { prefix, botColour, client } = require("../main"); 

module.exports = {
    name: "profile",
    category: "general",
    description: "Shows your profile!\nHere you can see some cool stats and more.",
    alias: "`p`", 
    examples: ["profile [user]",
    "profile",
    "profile @Coolkid92"
    ],
    execute(message, Discord, f, user, data) {

        const profileEmbed = new Discord.MessageEmbed()

        // if they want to look at another users profile
        var found = false; // found has to be outside this scope because its used when the thumbnail is set below
        if (message.mentions.users.first() != undefined) {

            var mentioned = message.mentions.users.first();

            for (var i = 0; i < data.users.length; i++) {

                if (mentioned.username === data.users[i].username) {
                    user = data.users[i];
                    profileEmbed.setTitle("**" + data.users[i].username + "'s Profile**");
                    profileEmbed.setThumbnail(mentioned.avatarURL())
                    found = true;
                }

            }

            if (!found) { message.reply("couldn't find that user!"); return; }

        }


        const xpBar = f.createProgressBar(5, 15, user.xp, user.xpToNext, "blue"); // min_length, max_length, current, goal, colour

        var currentKills = 0;
        for (var i = 0; i < user.armies.length; i++) {
            currentKills += user.armies[i].total;
        }
        const armyBar = f.createProgressBar(5, 15, currentKills, (user.enemyLimit * user.armies.length), "red"); // min_length, max_length, current, goal, colour

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

        /* .addFields(
                {name: "General", value: "\u200B", inline: false},
                {name: "Balance:", value: "$" + user.balance, inline: true},
                {name: "Level:", value: user.userLevel, inline: true},
                {name: "XP progress:", value: xpBar, inline: true},
                {name: "Prestige:", value: user.prestigeNum, inline: true},
                {name: "Prestige Coins:", value: user.prestigeCoins, inline: true},
                {name: "\u200B", value: "\u200B", inline: true}
            ) 
        */
        profileEmbed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        profileEmbed.setColor(botColour)
        profileEmbed.setTimestamp()
        if (!found) profileEmbed.setThumbnail(message.author.avatarURL())

        profileEmbed.addField(
        "**__General:__**", 
        "**Balance:** $" + (user.balance / 100) + "\n\n" + 
        "**Prestige: **" + user.prestigeNum + "\n" + 
        "**Prestige Coins: **" + user.prestigeCoins + "\n" + 
        "**Creation Date: **" + user.createdAt, true)

        // Level and xp
        if (user.xp.toString().length > 15 || user.xpToNext.toString().length > 15) {
            profileEmbed.addField("\u200B",
            "**Level: **" + user.userLevel + "\n" + 
            user.xp.toExponential(1) + " xp / " + user.xpToNext.toExponential(1) + " xp\n" + xpBar + "\n\n", true)
        }
        else {
            profileEmbed.addField("\u200B",
            "**Level: **" + user.userLevel + "\n" + 
            f.addComma(user.xp) + "xp / " + f.addComma(user.xpToNext) + "xp\n" + xpBar + "\n\n", true)
        }

        // Army storage progress
        profileEmbed.addField("\u200B", 
        "**Army kills: [Level " + user.storageLevel + "]**" + 
        "\n" + f.addComma(currentKills) + " / " + f.addComma(user.enemyLimit * user.armies.length) + "\n " +
        armyBar + "\n " + 
        timer, false);

        // Bonuses
        profileEmbed.addField("**__Bonuses:__**", 
        "**Multiplier bonus:** `" + user.multiplier + "x`\n" +
        "**Army Efficiency:** `" + user.armyEfficiency + "` *[Level " + user.efficiencyLevel + "]* \n", true);

        message.channel.send(profileEmbed);
    }
}

console.log("profile.js loaded");
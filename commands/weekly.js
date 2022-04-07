const { Areas } = require("../objects");

const { botColour } = require("../main");

module.exports = {
    name: "weekly",
    category: "game",
    description: "Gain a weekly reward of money and xp!",
    alias: "None",
    cooldowns: [],
    examples: ["weekly"],
    execute(message, Discord, f, o, user) {
        if (user.weekly > 0) {
            // the weekly property is stored in seconds and ticks down by 1 every second in main
            var hours = Math.trunc((user.weekly / 60) / 60); // seconds divided by 60^2 gives the hours
            var minutes = Math.floor(user.weekly / 60) - (hours * 60); // seconds divided by 60 gives minutes, the minutes are subtracted by 60 * hours show minutes left, not minutes in total (down to 59 minutes or less)
            var seconds = user.weekly - ((minutes * 60) + (hours * 60 * 60)); // user.weekly is already stored in seconds, the other parts are to get it down to 59 seconds or less

            message.reply("You cant redeem your weekly reward yet!\nYou need to wait " + hours + " hours " + minutes + " minutes " + seconds + " seconds");
            return;
        }

        // REWARD
        var areaNum = 0;
        for (var i = 0; i < o.Areas.length; i++) {
            // finding highest unlocked area
            if (o.Areas[i].name === user.areas[user.areas.length - 1]) {
                areaNum = i;
                break;
            }
        }

        var enemy = o.Areas[areaNum].monsters[o.Areas[areaNum].monsters.length - 1];

        var xpReward = Math.round(enemy.xpEarn * 50 * (user.multiplier + 0.1)); // reward from same enemy 50 times
        var goldReward = Math.round(enemy.goldEarn * 175 * (user.multiplier + 0.25)); // reward from same enemy 175 times

        const xpBar = f.createProgressBar(5, 15, user.xp, user.xpToNext, "blue", xpReward); // min_length, max_length, current, goal, colour

        const weeklyEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp()
        .addField("You redeemed your weekly!", "*Gold Reward* | **$" + f.addComma(goldReward/100) + "**\n" +
        "*XP Reward* | **" + f.addComma(xpReward) + "xp**\n\n" + 
        f.addComma(user.xp + xpReward) + "xp / " + f.addComma(user.xpToNext) + "xp\n" + xpBar, false)

        user.xp += xpReward;
        user.balance += Math.round(goldReward);
        user.totalBalance += Math.round(goldReward)

        message.reply(weeklyEmbed);

        if (user.xp >= user.xpToNext) f.updateLevel(user, message, o.Areas);

        user.weekly = 604800; // seconds in a week

        f.updateUser();
    }
}

console.log("weekly.js loaded");
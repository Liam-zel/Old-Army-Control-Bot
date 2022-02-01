const { Areas } = require("../objects");

const { botColour } = require("../main");

module.exports = {
    name: "rest",
    description: "Give your active armies a rest!\nGives xp and has a 30 second cooldown",
    alias: "None",
    cooldowns: [],
    examples: ["rest"],
    execute(message, args, Discord, f, o, user) {
        var cooldowns = module.exports.cooldowns;

        for (var i = 0; i < cooldowns.length; i++) {
            if (cooldowns[i].userID === message.author.id) {
                message.reply("You have to wait " + cooldowns[i].timer + "s until you can use this command again!");
                return;
            }
        }

        // REWARD
        var areaNum = 0;
        for (var i = 0; i < o.Areas.length; i++) {
            // finding highest unlocked area
            if (o.Areas[i].name === user.areas.pop()) {
                areaNum = i;
                break;
            }
        }

        var enemy = o.Areas[areaNum].monsters[o.Areas[areaNum].monsters.length - 2]; // find second strongest enemy in strongest unlocked area

        var rand = Math.random();

        var xpReward = Math.round(enemy.xpEarn * (user.multiplier + rand)); 
        var goldReward = Math.round(enemy.goldEarn * (user.multiplier + rand)); 

        const xpBar = f.createProgressBar(5, 15, user.xp, user.xpToNext, "blue", xpReward); // min_length, max_length, current, goal

        const restEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour) 
        .setTimestamp();

        // sleeping tiers
        if (rand < 0.20) {
            restEmbed.addField("Resting Results!", "Your army had a rough rest and you earned: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        else if (rand < 0.40) {
            restEmbed.addField("Resting Results!", "Your army awoke from their slumber and you earned: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        else if (rand < 0.75) {
            restEmbed.addField("Resting Results!", "Your army woke up and felt well rested and refreshedm, you earned: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        else {
            restEmbed.addField("Resting Results!", "Your army slept like babies and felt ready to take on any beast, you earned: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        var currentXP = user.xp + xpReward;
        var XPTONEXT = user.xpToNext;

         if (currentXP.toString().length > 15) { currentXP = currentXP.toExponential(1); }
        else { currentXP = f.addComma(currentXP); } 

        if (XPTONEXT.toString().length > 15) { XPTONEXT = XPTONEXT.toExponential(1); }
        else { XPTONEXT = f.addComma(XPTONEXT); }

        restEmbed.addField(currentXP + "xp / " + XPTONEXT + "xp", xpBar, false);

        user.xp += xpReward;
        user.balance += goldReward;
        if (user.xp >= user.xpToNext) f.updateLevel(user, message, Areas);

        cooldowns[cooldowns.length] = {
            userID: message.author.id,
            timer: 60,
        }

        f.updateUser();
        message.reply(restEmbed);
    }
}


var tickDown = setInterval(() => {
    for (var i = 0; i < module.exports.cooldowns.length; i++) {
        module.exports.cooldowns[i].timer--;


        if (module.exports.cooldowns[i].timer < 1) {
            module.exports.cooldowns.splice(0, 1); // oldest element is first so delete
        }
    }

}, 1000);


console.log("weekly.js loaded");
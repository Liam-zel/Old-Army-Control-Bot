const training_CD = new Set();
const { botColour } = require("../main")

module.exports = {
    name: "train",
    description: "Train your armies!\nGives xp and has a minute long second cooldown",
    alias: "None",
    cooldowns: [],
    examples: ["train"],
    execute(message, args, Discord, f, o, user) {
        var cooldowns = module.exports.cooldowns;

        for (var i = 0; i < cooldowns.length; i++) {
            if (cooldowns[i].userID === message.author.id) {
                message.reply("You have to wait " + cooldowns[i].timer + "s until you can train your army again!");
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
        //var goldReward = Math.round(enemy.goldEarn * (user.multiplier + rand)); 

        const xpBar = f.createProgressBar(5, 15, user.xp, user.xpToNext, "blue", xpReward); // min_length, max_length, current, goal

        const trainEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour) 
        .setTimestamp();

        // training tiers
        if (rand < 0.20) {
            trainEmbed.addField("Training Results!", "Your army stumbled about like drunkards and got little done, you got pitiful xp: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        else if (rand < 0.50) {
            trainEmbed.addField("Training Results!", "You trained your army, earning you xp: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        else if (rand < 0.85) {
            trainEmbed.addField("Training Results!", "Your army trained long and hard with great brawn, earning you moderate xp: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        else {
            trainEmbed.addField("Training Results!", "Your army had incredible energy running through them, able to train like it was their last time, you earned notable xp: `" + xpReward + "xp`" + 
            "\n**" + user.xp + "xp + " + xpReward + "xp = " + (xpReward + user.xp) + "xp**", false)
        }

        var currentXP = user.xp + xpReward;
        var XPTONEXT = user.xpToNext;

         if (currentXP.toString().length > 15) { currentXP = currentXP.toExponential(1); }
        else { currentXP = f.addComma(currentXP); } 

        if (XPTONEXT.toString().length > 15) { XPTONEXT = XPTONEXT.toExponential(1); }
        else { XPTONEXT = f.addComma(XPTONEXT); }

        trainEmbed.addField(currentXP + "xp / " + XPTONEXT + "xp", xpBar, false);

        user.xp += xpReward;
        //user.balance += goldReward;
        if (user.xp >= user.xpToNext) f.updateLevel(user, message, Areas);

        cooldowns[cooldowns.length] = {
            userID: message.author.id,
            timer: 60,
        }

        f.updateUser();
        message.reply(trainEmbed);
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

console.log("train.js loaded");
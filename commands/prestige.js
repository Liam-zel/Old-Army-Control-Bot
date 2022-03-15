const { botColour } = require("../main");
const { Areas } = require("../objects.js");

module.exports = {
    name: "prestige",
    category: "game",
    description: "Reset your progress for new rewards, foes and a special currency used to get powerful permanent upgrades!",
    alias: "None",
    examples: ["prestige"],
    execute(message, args, Discord, f, user, client) {
        var levelRequirement = 10 + 5 * user.prestigeNum;
        var profileNum = f.findUser(message, null, true);
        //var idleNum = f.findIdle(message, null, true);

        var prestigeReward = 100;

        const prestigeEmbed = new Discord.MessageEmbed()
        .setColor(botColour) 
        .setTitle("Prestige")
        .setTimestamp()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());
        
        prestigeEmbed.addField("**Cost:** $" + (1500*(user.prestigeNum+1)), "⚠️Prestiging resets your levels, armies, xp and items\n" + 
        "⚠️You must reach level __" + levelRequirement + "__ to prestige\n\n" + 
        "Prestiging allows you to progress through the game by unlocking more armies and giving you special **prestige coins**\n\n" +
        "You will earn: `\u27C1 " + (prestigeReward * (user.prestigeNum+1)) + "` prestige coins\n\n" + // upwards triangle unicode  ⟁
        "*react to prestige...*");


        // await reaction
        message.channel.send(prestigeEmbed).then(prestigeEmbed => {
            prestigeEmbed.react("✅");

            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' && user.id === message.author.id;
            };
            
            prestigeEmbed.awaitReactions(filter, { max: 99, time: 10000, errors: ['time'] }) // 10000 = 10 seconds
                .then(collected => console.log(collected.size))
                .catch(collected => {

                    if (collected.size == 1) {
                        if (user.balance < 1500 * (user.prestigeNum + 1)) {
                            message.reply("You can't afford that!\n You need $" + (1500 * (user.prestigeNum + 1) - user.balance) + " more!");
                            prestigeEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            return;
                        }
                        else if (user.userLevel < levelRequirement) {
                            message.reply("You need to be level " + levelRequirement + " to prestige!");
                            prestigeEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            return;
                        }
        
                        user.prestigeNum++;
    

                        // recreates users data
                        client.data.users[profileNum] = { // Subject to change
                            username: message.author.username,
                            userID: message.author.id,
                            daily: user.daily,
                            weekly: user.weekly,
                            createdAt: user.createdAt,
                            multiplier: 1.00 + (user.prestigeNum / 10),
                            armyEfficiency: 1, 
                            efficiencyLevel: 0,
                            storageLevel: 0,
                            enemyLimit: 25 * (user.prestigeNum / 2),
                            balance: 0,    
                            totalBalance: user.balance + user.totalBalance,
                            userLevel: 1,
                            xp: 0,
                            totalXP: user.totalXP,
                            xpToNext: 30, 
                            prestigeNum: user.prestigeNum,
                            prestigeCoins: prestigeReward * user.prestigeNum,
                            lastLoot: Date.now(),
                            lootFull: 0,
                            inventory: [], // keep items? (maybe add a safe thats keeps items safe from prestiges?)
                            trinkets: user.trinkets, // keep trinkets? 
                            armies: [f.createArmy(0)],
                            areas: [f.createArea(0)],
                            monsterDrops: []
                        }

                        // idleData.users[idleData.users.length] = {
                        //     userID: message.author.id,
                        //     armies: [f.createArmy(0)],
                        //     monsterDrops: []
                        // }

                        f.updateUser();    
                        message.reply("**You prestiged!**\nPrestige number: **" + user.prestigeNum + "**\n+ " + (100 * user.prestigeNum) + " Prestige coins");
                    }


                    prestigeEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                });
        });
    } 
}

console.log("prestige.js loaded");
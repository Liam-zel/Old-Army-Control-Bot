const { botColour, prefix } = require("../main");
const { Areas } = require("../objects.js");

module.exports = {
    name: "prestige",
    category: "game",
    description: "Reset your progress for new rewards, foes and a special currency used to get powerful permanent upgrades!",
    alias: "None",
    examples: ["prestige"],
    execute(message, Discord, f, user, client) {
        var levelRequirement = 10 + (5 * user.prestigeNum);
        var profileNum = f.findUser(message, null, true);
        //var idleNum = f.findIdle(message, null, true);

        var prestigeReward = 100;
        var prestigeCost = 1500 * (user.prestigeNum + 1)

        const prestigeEmbed = new Discord.MessageEmbed()
        .setColor(botColour) 
        .setTitle("Prestige")
        .setTimestamp()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());
        
        prestigeEmbed.addField("**Cost:** $" + prestigeCost, "⚠️Prestiging resets your levels, armies, xp and items\n" + 
        "⚠️You must reach level __" + levelRequirement + "__ to prestige\n\n" + 
        "Prestiging allows you to progress through the game by unlocking more armies and giving you special **prestige coins**\n\n" +
        "You will earn: `⟁ " + (prestigeReward * (user.prestigeNum+1)) + "` prestige coins\n\n" + // upwards triangle unicode  ⟁
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
                        if (user.balance < (1500*100) * (user.prestigeNum + 1)) {
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
                            multiplier: 1.00 + (user.prestigeNum / 5), // ---- MULTIPLIER ----
                            armyEfficiency: 1, 
                            efficiencyLevel: 0,
                            storageLevel: 0,
                            enemyLimit: 10 * user.prestigeNum, // ---- ENEMY LIMIT (defult is 10)----
                            balance: 0,    
                            totalBalance: user.totalBalance,
                            totalXP: user.totalXP, 
                            userLevel: 1,
                            xp: 0,
                            xpToNext: 30, // ---- XPTONEXT -----
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

                        const prestigeEmbed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
                        .setColor(botColour)
                        .setTimestamp()
                        .setTitle("__You Prestiged to Prestige Level " + user.prestigeNum + "!__")

                        .addField("**Prestige Earnings:**", "**Prestige Coins:** `⟁ " + prestigeReward * user.prestigeNum + "`\n" + 
                                  "**Multiplier Bonus:** `" + (1 + user.prestigeNum/5) + "x` `[+ " + (user.prestigeNum/5) + "]`\n" + 
                                  "**Enemy Limit:**` " + (user.enemyLimit - 10) + "` `[+ " + ((10 * user.prestigeNum) - 10) + "]`", false) // 10 is defulat enemylimit ------------------------------------ (adjust first and last 10 if enemy limit default is changed)
                      
                        .addField("**Next Prestige:**", "Your next prestige requires:\n" +
                                  "Level: `" + (10 + (5 * user.prestigeNum)) + "`\n" + // PRESTIGE LEVEL EQUATION
                                  "Cost: `" + (1500 * (user.prestigeNum + 1)) + "`", false) // PRESTIGE COST EQUATION

                        for (let i = 0; i < Areas.length; i++) {
                            if (Areas[i].prestigeReq === user.prestigeNum) {
                                prestigeEmbed.setDescription(
                                    "**New Area Unlocked!**\n" + 
                                    "You unlocked the " + Areas[i].name + " area!\n" + 
                                    "use the `assign` command to assign an army to fight that area!\n" +
                                    "*use *`" + prefix + "help assign`* to find out how to assign.*")

                                break; 
                            }
                        }

                        message.channel.send(prestigeEmbed);
                    }


                    prestigeEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                });
        });
    } 
}

console.log("prestige.js loaded");
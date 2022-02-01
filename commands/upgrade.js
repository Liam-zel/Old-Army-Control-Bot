const { prefix, botColour } = require("../main.js")

module.exports = {
    name: "upgrade",
    description: "Upgrade your account and stats. Upgrades are essential to progress!",
    alias: "`up`",
    examples: [
        "upgrade [upgrade tag] [amount (1 -> max)]",
        "upgrade",
        "upgrade storage 10",
        "upgrade eff max"
    ],
    execute(message, args, Discord, f, o, user) {

        var armyCost = 3500;
        var prestigeRequirment = 1;

        for (var i = 1; i < user.armies.length; i++) {
            armyCost = Math.floor(armyCost * 2.5);
            prestigeRequirment++;
        }

        var storageCost = 100 + (50 * user.storageLevel);

        var efficiencyCost = Math.floor(300 * Math.pow(1.1, user.efficiencyLevel));

        // // Army
        // if (message.content.startsWith(prefix + "upgrade army") || message.content.startsWith(prefix + "up army")) {
        //     if (user.balance < armyCost) {
        //         message.reply("You can't afford that!\n You need $" + (armyCost - user.balance) + " more!");
        //         return;
        //     }
        //     else if (user.prestigeNum < prestigeRequirment) {
        //         message.reply("You need to be prestige level __" + prestigeRequirment + "__ to get this upgrade!");
        //         return;
        //     }
        //     user.armies[user.armies.length] = f.createArmy(user.armies.length, o.Areas);
        //     message.reply("You bought a new army!\n" + "$*" + f.addComma(user.balance) + " - $" + f.addComma(armyCost) + 
        //     " = $" + f.addComma(user.balance - armyCost) + "*");

        //     user.balance -= armyCost;

        //     f.updateUser();
        //     f.updateIdle();
        //     return;
        // }
        
        // Storage
        if (message.content.startsWith(prefix + "upgrade storage") || message.content.startsWith(prefix + "up storage")) {
            if (user.balance < storageCost) {
                message.reply("You can't afford that!\n You need $" + f.addComma(storageCost - user.balance) + " more!");
                return;
            }

            var upgradeAmount;
            var max = false;

            // turn string into an array seperated by spaces, return last element (amount);
            upgradeAmount = message.content.split(" ").pop();
            if (message.content.split(" ").length == 2) upgradeAmount = 1;

            if (upgradeAmount == "max") { max = true; upgradeAmount = 0; }
            else if (upgradeAmount == false) upgradeAmount = 1; // if it is an emptry string, it will be false (checking for empty string doesnt work ¯\_(ツ)_/¯)

            // stored to show after upgrade
            var userBalanceTemp = user.balance;
            var userLevelTemp = user.storageLevel;
            var upgradeTemp = upgradeAmount;

            var totalCost = 0; 

            // upgrading magic happens here
            if (!max) {
                while(upgradeAmount > 0) {
                    if ((user.balance - storageCost) < 0) break;

                    user.enemyLimit += 25;

                    user.storageLevel++;
                    user.balance -= storageCost;

                    storageCost += 50;
                    totalCost += storageCost;

                    upgradeAmount--;
                }
            }
            else {
                while(user.balance - storageCost > 0) {
                    user.enemyLimit += 25;

                    user.storageLevel++;
                    user.balance -= storageCost;
                    storageCost += 50;
                    totalCost += storageCost;
                    upgradeTemp++;
                }
            }   

            totalCost = Math.round(totalCost);
            user.balance = Math.round(user.balance);

            const storageEmbed = new Discord.MessageEmbed()
            .setColor(botColour)
            .setAuthor(message.author.username + "'s Trinkets", message.author.avatarURL())
            .setTimestamp()
            .setDescription("**Level [" + userLevelTemp + "] --> [" + user.storageLevel + "]** \n" + 
            "You increased your storage by `" + (25 * upgradeTemp) + "`!\n" + 
            "*$" + f.addComma(userBalanceTemp) + " - $" + f.addComma(totalCost - 100) + 
            " = $" + f.addComma(user.balance) + "*"
            );

            message.channel.send(storageEmbed);

            f.updateUser();
            return;
        }

        // Amry Efficiency
        else if (message.content.startsWith(prefix + "upgrade eff") || message.content.startsWith(prefix + "up eff")) {
            if (user.balance < efficiencyCost) {
                message.reply("You can't afford that!\n You need $" + f.addComma(efficiencyCost - user.balance) + " more!");
                return;
            }

            var upgradeAmount;
            var max = false;

            // turn string into an array seperated by spaces, return last element (amount);
            upgradeAmount = message.content.split(" ").pop();
            if (message.content.split(" ").length == 2) upgradeAmount = 1; 

            if (upgradeAmount == "max") { max = true; upgradeAmount = 0; }
            else if (upgradeAmount == false) upgradeAmount = 1; // if it is an emptry string, it will be false (checking for empty string doesnt work ¯\_(ツ)_/¯)

            // stored to show after upgrade
            var userBalanceTemp = user.balance;
            var userLevelTemp = user.efficiencyLevel;

            var totalCost = 0; 

            // upgrading magic happens here
            if (!max) {
                while(upgradeAmount > 0) {
                    if ((user.balance - efficiencyCost) < 0) break;


                    user.armyEfficiency++;
                    user.efficiencyLevel++;

                    user.balance -= efficiencyCost;
                    efficiencyCost *= 1.1

                    totalCost += efficiencyCost;
                    upgradeAmount--;
                }
            }
            else {
                while(user.balance - efficiencyCost > 0) {
                    user.armyEfficiency++;
                    user.efficiencyLevel++;

                    user.balance -= efficiencyCost;
                    efficiencyCost *= 1.1

                    totalCost += efficiencyCost;
                }
            }   


            totalCost = Math.round(totalCost);
            user.balance = Math.round(user.balance);

            const effEmbed = new Discord.MessageEmbed()
            .setColor(botColour)
            .setAuthor(message.author.username + "'s Trinkets", message.author.avatarURL())
            .setTimestamp()
            .setDescription("**Level [" + userLevelTemp + "] --> [" + user.efficiencyLevel + "]** \n" + 
            "You increased your efficiency by `" + (user.efficiencyLevel - userLevelTemp) + "`!\n" + 
            "*$" + f.addComma(userBalanceTemp) + " - $" + f.addComma(totalCost - 300) + 
            " = $" + f.addComma(user.balance) + "*"
            );

            message.channel.send(effEmbed);

            f.updateUser();
            return;
        }

        const upgradesEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp()
        .setTitle("Upgrades:")
        .addFields(
            // { name: "**army: Extra Army**", value: "**Requires prestige level: " + prestigeRequirment + "**\n" + 
            // "*Gives you an extra army with new enemies to fight*" + "\n\n" + 
            // "**Cost:** $" + f.addComma(armyCost) + "\n\u200B", inline: true },

            { name: "**storage: Increased Storage**", value: "*Increases the max amount of kills an army can store by 25!*" + "\n\n" + 
            "**Cost:** $" + f.addComma(storageCost) + "\n\u200B", inline: true },

            { name: "**eff: Better Army Efficiency**", value: "\n" + "*Increases your armies efficiency which makes them slay more monsters!*\n\n" + 
            "**Cost:** $" + f.addComma(efficiencyCost) + "\n\u200B", inline: true }
        )
        .setFooter(prefix + "upgrade  {upgrade tag}  [amount - optional]");

        message.channel.send(upgradesEmbed);
    }
}

console.log("upgrade.js loaded");

    // scrap this emoji system for a text one (i.e +upgrade 1 or +upgrade 2 100)
    // message.channel.send(upgradesEmbed).then(upgradesEmbed => {
    //     upgradesEmbed.react("1️⃣")
    //     .then(upgradesEmbed.react("2️⃣"))
    //     .then(upgradesEmbed.react("3️⃣"));

    //     const filter = (reaction, user) => {
    //         return ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
    //     };
        
    //     upgradesEmbed.awaitReactions(filter, { max: 1, time: 0, errors: ['time'] })
    //     .then(collected => {
    //         const reaction = collected.first();

    //         if(reaction.emoji.name == "1️⃣") { // +1 army
    //             if (user.balance < armyCost) {
    //                 message.reply("You can't afford that!\n You need $" + (armyCost - user.balance) + " more!");
    //                 upgradesEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    //                 return;
    //             }
    //             else if (user.prestigeNum < prestigeRequirment) {
    //                 message.reply("You need to be prestige level __" + prestigeRequirment + "__ to get this upgrade!");
    //                 upgradesEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    //                 return;
    //             }
    //             user.armies[user.armies.length] = f.createArmy(user.armies.length, o.Areas);
    //             message.reply("You bought a new army!\n" + "$" + user.balance + " - $" + armyCost + " \n= $" + (user.balance - armyCost));

    //             user.balance -= armyCost;
    //         }
    //         else if(reaction.emoji.name == "2️⃣") {
    //             user.enemyLimit += 25;
    //             message.reply("You increased your storage!\n" + "$" + user.balance + " - $" + storageCost + " \n= $" + (user.balance - storageCost));

    //             user.balance -= storageCost;
    //         }

    //         f.updateUser();
    //         upgradesEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    //     });
    // });
//     }
// }
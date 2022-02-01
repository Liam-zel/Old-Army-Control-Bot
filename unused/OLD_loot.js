const { Areas } = require("../objects");

module.exports = {
    name: "OLD_loot",
    description: "Claim your loot!",
    execute(message, args, Discord, f, p, user, client) {

        const lootEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(p.goldPallete())
        .setTitle("Quest Loot!");

        var totalGold = 0;
        var totalXP = 0;

        var data = "";
        for (var i = 0; i < user.armies.length; i++) {
            var enemyNum = 0;

            for (var j = 0; j < user.armies[i].possibleEnemies.length; j++) {

                // skip enemies that haven't been fought
                var skip = false;
                while (user.armies[i].enemiesSlain[j] == 0)  { 
                    j++;
                    if (j >= user.armies[i].enemiesSlain.length) {
                        skip = true;
                        break;
                    }
                }
                if (skip) break;

                // image of enemy, can taken from one server and used in others (FIX IMMEDIATELY WHEN ENEMIES ALL HAVE IMAGES)
                var image;
                if (i > 0) { image = undefined; }
                else image = client.emojis.cache.find(emoji => emoji.name === user.armies[i].possibleEnemies[j]).toString(); 

                enemyNum++;

                // get rid of check when all enemies have an image
                if (image == undefined) data += user.armies[i].possibleEnemies[j] + " `x" + user.armies[i].enemiesSlain[j] + "`"; // times enemy was killed
                else data += image + user.armies[i].possibleEnemies[j] + " `x" + user.armies[i].enemiesSlain[j] + "`"; // times enemy was killed

                // spaces data evenly regardless of characters in enemy name
                for (var k = 15; k > f.shortenString(user.armies[i].possibleEnemies[j]).length; k--) {
                    data += "\u2800";
                }

                if (enemyNum % 2 == 0) {
                    lootEmbed.addField("\u200B", data);
                    data = "\u200B"; // when it is empty it causes an error ¯\_(ツ)_/¯
                }


                totalGold += user.armies[i].lootGold;
                totalXP += user.armies[i].lootXP;

                // reset army stats
                user.armies[i].enemiesSlain[j] = 0;
                user.armies[i].total = 0;
                user.armies[i].lootGold = 0;
                user.armies[i].lootXP = 0;
            }
        }

        if (data == "") data = "You haven't killed anything yet!";

        lootEmbed.addField("\u200B", data);


        // var lines; // used to align armies when they havent all killed the same variety of enemies  

        // for (var i = 0; i < user.armies.length; i++) {
        //     var armyData = "**__Army " + (user.armies[i].number + 1) + ":__**";
        //     // lines = 0; // used to align armies when they havent all killed the same variety of enemies  

        //     for (var j = 0; j < user.armies[i].possibleEnemies.length; j++) {
        //         var skip = false;
        //         while (user.armies[i].enemiesSlain[j] == 0)  { // skip enemies that haven't been fought
        //             j++;
        //             // lines++;
        //             if (j >= user.armies[i].enemiesSlain.length) {
        //                 skip = true;
        //                 break;
        //             }
        //         }
        //         if (skip) break;

        //         armyData += "\n" + user.armies[i].possibleEnemies[j] + ": `x" + user.armies[i].enemiesSlain[j] + "`"; // times enemy was killed
        //         user.armies[i].enemiesSlain[j] = 0; // reset enemy counter
        //     }

        //     // while (lines > 0) { // aligns all army data regardless of the amount of different enemies killed
        //     //     lines--;
        //     //     armyData += "\n";
        //     // }
            
        //     armyData += "\n\n**Earnings: **`$" + f.addComma(user.armies[i].lootGold) + "`" + // army's gold and xp earnings
        //     " | `" + f.addComma(user.armies[i].lootXP) + "xp`"; 

        //     totalGold += user.armies[i].lootGold;
        //     totalXP += user.armies[i].lootXP;
        //     // reset army stats
        //     user.armies[i].total = 0;
        //     user.armies[i].lootGold = 0;
        //     user.armies[i].lootXP = 0;

        //     lootEmbed.addField("\u200B", armyData, true);
        //     //if ((i + 1) % 2 == 0) lootEmbed.addField("\u200B", "\u200B", true); // two armies per column
        // }

        lootEmbed.addField("Total Earnings: `$" + f.addComma(totalGold) + "` | `" + f.addComma(totalXP) + "xp`", "\u200B", false);

        const xpBar = f.createProgressBar(5, 15, user.xp, user.xpToNext, ":blue_square:", totalXP); // min_length, max_length, current, goal, earnings

        if ((user.xp + totalXP).toString().length > 15 || user.xpToNext.toString().length > 15) {
            lootEmbed.addField("\u200B",
            "**Level: **" + user.userLevel + "\n" + 
            (user.xp + totalXP).toExponential(2) + "xp / " + user.xpToNext.toExponential(2) + "xp\n" + xpBar + "\n\n", true)
        }
        else {
            lootEmbed.addField("\u200B",
            "**Level: **" + user.userLevel + "\n" + 
            (user.xp + totalXP) + "xp / " + user.xpToNext + "xp\n" + xpBar + "\n\n", true)
        }

        // Update User Data
        user.balance += totalGold;
        user.xp += totalXP;

        message.reply(lootEmbed);
        if (user.xp >= user.xpToNext) f.updateLevel(user, message, Areas); // Areas is included at the top

        f.updateUser();
    }
}

console.log("OLD_LOOT.js loaded");
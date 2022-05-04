const { Areas } = require("../objects/combat");
const { botColour, client } = require("../main")
const disbut = require('discord-buttons');

const { errorHandle } = require("../functions")

const { item, trinket } = require("../objects/items")


class userEmbed {
    constructor(messageID, userID, listPosition, pages, dropsPosition) {
        this.messageID = messageID;
        this.userID = userID;
        this.listPosition = listPosition;
        this.pages = pages;
        this.dropsPosition = dropsPosition;
    }
}

//-----------------------------------------------------------------------------------------------------------------

module.exports = {
    name: "loot",
    category: "game",
    description: "Claim your stored loot earned by your armies!",
    alias: "`loot`, `l`",
    examples: ["loot", "l"],
    activeEmbeds: [],

    async execute(message, Discord, f, user) {

        const imageGuild = client.guilds.cache.get("766586576230154270");
        const images = imageGuild.emojis.cache;
        
        var embedList = [];
        var dropsPosition = user.armies.length;
        var listPosition = 0;

        const armies = user.armies;

        const contentAmount = 8;
        var pageMax = user.armies.length + Math.ceil(user.monsterDrops.length / contentAmount) + 1; // extra 1 at the end for the stats page
        
        if (user.monsterDrops.length === 0) pageMax++;

        var totalGold = 0;
        var totalXP = 0;

        // used in stat sheet
        var totalKilled = 0;


        // add up gold and xp from all armies
        for (var i = 0; i < armies.length; i++) {
            totalGold += armies[i].lootGold;
            totalXP += armies[i].lootXP;
        }


        // MONSTERS
        function monsterLootPage(armyNum) {

            let lootEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
            .setColor(botColour) // bot colour theme
            .setTitle("__Quest Loot!__")
            .setTimestamp()
            .setFooter("page " + (armyNum+1) + " of " + pageMax);


            var enemyData1 = "\u200B";
            var enemyData2 = "\u200B";

            var skip = false;


            var c_army = armies[armyNum];

            var enemyNum = 0;

            for (var i = c_army.enemiesSlain.length - 1; i >= 0; i--) { // backwards for loop to show boss enemies first

                enemyNum++;

                while (c_army.enemiesSlain[i] == 0) { 
                    i--; 

                    if (i <= 0) {
                        i = 0;
                        skip = true;
                        break;
                    }
                }

                if (skip) break;

                try {
                    var image = images.find(emoji => emoji.name === c_army.possibleEnemies[i]).toString(); 
                }
                catch(error) {
                    var image = images.find(emoji => emoji.name === "missing_texture").toString();
                }


                if (enemyNum % 2 === 0) {
                    enemyData2 = c_army.possibleEnemies[i] + " " + image + " " + " `x" + c_army.enemiesSlain[i] + "`"; 

                    lootEmbed.addField("\u200B", "\u200B", true);
                    lootEmbed.addField("\u200B", enemyData2, true);
                }
                else {
                    enemyData1 = c_army.possibleEnemies[i] + " " + image + " " + " `x" + c_army.enemiesSlain[i] + "`"; 

                    if (enemyNum === 1) {
                        var area = user.areas[c_army.invadingArea];
                        var image = f.findImage(area.level + "_"); // emojis have to be atleast 2 letters long in their name so discord adds an underscore when its only 1 character

                        lootEmbed.addField("**Army " + (c_army.number+1) + "**: " + area.name + "\u2000" + image, enemyData1, true);
                    }
                    else lootEmbed.addField("\u200B", enemyData1, true); 
                }

                totalKilled += c_army.enemiesSlain[i];

                c_army.enemiesSlain[i] = 0;

            }

            lootEmbed.addField("\u200B", "**__Army Earnings:__** `$" + (armies[armyNum].lootGold/100) + "` | `" + armies[armyNum].lootXP + "xp`");
            lootEmbed.addField("\u200B", "**__Total:__** `$" + (totalGold/100) + "` | `" + totalXP + "xp`");

            if (user.xp.toString().length > 15) {
                lootEmbed.addField("\u200B", "**Level: **" + user.userLevel + "\n" 
                + Math.round(user.xp + totalXP).toExponential(1) + "xp / " + user.xpToNext.toExponential(1) + "xp\n" + f.createProgressBar(5, 15, user.xp, user.xpToNext, "blue", totalXP));
            }
            else {
                lootEmbed.addField("\u200B", "**Level: **" + user.userLevel + "\n" 
                + f.addComma(Math.round(user.xp + totalXP)) + "xp / " + f.addComma(user.xpToNext) + "xp\n" + f.createProgressBar(5, 15, user.xp, user.xpToNext, "blue", totalXP));
            }

            armies[armyNum].lootGold = 0;
            armies[armyNum].lootXP = 0;
            armies[armyNum].total = 0;

            return lootEmbed;
        }


        // DROPS
        var dropAmount = 0; // used in stat sheet
        for (var i = 0; i < user.monsterDrops.length; i++) {
            if (user.monsterDrops[i].bonus === undefined) dropAmount += user.monsterDrops[i].amount;
            else dropAmount += user.monsterDrops[i].strength;
        }

        function dropsPage (contentShiftNum) {

            const dropEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
            .setColor(botColour)
            .setTitle("__Quest Loot!__")
            .setTimestamp()
            .setFooter("page " + ((contentShiftNum + 1) + user.armies.length) + " of " + pageMax);

            var dropNum = 1;

            var dropData1 = "\u200B";
            var dropData2 = "\u200B";


            // how this works is by making 'i' skip to a certain point in the array based on the 'contentShiftNum'
            //
            // if 'contentAmount' == 8
            // then there will be 8 drops shown per page on the embed
            // setting 'i' = 'contentShiftNum' * 'contentAmount' means that you will skip ahead of the array 8 at a time
            // and setting the condition to 'contentAmount' * ('contentShiftNum' + 1) means the loop will repeat 8 times

            for (var i = contentShiftNum * contentAmount; i < contentAmount * (contentShiftNum + 1); i++) {
                if (user.monsterDrops[i] === undefined) break;

                var drop = user.monsterDrops[i];
            

                if (dropNum % 2 === 0) {
                    if (drop.bonus === undefined) dropData2 = drop.name + " `x" + drop.amount + "`"; // if it doesnt have a bonus, its an item (show the amount)
                    else dropData2 = drop.name + " `+" + drop.strength + "`"; // if it has a bonus, its a trinket (show its strength)

                    dropEmbed.addField("\u200B", "\u200B", true);
                    dropEmbed.addField("\u200B", dropData2, true);
                }

                else {
                    if (drop.bonus === undefined) dropData1 = drop.name + " `x" + drop.amount + "`"; // if it doesnt have a bonus, its an item (show the amount)
                    else dropData1 = drop.name + " `+" + drop.strength + "`"; // if it has a bonus, its a trinket (show its strength)

                    if (i > 0) dropEmbed.addField("\u200B", dropData1, true);
                    else dropEmbed.addField("**__Drops__**", dropData1, true);
                }

                dropNum++;
            }

            return dropEmbed
        }


        // CREATING EMBEDS
        for (var i = 0; i < user.armies.length; i++) {
            embedList[embedList.length] = monsterLootPage(i);
        }

        for (var i = 0; i < Math.ceil(user.monsterDrops.length / contentAmount); i++) {
            embedList[embedList.length] = dropsPage(i);
        } 

        // if the user didnt get any drops
        if (user.monsterDrops.length === 0) {
            embedList[embedList.length] = new Discord.MessageEmbed()
            .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
            .setColor(botColour)
            .setTitle("__Quest Loot!__")
            .setTimestamp()
            .setFooter("page " + (1 + user.armies.length) + " of " + pageMax)
            .addField("**__Drops__**", "\u200B")
            .addField("\u200B", "You didn't get any drops :(")
            .addField("\u200B", "\u200B");
            // shutup I wasnt bothered to use .addFields
        }
        
        // stats page
        var lootTime = Math.floor((Date.now() - user.lastLoot) / 1000);
        var hours = Math.trunc((lootTime / 60) / 60);
        var mins = Math.floor((lootTime / 60) - (hours * 60));
        var secs = lootTime - ((mins + hours * 60) * 60);

        var timer;
        if (hours > 0) timer = hours + " hours " + mins + " minutes " + secs + " seconds";
        else if (mins > 0) timer = mins + " minutes " + secs + " seconds";
        else timer = secs + " seconds";

        if (user.lootFull != 0) { // if loot is full, show the time it took to fill 
            var f_lootTime = Math.floor((user.lootFull - user.lastLoot) / 1000);
            var f_hours = Math.trunc((f_lootTime / 60) / 60);
            var f_mins = Math.floor((f_lootTime / 60) - (f_hours * 60));
            var f_secs = f_lootTime - ((f_mins + f_hours * 60) * 60);    

            var fullTimer;
            if (f_hours > 0) fullTimer = f_hours + " hours " + f_mins + " minutes " + f_secs + " seconds";
            else if (f_mins > 0) fullTimer = f_mins + " minutes " + f_secs + " seconds";
            else fullTimer = f_secs + " seconds";

            timer += "\n**(" + fullTimer + ")**";

            user.lootFull = 0;
        }

        var avgGold = Math.round(totalGold / user.armies.length);
        var avgXP = Math.round(totalXP / user.armies.length);

        const statEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTitle("__Quest Stats!__")
        .setTimestamp()
        .setFooter("page " + pageMax + " of " + pageMax)
        .addFields(
            {name: "**Time: **", value: timer, inline: true},
            {name: "**Total killed: **", value: totalKilled, inline: true},
            {name: "**Earnings: **", value: "`$" + (totalGold/100) + "` | `" + totalXP + "xp`", inline: true},
            {name: "**Drops: **", value: "You obtained `" + dropAmount + "` monster drops!", inline: true},
            {name: "\u200B", value: "**Average gold per army: **`$" + (avgGold/100) + "`", inline: true},
            {name: "\u200B", value: "**Average xp per army: **`" + avgXP + "xp`", inline: true}

        );

        embedList[embedList.length] = statEmbed;

        // Update User Data

        // add drops and reset monsterDrops
        for (var i = 0; i < user.monsterDrops.length; i++) {
            var alreadyHas = false;

            // if it doesnt have a bonus, its an item 
            if (user.monsterDrops[i].bonus === undefined) {

                
                for (var j = 0; j < user.inventory.length; j++) {

                    if (user.monsterDrops[i].name === user.inventory[j].name) {
                        user.inventory[j].amount += user.monsterDrops[i].amount;
                        alreadyHas = true;

                        break;
                    }

                }
                if (!alreadyHas) {
                    user.inventory[user.inventory.length] = user.monsterDrops[i];
                }

            }

            else {

                for (var j = 0; j < user.trinkets.length; j++) {

                    if (user.monsterDrops[i].name === user.trinkets[j].name) {
                        user.trinkets[j].strength += user.monsterDrops[i].strength;
                        user.trinkets[j].bonus += user.monsterDrops[i].bonus;
                        alreadyHas = true;

                        break;
                    }

                }
                if (!alreadyHas) {
                    user.trinkets[user.trinkets.length] = user.monsterDrops[i];
                }

                f.addBonus(user.monsterDrops[i], user);
                
            }
        }

        // reset drops array and last loot
        user.monsterDrops = [];
        user.lastLoot = Date.now();

        // add money & xp
        user.balance += Math.round(totalGold); // truncate doesnt work to get rid of infinite decimals idk why fuck floating points
        user.xp += Math.round(totalXP);
        user.totalBalance += Math.round(totalGold)

        if (user.xp >= user.xpToNext) f.updateLevel(user, message, Areas);

        f.updateUser();



        // click menu  
        let m_enemies = new disbut.MessageMenuOption()
        .setLabel('Enemies')
        .setValue('enemies')
        .setDescription('Seek to enemies');

        let m_drops = new disbut.MessageMenuOption()
        .setLabel('Drops')
        .setValue('drops')
        .setDescription('Seek to drops');

        let m_stats = new disbut.MessageMenuOption()
        .setLabel('Stats')
        .setValue('stats')
        .setDescription('Seek to stats');

        const navigation = new disbut.MessageMenu()
        .setID('navigation')
        .addOptions(m_enemies, m_drops, m_stats)
        // .setMaxValues(2) // how many options you can select
        .setPlaceholder('Navigation');

        const navigationRow = new disbut.MessageActionRow()
        .addComponent(navigation);

        // buttons
        const nextPage = new disbut.MessageButton()
        .setID("nextPage")
        .setStyle("blurple")
        .setLabel("Next Page")
        .setDisabled(false);

        const previousPage = new disbut.MessageButton()
        .setID("previousPage")
        .setStyle("blurple")
        .setLabel("Previous Page")
        .setDisabled();

        const buttonRow = new disbut.MessageActionRow()
        .addComponent(previousPage)
        .addComponent(nextPage)

        message.channel.send({
            embed: embedList[0], 
            components: [ buttonRow, navigationRow ]
        }).then(msg => {

            const localEmbed = new userEmbed(msg.id, message.author.id, listPosition, embedList, dropsPosition);

            module.exports.activeEmbeds[module.exports.activeEmbeds.length] = localEmbed;
            
            var clearEmbed = setInterval(() => {
                const embed = module.exports.activeEmbeds[0];

                msg.components[0].components[0].setDisabled(true);
                msg.components[0].components[1].setDisabled(true);

                msg.edit({
                    embed: embed.pages[embed.listPosition], 
                    components: [ msg.components[0]]
                });

                module.exports.activeEmbeds.splice(0, 1); // deletes first item in the array (which is always the oldest)

                clearInterval(clearEmbed);
            }, 120000); // 2 minutes in ms

        }); 
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
        // MONSTERS

        // var totalGold = 0;
        // var totalXP = 0;

        // var enemyData1 = "\u200B";
        // var enemyData2 = "\u200B";

        // var totalContent = 0;
        // var isTotal = false;
        // for (var i = 0; i < user.armies.length; i++) {
        //     var enemyNum = 1;

        //     for (var j = 0; j < user.armies[i].possibleEnemies.length; j++) {

        //         if (totalContent == contentAmount) {
        //             isTotal = true;
        //             break;
        //         }

        //         // skip enemies that haven't been fought
        //         var skip = false;
        //         while (user.armies[i].enemiesSlain[j] == 0)  { 
        //             j++;
        //             if (j >= user.armies[i].enemiesSlain.length) {
        //                 skip = true;
        //                 break;
        //             }
        //         }
        //         if (skip) break;

        //         // image of enemy, can taken from one server and used in others (FIX IMMEDIATELY WHEN ENEMIES ALL HAVE IMAGES)
        //         var image;
        //         if (i > 0) { image = undefined; }
        //         else image = client.emojis.cache.find(emoji => emoji.name === user.armies[i].possibleEnemies[j]).toString(); 

        //         // get rid of check when all enemies have an image
        //         if (enemyNum % 2 == 0) {
        //             if (image == undefined) enemyData2 = user.armies[i].possibleEnemies[j] + " `x" + user.armies[i].enemiesSlain[j] + "`";
        //             else enemyData2 = image + " " + user.armies[i].possibleEnemies[j] + " `x" + user.armies[i].enemiesSlain[j] + "`"; 

        //             lootEmbed.addField("\u200B", "\u200B", true);
        //             lootEmbed.addField("\u200B", enemyData2, true);
        //         }
        //         else {
        //             if (image == undefined) enemyData1 = user.armies[i].possibleEnemies[j] + " `x" + user.armies[i].enemiesSlain[j] + "`"; 
        //             else enemyData1 = image + " " + user.armies[i].possibleEnemies[j] + " `x" + user.armies[i].enemiesSlain[j] + "`";

        //             if (i == 0 && j == 0) lootEmbed.addField("**__Monsters Slain__**", enemyData1, true); 
        //             else lootEmbed.addField("\u200B", enemyData1, true);
        //         }

        //         // spaces enemyData evenly regardless of characters in enemy name
        //         for (var k = 15; k > f.shortenString(user.armies[i].possibleEnemies[j]).length; k--) {
        //             if (enemyNum % 2 == 0) enemyData2 += "\u2800";
        //             else enemyData1 += "\u2800";
        //         }
        //         // reset the enemy's kill count
        //         user.armies[i].enemiesSlain[j] = 0;

        //         enemyNum++;
        //         totalContent++;
        //     }

        //     if (isTotal) break;
        // }

        // message.channel.send(lootEmbed);

        //     // add earnings to totalGold and totalXP
        //     totalGold += user.armies[i].lootGold;
        //     totalXP += user.armies[i].lootXP;

        //     // reset armies stats
        //     user.armies[i].total = 0;
        //     user.armies[i].lootGold = 0;
        //     user.armies[i].lootXP = 0;
        // }

        // if (enemyData1 == "\u200B") {
        //     lootEmbed.addField("\u200B", "You haven't killed anything yet!");
        // }

        // // show earnings
        // lootEmbed.addField("Total Earnings: `$" + f.addComma(totalGold) + "` | `" + f.addComma(totalXP) + "xp`", "\u200B", false);

        // // create xpBar
        // const xpBar = f.createProgressBar(5, 15, user.xp, user.xpToNext, ":blue_square:", totalXP); // min_length, max_length, current, goal, earnings

        // if ((user.xp + totalXP).toString().length > 15 || user.xpToNext.toString().length > 15) { 
        //     lootEmbed.addField("\u200B",
        //     "**Level: **" + user.userLevel + "\n" + 
        //     (user.xp + totalXP).toExponential(2) + "xp / " + user.xpToNext.toExponential(2) + "xp\n" + xpBar + "\n\n", false)
        // }
        // else {
        //     lootEmbed.addField("\u200B",
        //     "**Level: **" + user.userLevel + "\n" + 
        //     (user.xp + totalXP) + "xp / " + user.xpToNext + "xp\n" + xpBar + "\n\n", false)
        // }

        // // Update User Data
        // user.balance += totalGold;
        // user.xp += totalXP;

        // // DROPS

        // var dropData1 = "\u200B";
        // var dropData2 = "\u200B";

        // var dropNum = 1;
        // for (var i = 0; i < user.monsterDrops.length; i++) {
        //     if (isTotal) break;

        //     if (dropNum % 2 == 0) {
        //         if (user.monsterDrops[i].bonus == undefined) dropData2 = user.monsterDrops[i].name + " `x" + user.monsterDrops[i].amount + "`"; // if it doesnt have a bonus, its an item (show the amount)
        //         else dropData2 = user.monsterDrops[i].name + " `x" + user.monsterDrops[i].strength + "`"; // if it has a bonus, its a trinket (show its strength)

        //         lootEmbed.addField("\u200B", "\u200B", true);
        //         lootEmbed.addField("\u200B", dropData2, true);
        //     }
        //     else {
        //         if (user.monsterDrops[i].bonus == undefined) dropData1 = user.monsterDrops[i].name + " `x" + user.monsterDrops[i].amount + "`"; // if it doesnt have a bonus, its an item (show the amount)
        //         else dropData1 = user.monsterDrops[i].name + " `x" + user.monsterDrops[i].strength + "`"; // if it has a bonus, its a trinket (show its strength)

        //         if (i > 0) lootEmbed.addField("\u200B", dropData1);
        //         else lootEmbed.addField("**__Items Acquired__**", dropData1, true);
        //     }

        //     // add drops to trinkets or inventory
        //     var alreadyHas = false;

        //     // items
        //     for (var j = 0; j < user.inventory.length; j++) {
        //         if (user.monsterDrops[i].name == user.inventory[j].name) {
        //             user.inventory[j].amount += user.monsterDrops[i].amount;

        //             alreadyHas = true;
        //             break;
        //         }
        //     }

        //     // trinkets
        //     for (var j = 0; j < user.trinkets.length; j++) {
        //         if (user.monsterDrops[i].name == user.trinkets[j].name) {
        //             user.trinkets[j].strength += user.monsterDrops[i].strength;
        //             user.trinkets[j].bonus += user.monsterDrops[i].bonus;

        //             alreadyHas = true;
        //             break;
        //         }
        //     }

        //     if (user.monsterDrops[i].bonus == undefined && alreadyHas == false) {
        //         user.inventory[user.inventory.length] = user.monsterDrops[i];
        //     }
        //     else if (alreadyHas == false) {
        //         user.trinkets[user.trinkets.length] = user.monsterDrops[i];
        //     }

        //     dropNum++;
        // }
        // user.monsterDrops = [];

        // f.updateUser();

        // if (user.xp >= user.xpToNext) f.updateLevel(user, message, Areas); // Areas is included at the top

        // // reply with embed and add reactions
        // message.reply(lootEmbed)
    }
}



client.on("clickButton", async (button) => {   
    const activeEmbeds = module.exports.activeEmbeds;

    var embed;

    for (var i = 0; i < activeEmbeds.length; i++) {
        if (activeEmbeds[i].messageID === button.message.id) {
            embed = activeEmbeds[i];
            break;
        }
    }


    if (embed != undefined && button.clicker.id === embed.userID) {
        try {

            if (button.id === 'nextPage') {
                embed.listPosition++;
            }
            else if (button.id === 'previousPage') {
                embed.listPosition--;
            }
            

            if ((embed.listPosition + 1) >= embed.pages.length) {
                button.message.components[0].components[1].setDisabled(true);
                embed.listPosition = embed.pages.length - 1;
            }
            else button.message.components[0].components[1].setDisabled(false);
        
            if ((embed.listPosition - 1) < 0) {
                button.message.components[0].components[0].setDisabled(true);
                embed.listPosition = 0;
            }
            else button.message.components[0].components[0].setDisabled(false);



            button.message.update({ 
                embed: embed.pages[embed.listPosition], 
                components: [ button.message.components[0], button.message.components[1] ]
            })

        }catch (error) {
            errorHandle(error, button.clicker.user.username, button.message.content)
    
            button.message.channel.send("<@" + button.clicker.id + ">there was an error! \nThe error has been logged!\n");
        }
    }
})



client.on("clickMenu", async (menu) => {
    const activeEmbeds = module.exports.activeEmbeds;

    var embed;

    for (var i = 0; i < activeEmbeds.length; i++) {
        if (activeEmbeds[i].messageID === menu.message.id) {
            embed = activeEmbeds[i];
            break;
        }
    }


    if (embed != undefined && menu.clicker.id === embed.userID) {
        try {
            if (menu.values[0] === 'drops') {
                embed.listPosition = embed.dropsPosition;

                if ((embed.listPosition + 1) >= embed.pages.length) menu.message.components[0].components[1].setDisabled(true);
        
                menu.message.components[0].components[0].setDisabled(false);
                menu.message.components[0].components[1].setDisabled(false);
            }

            else if (menu.values[0] === 'enemies') {
                embed.listPosition = 0;
                menu.message.components[0].components[0].setDisabled(true);
                menu.message.components[0].components[1].setDisabled(false);
            }

            else if (menu.values[0] === 'stats') {
                embed.listPosition = embed.pages.length - 1;
                menu.message.components[0].components[0].setDisabled(false);
                menu.message.components[0].components[1].setDisabled(true);
            }

            menu.message.update({ 
                embed: embed.pages[embed.listPosition], 
                components: [ menu.message.components[0], menu.message.components[1] ]
            })

        }catch (error) {
            errorHandle(error, menu.clicker.user.username, menu.message.content)
    
            menu.message.channel.send("<@" + menu.clicker.id + ">there was an error! \nThe error has been logged!\n");
        }
    }
})

console.log("loot.js loaded");
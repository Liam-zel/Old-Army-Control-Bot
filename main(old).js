/*
The army control bot is a more rpg version of the zen garden from pvz, where you can have multiple armies
who you can upgrade to get stronger.

basics:
-start command --DONE
-single army --DONE
-you can send armies off to kill mobs and earn money / xp --DONE
-army can level up and get stronger --DONE
-money can buy equipment for army --DONE
-money can sell equipment (must have been very tired when i wrote this) --DONE
-raid bosses with different fighting mechancis than normal monsters
-buy extra armies --DONE
-prestige
-rebalance to make gear give garanteed wins

AFTER BASICS:
- add little images before each item / enemy (maybe)
- make a thumbnail for shop, battle etc.
- kill count for enemies (probably not)
- mastery for enemies, enemies are much tougher at start but each kill of that 
  specific enemy increases the winchance against that enemy
- Acheivements with rewards?
- Boss drops (add new array just for boss drops and they can't be sold)
- BOSS MUSIC (bot can join vc and play boss music) (not likely)
- Higher level armies have bonuses



THINKING OF REDOING COMBAT:
rather than sending troops and armies, make the bot an idle bot where the troops instead rack up bounty money over time from killing enemies
REASON: the current battle feature and everything supporting it just isn't fun or satisfying
*/

//===========================================================================================

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.data = require("./data.json"); 
var _UserNum = fs.readFileSync('./UserNum.txt', 'utf8');
var hasAccount = false;
var profileNum;
const maxArmies = 6; // SUBJECT TO CHANGE (maybe)

var randomColor = Math.floor(Math.random()*16777215).toString(16); // random Embed colour

let prefix = '+';

client.login('ODEyNjc0MzM4MTEyMjc0NDUz.YDEL9A.t39rKXi8RSKm27UUkwWqKSj3pkE');

const q_cooldown = new Set();

//===========================================================================================

class monster {
    constructor(eName, goldEarn, xpEarn, winChance, winResistance, tag) {
        this.eName = eName;
        this.goldEarn = goldEarn;
        this.xpEarn = xpEarn;
        this.winChance = winChance;
        this.winResistance = winResistance;
        this.tag = tag;
    }
}
// Monsters
// forest                      NAME        GOLD  XP    WINCHANCE    WINRES   TAG
var rock  = new monster     ( "Rock",       1,   1,      85.0,       0.0,    "");
var stick = new monster     ( "Stick",      1,   1,      85.0,       0.0,    "");
var bird  = new monster     ( "Bird",       2,   1,      75.5,       0.0,    "");
var worm  = new monster     ( "Worm",       3,   1,      70.0,       0.0,    "");
var bush  = new monster     ( "Bush",       3,   2,      50.0,       0.0,    "");
var tree  = new monster     ( "Tree",       5,   5,      20.0,       0.0,    "[BOSS]");
var wolf  = new monster     ( "Wolf",      25,  15,       5.0,       1.0,    "[MEGA BOSS]");

// caves
var bat      = new monster  ( "Bat",        3,   1,      80.0,       0.1,    "");
var scorpion = new monster  ( "Scorpion",   3,   1,      74.5,       0.1,    "");
var spider   = new monster  ( "Spider",     5,   3,      50.0,       0.1,    "");
var batHorde = new monster  ( "Bat horde",  7,   4,      45.6,       0.2,    "");
var skeleton = new monster  ( "Skeleton",  10,   7,      20.0,       1.5,    "[BOSS]");
var bear     = new monster  ( "Bear",      10,   7,       5.0,       2.5,    "[MEGA BOSS]");

// Areas
var area1 = [rock, stick, bird, worm, bush, tree, wolf];
var area2 = [bat, scorpion, spider, batHorde, skeleton, bear];

// Array of every Area
var Areas = [area1, area2];

//===========================================================================================

class item {
    constructor(i_name, i_multiChance, i_multiMin, i_multiMax, i_winIncrease, tier, tag, buyValue, sellValue) {
        this.i_name = i_name;
        this.i_multiChance = i_multiChance;
        this.i_multiMin = i_multiMin;
        this.i_multiMax = i_multiMax;
        this.i_winIncrease = i_winIncrease;
        this.tier = tier;
        this.tag = tag;
        this.buyValue = buyValue;
        this.sellValue = sellValue;
    }
}
//                                NAME              MULTICHANCE     MULTIMIN     MULTIMAX    WIN-INC     TIER      TAG          BUY     SELL (buyValue / 3)   
var leatherGloves = new item ( "Leather Gloves",        0.25,         0.10,        0.20,       0.20,      1,      "hand",        30,     0 );
var bronzeGreaves = new item ( "Bronze Greaves",        0.25,         0.10,        0.30,       0.25,      1,      "foot",        40,     0 ); 
var bronzeHelmets = new item ( "Bronze Helmets",        0.35,         0.25,        0.40,       0.35,      1,      "head",        50,     0 ); 
var bronzeArmour  = new item ( "Bronze Armour",         0.40,         0.30,        0.45,       0.50,      1,      "chest",       60,     0 ); 
//                                                      1.25          0.75         1.35        1.30                             180 
var ironGauntlets = new item ( "Iron Gauntlets",        0.35,         0.25,        0.45,       0.30,      2,      "hand",        85,     0 );
var ironGreaves   = new item ( "Iron Greaves",          0.45,         0.25,        0.55,       0.45,      2,      "foot",       100,     0 ); 
var ironHelmets   = new item ( "Iron Helmets",          0.50,         0.35,        0.65,       0.55,      2,      "head",       120,     0 );
var ironArmour    = new item ( "Iron Armour",           0.60,         0.45,        0.80,       0.65,      2,      "chest",      160,     0 );
//                                                      1.90          1.30         2.45        1.95                             475 

var items = [leatherGloves, bronzeGreaves, bronzeHelmets, bronzeArmour, ironGauntlets, ironGreaves, ironHelmets, ironArmour];

for (var i = 0; i < items.length; i++) {
    items[i].sellValue = Math.ceil(items[i].buyValue / 3);
}

//===========================================================================================

client.on("ready", ()=> {
    console.log('bot on');
})

client.on("message", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;



    // =================================================== MISCELLANIOUS ===================================================



    // FIND CLIENT POSITION IN ARRAY
    if (message.content.startsWith(prefix)) {
        hasAccount = false;
        for (var i = 0; i < client.data.users.length; i++) {
            if (client.data.users[i].userID == message.author.id) { profileNum = i; hasAccount = true;}
        }
        if (!message.content.startsWith(prefix + "start") && !hasAccount) { message.reply('you need to make an account to do this! type "' + prefix + 'start" to get started!'); return; }
    }
    const user = client.data.users[profileNum];
    randomColor = Math.floor(Math.random()*16777215).toString(16); // random Embed colour
    
    // START
    if (message.content.startsWith(prefix + "start") && !hasAccount) {
        client.data.users[_UserNum] = {
            username: message.author.username,
            userID: message.author.id,
            balance: 0,
            winIncrease: 0.0,
            multiChance: 0,
            multiMin: 1.5,
            multiMax: 2,
            hand: "",
            foot: "",
            head: "",
            chest: "",            
            inventory: [],
            armies: [
                {
                    number: 0,
                    level: 1,
                    xp: 0,
                    xpToNext: 15,
                    attack: "",
                    defense: "",
                    item: ""
                }
            ]
        }
        _UserNum++;
        fs.writeFileSync('./UserNum.txt', _UserNum);

        client.data.userNum = _UserNum

        fs.writeFile("./data.json", JSON.stringify(client.data, null, 4), err => {
            if (err) throw err;
            message.channel.send("Account created!");
        });
    }

    // PROFILE
    // UPDATE WHEN MORE DATA IS STORED
    if (message.content.startsWith(prefix + "p")) {
        var profileData = "**Balance: **$" + user.balance + 
        "\n**Armies: **" + user.armies.length;
        
        if (user.hand != "") profileData += "\n **Hand: **" + user.hand + " **Tier: **" + user.hand.tier;
        if (user.foot != "") profileData += "\n **Foot: **" + user.foot + " **Tier: **" + user.foot.tier;
        if (user.head != "") profileData += "\n **Head: **" + user.head + " **Tier: **" + user.head.tier;
        if (user.chest != "") profileData += "\n **Chest: **" + user.chest + " **Tier: **" + user.chest.tier;

        var profileEmbed = new Discord.MessageEmbed()
        .setThumbnail(message.author.avatarURL())
        .setColor(randomColor)
        .setAuthor(message.author.username + "#" + message.author.discriminator)
        .addField("\u200B", profileData, false);

        message.channel.send(profileEmbed);
    }



// =================================================== FIGHTING ===================================================

    

    // ARMIES
    if (message.content.startsWith(prefix + "a")) {
        const armiesEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username);

        var armyData1 = "\u200B";
        var armyData2 = "\u200B";
        var armyData3 = "\u200B";
        var notMax = false;
        
        for (var i = 0; i < user.armies.length; i++) {
            var xpProgress = Math.floor((user.armies[i].xp / user.armies[i].xpToNext) * 5);
            var xpBar = "";
            for (var j = 1; j <= 5; j++) { 
                if (j <= xpProgress) xpBar += ":blue_square:";
                else xpBar += ":white_large_square:";
            }

            if ((i+1) % 3 == 0) {
                armyData3 += "\n\n**Army #" + (i+1) + 
                "**\n **Level:** " + user.armies[i].level + 
                "\n**XP:** " + user.armies[i].xp + 
                "\n**Attack:** " + user.armies[i].attack + 
                "\n**Defense:** " + user.armies[i].defense + 
                "\n" + xpBar;
            }
            else if ((i+1) % 3 >= 2) {
                armyData2 += "\n\n**Army #" + (i+1) + 
                "**\n **Level:** " + user.armies[i].level + 
                "\n**XP:** " + user.armies[i].xp + 
                "\n**Attack:** " + user.armies[i].attack + 
                "\n**Defense:** " + user.armies[i].defense + 
                "\n" + xpBar;
            }
            else {
                armyData1 += "\n\n**Army #" + (i+1) + 
                "**\n **Level:** " + user.armies[i].level + 
                "\n**XP:** " + user.armies[i].xp + 
                "\n**Attack:** " + user.armies[i].attack + 
                "\n**Defense:** " + user.armies[i].defense + 
                "\n" + xpBar;
            }
        }

        armiesEmbed.addField("Armies: ", armyData1, true);
        armiesEmbed.addField("\u200B", armyData2, true);
        armiesEmbed.addField("\u200B", armyData3, true);

        var slotPrice = 250; // 1 slot = $500
        for (var i = 0; i < user.armies.length; i++) {
            slotPrice *= 2;
        }

        armiesEmbed.addField("\u200B","\u200B");
        armiesEmbed.addField("Next slot price: ", "$" + slotPrice);

        if (notMax) armiesEmbed.addField("\u200B", "**buy the next slot using the slot command!**\n" + prefix + "slot\n\n")

        message.channel.send(armiesEmbed);
    }


    // QUEST
    if (message.content.startsWith(prefix + "send")) {
        var q_army;
        var validArmy = false;
        for (var i = 0; i < user.armies.length; i++) {
            if (message.content.startsWith(prefix + "send " + (i+1)))  { q_army = user.armies[i]; validArmy = true; }
        }

        if (!validArmy) { message.reply("That's not a valid army!\n" + prefix + "send <army number>"); return; }

        if (q_cooldown.has(q_army)) {
            message.reply("This army is resting, wait a bit!"); 
            return;
        }

        q_cooldown.add(q_army);
        var q_CDtimer = setInterval(function() {
            q_cooldown.delete(q_army);
            clearInterval(q_CDtimer);
        }, 60000); // 1 min

        var q_xp = 0;
        var gold = 0;
        var hasLost = false;
        var killer = null;
        var encounters = [];
        var timesEncountered = [];
        var totalSlain = 0;

        const questEmbed = new Discord.MessageEmbed()
        .setColor("DC143C")
        .setTitle("Quest Over! ");

        // Goes through each area
        var encounterNum = 3;
        for (var i = 0; i < Areas.length; i++) {
            if ((i + 1) % 2 == 0) encounterNum++; // Increases encounters when fulfilled

            // Encounters
            for (var j = 0; j < encounterNum; j++) {
                // choose enemy
                do {
                    var enemy = Areas[i][Math.floor(Math.random() * Areas[i].length)]; 
                } while (enemy.tag != "" && j != encounterNum - 1);

                
                if (j == 0 && i == 0) enemy.winChance = 100.0;
                // Win
                if (Math.random() * 100 <= (enemy.winChance + (user.winIncrease - enemy.winResistance))) {
                    totalSlain++;
                    var multi;

                    var hasEncountered = false;
                    for (var k = 0; k < encounters.length; k++) {
                        if (encounters[k].eName == enemy.eName) {
                            timesEncountered[k]++;
                            hasEncountered = true;
                            break;
                        }
                    }

                    if (!hasEncountered) {
                        timesEncountered[encounters.length] = 1;
                        encounters[encounters.length] = enemy;
                    }

                    if (Math.random() * 100 <= user.multiChance) {
                        multi = (Math.random() * (user.multiMax - user.multiMin) + user.multiMin); // returns random number between multiMin - multiMax
                        multi.toFixed(2); // cuts off decimals beyond the 2nd decimal point

                        gold += enemy.goldEarn * Math.ceil(multi);
                        q_xp += enemy.xpEarn * Math.ceil(multi);
                        for (var k = 0; k < encounters.length; k++) {
                            if (encounters[k] == enemy) timesEncountered[k] = Math.ceil(multi);
                        }
                        totalSlain += Math.ceil(multi); // already did totalSlain++, nice one
                    }
                    else {
                        gold += enemy.goldEarn;
                        q_xp += enemy.xpEarn;
                    }
                }

                // Lose
                else {
                    hasLost = true;
                    killer = enemy;
                    break;
                }
            }
            if (hasLost) break;
        }

        // Create Embed
        var enemyList = "";
        for (var i = 0; i < encounters.length; i++) {
            if (encounters[i].tag != "") enemyList += "**" + encounters[i].tag + "** " + encounters[i].eName + " x" + timesEncountered[i] + "\n";
            else enemyList += encounters[i].eName + " x" + timesEncountered[i] + "\n";
        }
        if (enemyList == "") enemyList = "\u200B"; // wont happen because first enemy is a garuanteed kill, nice one
        questEmbed.addField("Foes Slain: " + totalSlain, "\n" + enemyList);

        if (hasLost) {
            questEmbed.addField("\u200B", "\u200B", false);
            
            if (enemy.tag == "") questEmbed.addField("The enemy that slayed you", enemy.eName, false);
            else questEmbed.addField("The enemy that slayed you", "**" + killer.tag + "** " + killer.eName, false);
        }

        questEmbed.setAuthor(message.author.username); // User 
        questEmbed.addField("\u200B", "**Gold earned: **$" + gold + "\n**XP earned: **" + q_xp, false);

        // updates balance
        user.balance += gold;

        // updates army level
        var armyPos;
        for (var i = 0; i < user.armies.length; i++) {
            if (q_army == user.armies[i]) armyPos = i;
        }

        user.armies[armyPos].xp += q_xp;
        while (user.armies[armyPos].xp >= user.armies[armyPos].xpToNext) {
            // update level & xp
            user.armies[armyPos].level++;
            user.armies[armyPos].xp -= user.armies[armyPos].xpToNext;
            user.armies[armyPos].xpToNext *= 1.25;
            user.armies[armyPos].xpToNext = Math.floor(user.armies[armyPos].xpToNext);

            // update stats
            if (user.armies[armyPos].level % 10 == 0) { 
                user.winIncrease += 0.4; 
                user.multiMin += 0.5; 
                user.multiMax += 0.75;
            }
            else if (user.armies[armyPos].level % 5 == 0) { 
                user.winIncrease += 0.2; 
                user.multiMin += 0.25; 
                user.multiMax += 0.35;
            }
            else { 
                user.winIncrease += 0.1; 
                user.multiMax += 0.1;
            }

            user.multiChance += 0.25; // pretty small and useless tbh, nice one

            if (Math.floor(Math.random() * 2) == 0) user.armies[armyPos].attack += "+";
            else user.armies[armyPos].defense += "+";
        }

        // write to JSON
        fs.writeFile("./data.json", JSON.stringify(client.data, null, 4), err => {
            if (err) throw err;
        });

        // Send Embed
        message.channel.send(questEmbed);
    }



// =================================================== ECONOMY ===================================================



    // SHOP
    if (message.content.startsWith(prefix + "shop")) {
        var validPage = false;
        var s_pages = Math.ceil(items.length / 4);
        var shopEmbed = new Discord.MessageEmbed()
        .setColor(randomColor)
        .setTitle("Shop");

        for (var i = 1; i <= s_pages; i++) {
            if (message.content.startsWith(prefix + "shop " + i) || message.content == prefix + "shop") {
                shopEmbed.setFooter("Page " + i + " of " + s_pages);
                shopEmbed.setAuthor(message.author.username); // User 
                var stock1 = "\u200B\n";
                var stock2 = "\u200B\n";

                for (var j = 0; j < 4; j++) { // displays the 1 - 4 items on specified page
                    var s_item = items[j + 4 * (i - 1)];
                    if (s_item == undefined) break;
                    if (j % 2 == 0) stock1 += "**" + s_item.i_name + "** \n$" + s_item.buyValue + "\n Tier: " + s_item.tier + "\n\n";
                    else stock2 += "**" + s_item.i_name + "** \n$" + s_item.buyValue + "\n Tier: " + s_item.tier + "\n\n";
                }

                shopEmbed.addField("Balance: $" + user.balance, stock1, true);
                shopEmbed.addField("\u200B ", stock2, true);

                message.channel.send(shopEmbed);
                validPage = true;
                break;
            }
        }
        if (!validPage) message.reply(prefix + "buy <page number>")
    }

    // BUY
    if (message.content.startsWith(prefix + "b")) {
        var foundItem = false;
        for (var i = 0; i < items.length; i++) {
            if (message.content.startsWith(prefix + "buy " + items[i].i_name)) {
                if (user.balance >= items[i].buyValue) {
                    var buyEmbed = new Discord.MessageEmbed()
                    .setTitle("You Bought " + items[i].i_name + " for $" + items[i].buyValue)
                    .setColor(randomColor);

                    user.balance -= items[i].buyValue;

                    buyEmbed.addField("\u200B", "Your new balance is: $" + user.balance, false)
                    buyEmbed.setAuthor(message.author.username);

                    user.inventory[user.inventory.length] = items[i];

                    // write to JSON
                    fs.writeFile("./data.json", JSON.stringify(client.data, null, 4), err => {
                        if (err) throw err;
                    });

                    foundItem = true;
                    message.channel.send(buyEmbed)
                    break;
                }
                else {
                    message.reply("You don't have enough money to buy that!\n **Balance**: $" + user.balance);
                    foundItem = true;
                    break;
                }
            }
        }
        if (!foundItem) message.reply("Thats not a valid item! " + prefix  + "buy <Item Name> (item names are cap sensitive)");
    }

    // SELL
    if (message.content.startsWith(prefix + "sell")) {
        var foundItem = false;
        for (var i = 0; i < user.inventory.length; i++) {
            if (message.content.startsWith(prefix + "sell " + user.inventory[i].i_name)) {
                var sellEmbed = new Discord.MessageEmbed()
                .setTitle("You Sold " + user.inventory[i].i_name + " for $" + user.inventory[i].sellValue)
                .setColor(randomColor);

                user.balance += user.inventory[i].sellValue;

                sellEmbed.addField("\u200B", "Your new balance is: $" + user.balance, false)
                sellEmbed.setAuthor(message.author.username); // User 

                user.inventory.splice(i, 1);

                // write to JSON
                fs.writeFile("./data.json", JSON.stringify(client.data, null, 4), err => {
                    if (err) throw err;
                });

                foundItem = true;
                message.channel.send(sellEmbed)
                break;
            }
        }
        if (!foundItem) message.reply("Thats not a valid item! " + prefix  + "sell <Item Name> (item names are cap sensitive)");
    }

    // SLOT
    if (message.content.startsWith(prefix + "slot")) {
        var armyNum = user.armies.length;

        if (user.armies.length == maxArmies) {
            message.reply("You already have the max amount of armies!");
            return;
        }

        var slotPrice = 250; // 1 slot = $500
        for (var i = 0; i < user.armies.length; i++) {
            slotPrice *= 2;
        }


        var slotEmbed = new Discord.MessageEmbed()
        .setColor(randomColor)
        .setTitle("Purchase a new army slot!");

        if (user.balance < slotPrice) {
            slotEmbed.setDescription("You don't have enough money!");
            slotEmbed.addField("\u200B", "**Balance: **$" + user.balance + "\n**Slot Price: **$" + slotPrice);
            message.channel.send(slotEmbed);
            return;
        }
        slotEmbed.setDescription(user.balance + " - $" + slotPrice);
        user.balance -= slotPrice;

        user.armies[user.armies.length] = {
            number: armyNum,
            level: 1,
            xp: 0,
            xpToNext: 15,
            attack: "",
            defense: "",
            item: ""
        }

        // write to JSON
        fs.writeFile("./data.json", JSON.stringify(client.data, null, 4), err => {
            if (err) throw err;
        });

        slotEmbed.addField("\u200B","**Balance: **$" + user.balance);
        message.channel.send(slotEmbed);
    }


// =================================================== GEAR ===================================================



    // EQUIP
    if (message.content.startsWith(prefix + "e")) {
        var foundItem = false;
        for (var i = 0; i < user.inventory.length; i++) {
            if (message.content.startsWith(prefix + "e " + user.inventory[i].i_name) || message.content.startsWith(prefix + "equip " + user.inventory[i].i_name)) {

                var equipEmbed = new Discord.MessageEmbed()
                .setColor(randomColor)
                .setAuthor(message.author.username)
                .addField("Equipped:", user.inventory[i].i_name, false);

                function findItem(equipmentSlot) {
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].i_name == equipmentSlot.i_name) {
                            user.multiChance -= items[j].i_multiChance;
                            user.multiMin -= items[j].i_multiMin;
                            user.multiMax -= items[j].i_multiMax;
                            user.winIncrease -= items[j].i_winIncrease;

                            equipEmbed.addField("Unequipped:", items[j].i_name, false);

                            user.inventory[user.inventory.length] = items[j];
                            break;
                        }
                    }
                }

                // add in proper slot
                switch(user.inventory[i].tag) {
                case "hand":
                    if (!user.hand == "") findItem(user.hand)
                    user.hand = user.inventory[i];
                    break;
                case "foot":
                    if (!user.hand == "") findItem(user.foot) // if user.hand? nice one Liam
                    user.foot = user.inventory[i];
                    break;
                case "head":
                    if (!user.hand == "") findItem(user.head)
                    user.head = user.inventory[i];
                    break;
                case "chest":
                    if (!user.hand == "") findItem(user.chest)
                    user.chest = user.inventory[i];
                    break;
                }

                user.multiChance += user.inventory[i].i_multiChance;
                user.multiMin += user.inventory[i].i_multiMin;
                user.multiMax += user.inventory[i].i_multiMax;
                user.winIncrease += user.inventory[i].i_winIncrease

                message.channel.send(equipEmbed);
                foundItem = true;

                user.inventory.splice(i, 1);

                // write to JSON
                fs.writeFile("./data.json", JSON.stringify(client.data, null, 4), err => {
                    if (err) throw err;
                });
            }
            if (foundItem) break;
        }
        if (!foundItem) message.reply("Thats not a valid item!\n" + prefix  + "equip <Item Name> (item names are cap sensitive)")
    }
})
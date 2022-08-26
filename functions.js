const Discord = require('discord.js');
var client = require('./main.js')

const o = require('./objects/combat.js');


const p = require('./palletes.js');
const fs = require('fs');

const idleData = require("./data/idleData.json");
client.data = require("./data/data.json"); 

// CREATE ARMY
function createArmy(armyNum) {
    var army = {
        number: armyNum,
        invadingArea: 0,
        lootGold: 0,
        lootXP: 0,
        possibleEnemies: [],
        enemiesSlain: [],
        total: 0
    }

    for (var i = 0; i < o.Areas[army.invadingArea].monsters.length; i++) {
        army.possibleEnemies[i] = o.Areas[army.invadingArea].monsters[i].eName;

        army.enemiesSlain[i] = 0;
    }

    return army;
}

// CREATE AREA
function createArea(areaNum) {
    var area = { 
        name: o.Areas[areaNum].name,
        upgradeCost: o.Areas[areaNum].upgradeCost,
        level: 0,
        miniBoss: false,
        megaBoss: false,
        isMaxed: false,
        multiplier: 1.0
    } 

    return area;
}

// UPDATE INVADING AREA
function updateInvadingArea(armyNum, areaNum) {
    var army = {
        number: armyNum,
        invadingArea: areaNum,
        lootGold: 0,
        lootXP: 0,
        possibleEnemies: [],
        enemiesSlain: [],
        total: 0
    }

    for (var i = 0; i < o.Areas[areaNum].monsters.length; i++) {
        army.possibleEnemies[i] = o.Areas[areaNum].monsters[i].eName;

        army.enemiesSlain[i] = 0;
    }

    return army;   
}

// UPDATE USER
function updateUser() { // OPTIMIZATION: JSON.stringify(client.data) gets rid of spacing which speeds things up by a considerable amount (although less readable, so only do if necessary)
    fs.writeFile("./data/data.json", JSON.stringify(client.data, null, 4), err => {
        if (err) throw err;
    });
}

// UPDATE IDLE
function updateIdle() { // OPTIMIZATION: JSON.stringify(idleData) gets rid of spacing which speeds things up by a considerable amount (although less readable, so only do if necessary)
    fs.writeFile("./data/idleData.json", JSON.stringify(idleData, null, 1), err => {
        if (err) throw err;
    });
}

// TRUNCATE
function truncate(x, precision) {
    var a;
    a = Math.pow(10, precision)

    return Math.floor(x * a) / a; 
}

// MONEYTRUNC
function moneyTrunc(x) {
    x *= 100
    x = Math.floor(x)

    return x;
}

// CREATE PROGRESS BAR
function createProgressBar(min_Length, max_length, current, goal, barColour, earnings) {
    var { client } = require("./main.js");

    var barLength = min_Length;

    const imageGuild = client.guilds.cache.get("766586576230154270");
    const images = imageGuild.emojis.cache;

    var startF, middleF, endF;
    var startE, middleE, endE;

    var g_start, g_middle, g_end;

    // xp
    if (barColour === "blue") {
        // full
        startF = images.find(emoji => emoji.name === "xpFullStart").toString(); 
        middleF = images.find(emoji => emoji.name === "xpFullMiddle").toString();
        endF = images.find(emoji => emoji.name === "xpFullEnd").toString();  

        // empty
        startE = images.find(emoji => emoji.name === "xpEmptyStart").toString(); 
        middleE = images.find(emoji => emoji.name === "xpEmptyMiddle").toString(); 
        endE = images.find(emoji => emoji.name === "xpEmptyEnd").toString(); 

        // green
        g_start = images.find(emoji => emoji.name === "greenStart").toString(); 
        g_middle = images.find(emoji => emoji.name === "greenMiddle").toString(); 
        g_end = images.find(emoji => emoji.name === "greenEnd").toString(); 
    }

    // monster kills
    else if (barColour === "red") {
        // full
        startF = images.find(emoji => emoji.name === "redFullStart").toString(); 
        middleF = images.find(emoji => emoji.name === "redFullMiddle").toString();
        endF = images.find(emoji => emoji.name === "redFullEnd").toString();  

        // empty
        startE = images.find(emoji => emoji.name === "redEmptyStart").toString(); 
        middleE = images.find(emoji => emoji.name === "redEmptyMiddle").toString(); 
        endE = images.find(emoji => emoji.name === "redEmptyEnd").toString(); 
    }


    if (current.toString().length > max_length) current = current.toExponential(2);
    if (goal.toString().length > max_length) goal = goal.toExponential(2);

    // Change bars length to fit the length of xpToNext
    for (var i = max_length; i > min_Length; i--) { // First time ive used a loop like this
        if (goal.toString().length % i == 0) { // awful but I wasnt bothered to think of a better way other than converting it to a string
            barLength = i;
            break;
        }
    }

    var progress = Math.floor((current / goal) * barLength); // divides the data into barLength sectors (i.e barlength == 5, bar == [][][][][])
    var barString = ""; // holds the emojis that will be used as the bar

    // if the earnings variable isnt declared, simply state how much progress has already been made
    if (earnings === undefined) {
        for (var i = 1; i <= barLength; i++) { 
            // full
            if (i === 1 && i <= progress) barString += startF;
            else if (i != barLength && i <= progress) barString += middleF;
            else if (i <= progress) barString += endF;

            // empty
            else if (progress < i && i === 1) barString += startE;
            else if (progress < i && i != barLength) barString += middleE;
            else barString += endE;
            
        }
    }
    
    // if the earnings variable is declared (for XP giving commands)
    else {
        // // funny story, I was always getting bugs when resting and training, it would always use the barcoulour and never make the green if statement go off
        // // turns out I was giving the progress as (user.xp + reward) the entire time. This could have been a much more readable working function
        // // and I could have ruined it by horrendously over-engineering it for no reason :)

        var progDecimal = (current / goal) * barLength - Math.floor(progress);

        // var barEarnings = Math.round(((earnings + (progDecimal - Math.floor(progDecimal))) / goal) * barlength); 


        // 1: progDecimal - Math.floor(progress);   I just need the decimals so I chop off the whole number
        // 2: earings + progDecimal;    If I used the raw earnings,it wouldn't work as I need to include the current progress in the closest white sector
        var barEarnings = (earnings / goal) * barLength + progDecimal;

        for (var i = 1; i <= barLength; i++) {
            // if (i <= progress) barString += barColour;
            // else if (i <= progress + barEarnings) barString += ":green_square:";
            // else barString += ":white_large_square:";

            // full
            if (i === 1 && i <= progress) barString += startF;
            else if (i != barLength && i <= progress) barString += middleF;
            else if (i <= progress) barString += endF;

            // progress
            else if (i <= progress + barEarnings && i === 1) barString += g_start;
            else if (i <= progress + barEarnings && i != barLength) barString += g_middle;
            else if (i <= progress + barEarnings && i === barLength) barString += g_end;

            // empty
            else if (progress < i && i === 1) barString += startE;
            else if (progress < i && i != barLength) barString += middleE;
            else barString += endE;
        }
    }

    return barString;
}

// FIND USER
function findUser(message, prefix, findNum) {
    // FIND CLIENT POSITION IN ARRAY
    var hasAccount = false;
    var profileNum = undefined;
    for (var i = 0; i < client.data.users.length; i++) {
        if (client.data.users[i].userID == message.author.id) { profileNum = i; hasAccount = true; }
    }

    if (findNum == true) return profileNum;

    if (!hasAccount && !message.content.startsWith(prefix + "start")) return false; // so people without accounts dont crash the bot

    const user = client.data.users[profileNum];
    return user;
}

// FIND IDLE
function findIdle(message, prefix, findNum) {
    // FIND CLIENT POSITION IN ARRAY
    var hasAccount = false;
    var idleNum = undefined;
    for (var i = 0; i < idleData.users.length; i++) {
        if (idleData.users[i].userID == message.author.id) { idleNum = i; hasAccount = true; }
    }

    if (findNum == true) return idleNum;

    if (!hasAccount && message.content != prefix + "start") return false; // so people without accounts dont crash the bot

    const user = idleData.users[idleNum];
    return user;
}

// RANDOM COLOUR
function randomColor() {
    var randomColor = Math.floor(Math.random()*16777215).toString(16); // random Embed colour
    return randomColor;
}

// ADD COMMA
function addComma(x) {
    if (!Number.isSafeInteger(x)) { // for exponentials
        return x;
    }

    var isNegative = false;
    if (x < 0) {
        x *= -1;
        isNegative = true;
    }

    // 100000 == 100,000
    x = x.toString();
    for (var i = x.length; i > 0; i--) {
        if ((i - (x.length + 1)) % 4 == 0) { 
            x = [x.slice(0, i), ',', x.slice(i)].join(''); // definitely understand what this does
        }
    }

    if (!isNegative) return x;
    else return "-" + x;
}

// UPDATE LEVEL
function updateLevel(user, message, Areas) {
    const levelEmbed = new Discord.MessageEmbed()
    .setColor(p.goldPallete()); // random gold colour

    var levelAmount = 0;
    var multiTotal = 0;

    let levelScaling = 0

    while (user.xp >= user.xpToNext) {
        user.xp -= user.xpToNext;
        levelAmount++;
        user.userLevel++;
        user.xpToNext = Math.ceil(user.xpToNext * 1.5);

        levelScaling += (user.userLevel) / 2

        // every 10 levels = +36% multi
        if (user.userLevel % 10 == 0) {
            multiTotal += 0.15
        }
        else if (user.userLevel % 5 == 0) { 
            multiTotal += 0.05
        }
        else {
            multiTotal += 0.02
        }
    }

    // adds gold on level based on strongest enemy
    let enemyPos = Areas[user.armies.length -1].monsters.length - 1;
    let enemy = Areas[user.armies.length - 1].monsters[enemyPos]; 

    let goldReward = Math.round(enemy.goldEarn * 10 * levelScaling); // note: Enemy earnings is stored in cents
    
    

    // embed field
    levelEmbed.addField("**You Leveled up __" + levelAmount + "__ times!** [lvl " + (user.userLevel) + "]", // bold because mobile doesnt do it by default
    "*Multiplier bonus* | " + (truncate(user.multiplier + multiTotal, 2)) + "x  **[+" + truncate(multiTotal, 2) + "x]**" +
    "\n\n*Reward* | **$" + (goldReward/100) + "**", false);

    user.multiplier += multiTotal;

    user.balance += goldReward;
    user.totalBalance += Math.round(goldReward)

    user.multiplier = truncate(user.multiplier, 2);

    message.reply(levelEmbed);
    updateUser();
}

// SHORTEN STRING
function shortenString(x) {
    var charMax = 15;
    x = x.toString();

    if (x.length > charMax) {
        if (x.startsWith("__")) charMax += 4; // accounts for the underscores used in tags for bosses

        x = x.slice(x[x.length], charMax);
        x += ".. ";
    }

    return x;
}

// CALCULATE AVERAGE EARNINGS
function calculateAverageEarnings(armyNum, enemyLimit, Areas, xp) {
    var chances = [0.305, 0.25, 0.194, 0.139, 0.083, 0.028];
    var avg = 0;

    for (var i = 0; i < Areas[armyNum].monsters.length; i++) {
        if (xp) avg += (enemyLimit * chances[i]) * Areas[armyNum].monsters[i].xpEarn; // xp average

        else avg += (enemyLimit * chances[i]) * Areas[armyNum].monsters[i].goldEarn; // gold average
    }

    return truncate(avg, 3);
}

// ADD BONUS
function addBonus(trinket, user) {
    // var falloff = 0.8;

    // var currentStrength = 0;

    // for (var i = 0; i < user.trinkets.length; i++) {
    //     if (trinket.name === user.trinkets[i].name) {
    //         currentStrength = user.trinkets[i].strength;
    //         break;
    //     }
    // }

    var trinketPos;

    for (var i = 0; i < user.trinkets.length; i++) {
        if (trinket.name === user.trinkets[i].name) {
            trinketPos = i;
            break;
        }
    }

    switch(trinket.bonusType) {
        
        case "Army kills":

            // if the falloff == 0.8, this and the current strength == 5
            // falloff ^ 5 == 0.32768, multiplying the bonus by this should catch the bonus up 
            //var bonus = trinket.bonus * Math.pow(falloff, currentStrength);
            
            // for (var i = 0; i < currentStrength + trinket.strength; i++) {
            //     bonus += Math.round(bonus * falloff);

            //     console.log(bonus);

            //     if (bonus >= trinket.max) {
            //         bonus = trinket.max;
            //         break;
            //     }
            // }

            user.trinkets[trinketPos].bonus += trinket.bonus * (trinket.strength - 1);
            user.enemyLimit += trinket.bonus * trinket.strength;
        break;
    }

    //return Math.round(trinket.previousBonus);
}


// ERROR HANDLE
function errorHandle(error, username, message) {
    console.log(error)

    var errorLog = require("./data/errorLog.json")

    var errorString = error.toString();

    // lovely code I made myself
    var caller_line = error.stack.split("\n")[1];
    var index = caller_line.indexOf("at");
    var errorLine = caller_line.slice(index + 3, caller_line.length);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    var errorNum = errorLog.errors.length;

    errorLog.errors[errorNum] = {
        date: today,
        message: errorString,
        line: errorLine,
        command: message.content,
        user: username
    }

    fs.writeFile("./errorLog.json", JSON.stringify(errorLog, null, 4), err => {
        if (err) throw err;
    });
}



// FIND IMAGE
function findImage(string) {
    var { client } = require("./main.js");
    const imageGuild = client.guilds.cache.get('766586576230154270'); // Test Server
    const images = imageGuild.emojis.cache;

    try {
        var image = images.find(emoji => emoji.name === string).toString();  
    }
    catch (error) {
        var image = images.find(emoji => emoji.name === "missing_texture").toString();  
    }    

    return image;
}

function checkDrops(enemy, user, multiplier) {

    for (let i = 0; i < enemy.drops.length; i++) {
        if (Math.random() * 100 < enemy.dropRates[i] + (user.armyEfficiency/4)) {

            let exists = false;

            // Item
            if (enemy.drops[i].strength === undefined) { // checks to see if drop is an item (no defined strength)

                // I have to set these values to 1, as editing the amount (such as stacking them in the users inventory)
                // edits the actual object's amount
                enemy.drops[i].amount = 1;

                // stack item if already in inventory
                for (let j = 0; j < user.monsterDrops.length; j++) { // 4 layers of for loops, cool
                    if (enemy.drops[i].name == user.monsterDrops[j].name) {
                        user.monsterDrops[j].amount += Math.round(multiplier + (user.armyEfficiency - 1));
                        exists = true;
                    }
                }
                if (!exists) {
                    user.monsterDrops[user.monsterDrops.length] = enemy.drops[i];

                    user.monsterDrops[user.monsterDrops.length - 1].amount *= Math.round(multiplier);
                    user.monsterDrops[user.monsterDrops.length - 1].amount += user.armyEfficiency -1;

                }
            }

            // Trinket
            else { // if the drop isnt from the item class, must be a trinket

                // I have to set these values to 1, as editing the amount (such as stacking them in the users inventory)
                // edits the actual object's amount

                enemy.drops[i].strength = 1;

                // checks if trinket is already in monsterDrops[] and stacks it if so
                for (let j = 0; j < user.monsterDrops.length; j++) {
                    if (user.monsterDrops[j].name == enemy.drops[i].name) {
                        user.monsterDrops[j].strength += Math.round(multiplier + (user.armyEfficiency - 1));

                        exists = true; 
                    }

                }
                // else, add it to monsterDrops[]
                if (!exists) {
                    user.monsterDrops[user.monsterDrops.length] = enemy.drops[i];

                    user.monsterDrops[user.monsterDrops.length - 1].strength *= Math.round(multiplier); 
                    user.monsterDrops[user.monsterDrops.length - 1].strength += user.armyEfficiency - 1;

                }

            }
        }
    } 
}


// EXPORTS
module.exports = {createArmy, createArea, updateInvadingArea, updateUser, 
                updateIdle,  truncate, moneyTrunc, createProgressBar, findUser, findIdle, randomColor, 
                addComma, updateLevel, shortenString, calculateAverageEarnings, addBonus, errorHandle, 
                findImage, checkDrops};
/*
TODO:
- buy / sell (not sure if needed yet)
- raid boss
- side tasks
- ways for members to interact with eachother
- reinforce trinkets (upgrading them)
- change item objects to store their functions there and not activate them on 'use' command (although use command allows for more control)
- have a better start account message, maybe an embed with a little artwork on it
- fix trinkets
- make area level ups actually do something
- update inventory command with buttons


COLOUR: #ecf23f (lime)

INVITE LINK: https://discord.com/oauth2/authorize?client_id=812674338112274453&scope=bot&permissions=1342491737
*/


//===========================================================================================

var prefix = '+';

const Discord = require('discord.js');

// const client = new Discord.Client({ 
//     intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INVITES"], 
//     partials: ["CHANNEL"] 
// });

const client = new Discord.Client();

const fs = require('fs'); 
const f = require('./functions.js');
const o = require('./objects.js');
const p = require('./palletes.js')

const { Areas } = require("./objects.js")

const botColour = "#98c200"; // Lime


module.exports = {prefix, client, botColour};



client.data = require("./data.json"); 

const idleData = require("./idleData.json"); 

const feedbackList = require("./feedbackList.json");

const errorLog = require("./errorLog.json");                

var randomColor = Math.floor(Math.random()*16777215).toString(16); // random Embed colour

client.login('ODEyNjc0MzM4MTEyMjc0NDUz.YDEL9A.TKfyBIygQmJSM0M23FiOjwCWQ9U');

// load commands into collection
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

require('discord-buttons')(client);
const { MessageActionRow, MessageButton } = require('discord-buttons');

//===========================================================================================


client.on("ready", ()=> {
    console.log("\nBot online!")


    client.user.setPresence({
        status: "online",
        activity: {
            name: "+start to get started! or +help for help!",
            type: "PLAYING"
        }
    });
})


var Guilds = client.guilds.cache.map(guild => guild.id);
// var xpAVG = 0;
// var goldAVG = 0;
// for (var i = 0; i < 3; i++) {
//     xpAVG += f.calculateAverageEarnings(i, 25, o.Areas, true);
//     goldAVG += f.calculateAverageEarnings(i, 25, o.Areas, false);
// }

// console.log(xpAVG + "xp\n$" + goldAVG);

// NOTE: weekly and daily integers can go negative without a problem
var oneSecond = setInterval(function() {  
    for (var i = 0; i < client.data.users.length; i++) {
        client.data.users[i].weekly--;
        client.data.users[i].daily--;
    }


    
    // var images = ["https://cdn.discordapp.com/attachments/565414700377047059/937006284752969738/F9D44A17-924F-463E-BBAF-A9029B2DF0A6.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937006084617564190/8DAFBBD3-AF0D-43E2-86AB-4536C961CA4F.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937006029680554025/A76DE962-7260-4161-AEFE-A8102B860523.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937005938714484766/A587430D-7E92-42D1-8A1B-F359D4475FD4.jpg"
    // , "https://cdn.discordapp.com/attachments/565414700377047059/937005881613254677/IMG_0783.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937005881369964575/IMG_0801.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937005881114124329/IMG_0802.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937005880812113931/IMG_0803.jpg"
    // , "https://cdn.discordapp.com/attachments/565414700377047059/937005880602423326/IMG_0804.jpg", "https://cdn.discordapp.com/attachments/565414700377047059/937005451156013176/unknown.png"
    // ]
    // client.users.cache.get('707542668116492399').send(images[Math.floor(Math.random() * images.length)]);
    // console.log("sent")


}, 1000); // 1000ms = 1 second



// shitty backup system that probably wont work because when a json has corrupted and is empty it just crashes the bot
var backup = setInterval(() => {
    // upload backup
    if (client.data == undefined) {
        var backup = require("./backup.txt")

        fs.writeFile(client.data, JSON.stringify(backup, null, 1), err => {
            if (err) throw err;
        }); 
    }


    // write to backup file
    fs.writeFile("backup.txt", JSON.stringify(client.data, null, 1), err => {
        if (err) throw err;
    });
}, 30000) // 30 secs


// IDLE
var idle = setInterval(async function() {

    console.time("idle");

    for (var i = 0; i < client.data.users.length; i++) {
        // const userIdle = idleData.users[i];
        const user = client.data.users[i];

        for (var j = 0; j < user.armies.length; j++) {
            var skip = false;

            while (user.armies[j].total >= user.enemyLimit)  { // Skip armies that have reached a limit
                j++; 
                if (user.armies[j] == undefined) {
                    skip = true;
                    if (user.lootFull === 0) user.lootFull = Date.now();
                    break;
                }
            }
            if (skip) break; // Skips user if all of their armies are at capacity

            var army = user.armies[j];
            var invadePos = army.invadingArea;

            let enemyPos = Math.floor(Math.abs(Math.random() - Math.random()) * Areas[invadePos].monsters.length) 
            /* No idea how it works, but it makes it so the higher the number, the lower the chance
            In this specific case, the chances SHOULD be around:
            enemy 1: 30.5%
            enemy 2: 25%
            enemy 3: 19.4%
            enemy 4: 13.9%
            enemy 5: 8.3%
            enemy 6: 2.8%
            */

            const enemy = Areas[invadePos].monsters[enemyPos];
            
            // Update stats
            var multiplier = user.multiplier;
            army.lootGold += Math.round(enemy.goldEarn * user.armyEfficiency * multiplier);
            army.lootXP += Math.round(enemy.xpEarn * user.armyEfficiency); // multiplier doesnt affect xp

            army.enemiesSlain[enemyPos] += user.armyEfficiency;
            army.total += user.armyEfficiency; 

            // scrapped having enemies be multiplied, but kept here because holy shit
            //user.armies[j].enemiesSlain[enemyPos] += (Math.floor(1 * multiplier)); // am I fucking stupid
            //user.armies[j].total += Math.floor(1 * multiplier); // I DID IT TWICE

            
            // Drops 
            for (var k = 0; k < enemy.drops.length; k++) {
                if (Math.random() * 100 < enemy.drops[k].dropRate) {
                    var exists = false;

                    // I have to set these values to 1, as editing the amount (such as stacking them in the users inventory)
                    // edits the actual object's amount

                    // NOTE: there shouldnt be any problems if you just make it when you get a drop that doesnt already exist in the
                    // inventory, the amount isnt '*=' but '= 1 *' ( e.g user.monsterDrops[user.monsterDrops.length - 1].amount = 1 * Math.round(multiplier) )
                    if (enemy.drops[k].bonus === undefined) { // has to be an item if it has no bonus
                        enemy.drops[k].amount = 1;
                    }
                    else enemy.drops[k].strength = 1;

                    // Item
                    if (enemy.drops[k] instanceof o.item) { // checks to see if drop is from the item class

                        for (var x = 0; x < user.monsterDrops.length; x++) { // 4 layers of for loops, cool
                            if (enemy.drops[k].name == user.monsterDrops[x].name) {
                                user.monsterDrops[x].amount += Math.round(multiplier + (user.armyEfficiency - 1));
                                exists = true;
                            }
                        }
                        if (!exists) {
                            user.monsterDrops[user.monsterDrops.length] = enemy.drops[k];

                            user.monsterDrops[user.monsterDrops.length - 1].amount *= Math.round(multiplier);
                            user.monsterDrops[user.monsterDrops.length - 1].amount += user.armyEfficiency -1;

                        }
                    }

                    // Trinket
                    else { // if the drop isnt from the item class, must be a trinket
                        // checks if trinket is already in monsterDrops[] and stacks it if so
                        for (var x = 0; x < user.monsterDrops.length; x++) {
                            if (user.monsterDrops[x].name == enemy.drops[k].name) {
                                user.monsterDrops[x].strength += Math.round(multiplier + (user.armyEfficiency - 1));

                                exists = true; 
                            }

                        }
                        // otherwise, add it to monsterDrops[] (and for some reason we dont care about multis or army efficiency)
                        if (!exists) {
                            user.monsterDrops[user.monsterDrops.length] = enemy.drops[k];

                            user.monsterDrops[user.monsterDrops.length - 1].strength *= Math.round(multiplier); 
                            user.monsterDrops[user.monsterDrops.length - 1].strength += user.armyEfficiency - 1;

                        }

                    }
                }
            } 
        }
    }
    console.timeEnd("idle");

    f.updateUser();

}, 2500); // Default 2500ms (2.5 seconds)


//===================================================================================================================

client.on("message", async (message) => {

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    if (message.channel instanceof Discord.DMChannel) return;

    const user = f.findUser(message, prefix);
    const userIdle = f.findIdle(message, prefix);
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    // completely ripped from the internet and not even in a file idc
    if (command === "start") {
        var hasAccount = false;
        for (var i = 0; i < client.data.users.length; i++) {
            if (client.data.users[i].userID == message.author.id) return;
        }
        client.commands.get("start").execute(message, args, f, client, Discord);
        return;
    }

    if (user === undefined) { // So users without an account dont crash the bot
        message.reply("You need an account to do that!\n do: `" + prefix + "start` to create an account!");
        return;
    } 


    try {
        if (command === "loot" || command === "l") {
            client.commands.get("loot").execute(message, args, Discord, f, user, client);
        }
        else if (command === "upgrade" || command === "up") {
            client.commands.get("upgrade").execute(message, args, Discord, f, o, user, userIdle);
        }
        else if (command === "prestige") {
            client.commands.get("prestige").execute(message, args, Discord, f, user, client);
        }
        else if (command === "help") {
            client.commands.get("help").execute(message, args, Discord, f, client.commands, prefix, client)
        }
        else if (command === "profile" || command === "p") {
            client.commands.get("profile").execute(message, args, Discord, f, user, client.data);
        }
        else if (command === "gift") {
            client.commands.get("gift").execute(message, args, Discord, f, user, client.data);
        }
        else if (command === "train") {
            client.commands.get("train").execute(message, args, Discord, f, o, user);
        }
        else if (command.startsWith("venture") || command.startsWith("ven")) {
            client.commands.get("venture").execute(message, args, Discord, f, user, client);
        }
        else if (command === "feedback") {
            client.commands.get("feedback").execute(message, args, feedbackList, fs);
        }
        else if (command === "use") {
            client.commands.get("use").execute(message, args, f, user);
        }
        else if (command === "army" || command === "a") {
            client.commands.get("army").execute(message, args, Discord, f, user);
        }
        else if (command === "invite") { // keep above inventory to be checked first
            client.commands.get("invite").execute(message, args, Discord, f, client.user.displayAvatarURL()); 
        }
        else if (command.startsWith("inventory") || command.startsWith("inv")) {
            if (command.startsWith("inventory") && message.content.slice(11)) var pageNum = parseInt(message.content.slice(11));
            else if (command.startsWith("inv") && message.content.slice(5)) var pageNum = parseInt(message.content.slice(5));
            else var pageNum = 1;
            
            client.commands.get("inventory").execute(message, args, Discord, f, user, pageNum, client); 
        }
        else if (command === "rest") {
            client.commands.get("rest").execute(message, args, Discord, f, o, user);
        }
        else if (command === "sell") {
            client.commands.get("sell").execute(message, args, Discord, user);
        }
        else if (command.startsWith("trinkets") || command.startsWith("tr")) {
            if (command.startsWith("trinkets") && message.content.slice(10)) var pageNum = parseInt(message.content.slice(10));
            else if (command.startsWith("tr") && message.content.slice(4)) var pageNum = parseInt(message.content.slice(4));
            else var pageNum = 1;

            client.commands.get("trinkets").execute(message, args, Discord, f, user, pageNum); 
        }
        else if (command.startsWith("assign") || command.startsWith("ass")) {
            var isAssign = false;
            if (message.content.split(" ").length > 1) isAssign = true; // if theres more than 1 element its an assign

            client.commands.get("assign").execute(message, args, Discord, f, client, user, isAssign); 
        }
        else if (command === "leaderboard" || command === "lb") {
            client.commands.get("leaderboard").execute(message, args, Discord, f, client, user); 
        }
        else if (command === "daily") {
            client.commands.get("daily").execute(message, args, Discord, f, o, user); 
        }
        else if (command === "weekly") {
            client.commands.get("weekly").execute(message, args, Discord, f, o, user); 
        }
        else if (command === 'ping') {  
            client.commands.get("ping").execute(message, args, client); 

        }
        // else if (command === 'trade') {  
        //     client.commands.get("trade").execute(message, args, Discord, user, client); 
        // }
        else if (command === "uptime") {
            client.commands.get("uptime").execute(message, args, Discord, client);
        }
    }




    // logs errors with info to help fix and prevents bot from crashing during an error
    catch (error) {
        f.errorHandle(error, user.username, message.content)

        message.reply("there was an error! \nThe error has been logged!\n");
    }


});


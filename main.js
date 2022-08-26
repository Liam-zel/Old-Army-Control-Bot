/*
COLOUR: #ecf23f (lime)

INVITE LINK: https://discord.com/oauth2/authorize?client_id=812674338112274453&scope=bot&permissions=1342491737
*/


//===========================================================================================

var prefix = '+';

const Discord = require('discord.js');  
//     intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INVITES"], 
//     partials: ["CHANNEL"] 
// });

const client = new Discord.Client();

const fs = require('fs'); 
const f = require('./functions.js');
var o = require('./objects/combat.js');
const p = require('./unused/palletes.js')

var Areas = o.Areas;
// o.loadObjects().then(loaded => {
//     o = loaded
//     Areas = o.Areas;
// })

const botColour = "#98c200"; // Lime


module.exports = {prefix, client, botColour};


client.data = require("./data/data.json"); 
const idleData = require("./data/idleData.json"); 
const feedbackList = require("./data/feedbackList.json");
const errorLog = require("./data/errorLog.json");                

var randomColor = Math.floor(Math.random()*16777215).toString(16); // random Embed colour

client.login('ODEyNjc0MzM4MTEyMjc0NDUz.GATSDg.2I-tiROqWR7QN2pFvJCYfVFH3O2vrbzaEUIhcY');

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


    let ts2 = client.guilds.cache.get('777787396833542185');
    let todo = ts2.channels.cache.get('988050684425424956');    
    let messages = todo.messages.fetch({ limit: 20 }).then(msgCollection => {

        let wordNum = 0;

        msgCollection.forEach(message => {
            let words = message.content.split(" ")

            for (let i = 0; i < words.length; i++) {

                if (words[i].includes('<:cross:911257876268474479>')) {
                    wordNum++;
                }
            }
        });

        let botmsg = msgCollection.first()
        botmsg.edit(wordNum + " tasks left")
    })
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
        var backup = require("./data/backup.txt")

        fs.writeFile(client.data, JSON.stringify(backup, null, 1), err => {
            if (err) throw err;
        }); 
    }


    // write to backup file
    fs.writeFile("./data/backup.txt", JSON.stringify(client.data, null, 1), err => {
        if (err) throw err;
    });
}, 30000) // 30 secs


// IDLE
var idle = setInterval(async function() {

    console.time("idle");

    for (let i = 0; i < client.data.users.length; i++) {
        // const userIdle = idleData.users[i];
        const user = client.data.users[i];

        for (let j = 0; j < user.armies.length; j++) {
            let skip = false;

            // Skip armies that have reached a limit
            while (user.armies[j].total >= user.enemyLimit)  { 
                j++; 
                if (user.armies[j] == undefined) {
                    skip = true;
                    if (user.lootFull === 0) user.lootFull = Date.now();
                    break;
                }
            }
            if (skip) break; // Skips user if all of their armies are at capacity

            const army = user.armies[j];
            const invadePos = army.invadingArea;

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

            // moves enemy to next strongest enemy if boss or mini boss isnt unlocked
            if (user.areas[invadePos].megaBoss == false && enemyPos == 5) enemyPos--;
            if (user.areas[invadePos].miniBoss == false && enemyPos == 4) enemyPos--;

            const enemy = Areas[invadePos].monsters[enemyPos];


            // Update stats =========
            const multiplier = user.multiplier;
            if (user.areas[invadePos].isMaxed) multiplier *= 1.5;

            army.lootGold += Math.round(enemy.goldEarn * Math.round(user.armyEfficiency/2) * multiplier);
            army.lootXP += Math.round(enemy.xpEarn * user.armyEfficiency); // multiplier doesnt affect xp

            army.enemiesSlain[enemyPos] += user.armyEfficiency;
            army.total += user.armyEfficiency; 
            

            // Drops  =========
            f.checkDrops(enemy, user, multiplier)
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

    const user = f.findUser(message, prefix, false);
    const userIdle = f.findIdle(message, prefix);
    
    // completely ripped from the internet and not even in a file idc
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (user === false) { // So users without an account dont crash the bot
        message.reply("You need an account to do that!\n do: `" + prefix + "start` to create an account!");
        return;
    } 

    try {
        // LOOT
        if (command === "loot" || command === "l") {
            client.commands.get("loot").execute(message, Discord, f, user, client);
        }
        // UPGRADE
        else if (command === "upgrade" || command === "up") {
            client.commands.get("upgrade").execute(message, Discord, f, o, user, userIdle);
        }
        // PRESTIGE
        else if (command === "prestige") {
            client.commands.get("prestige").execute(message, Discord, f, user, client);
        }
        // HELP
        else if ((command === "help" || command === "h") || (command === "commands" || command === "c")) {
            client.commands.get("help").execute(message, Discord, f, client.commands, client)
        }
        // PROFILE
        else if (command === "profile" || command === "p") {
            client.commands.get("profile").execute(message, Discord, f, user, client.data);
        }   
        // GIFT
        else if (command === "gift") {
            client.commands.get("gift").execute(message, Discord, f, user, client.data);
        }
        // TRAIN
        else if (command === "train") {
            client.commands.get("train").execute(message, Discord, f, o, user);
        }
        // VENTURE
        else if (command === "venture" || command === "ven") {
            client.commands.get("venture").execute(message, Discord, f, user, client);
        }
        // USE
        else if (command === "use") {
            client.commands.get("use").execute(message, f, o, user);
        }
        // INVITE
        else if (command === "invite") { 
            client.commands.get("invite").execute(message, Discord, f, client.user.displayAvatarURL()); 
        }
        // INVENTORY
        else if (command === "inventory" || command === "inv") {            
            client.commands.get("inventory").execute(message, Discord, f, user); 
        }
        // REST
        else if (command === "rest") {
            client.commands.get("rest").execute(message, Discord, f, o, user);
        }
        // ARMY
        else if (command === "army" || command === "a") {
            client.commands.get("army").execute(message, Discord, f, user);
        }
        // SELL
        else if (command === "sell") {
            client.commands.get("sell").execute(message, Discord, f, user);
        }
        // TRINKETS
        else if (command === "trinkets" || command === "tr") {
            if (command.startsWith("trinkets") && message.content.slice(10)) var pageNum = parseInt(message.content.slice(10));
            else if (command.startsWith("tr") && message.content.slice(4)) var pageNum = parseInt(message.content.slice(4));
            else var pageNum = 1;

            client.commands.get("trinkets").execute(message, Discord, f, user, pageNum); 
        }
        // ASSIGN (ASS)
        else if (command === "assign" || command === "ass") {
            var isAssign = false;
            if (message.content.split(" ").length > 1) isAssign = true; // if theres more than 1 element its an assign

            client.commands.get("assign").execute(message, Discord, f, client, user, isAssign); 
        }
        // LEADERBOARD
        else if (command === "leaderboard" || command === "lb") {
            client.commands.get("leaderboard").execute(message, Discord, f, client, user); 
        }
        // MONSTER
        else if (command === "monster" || command === "mob") {
            client.commands.get("monster").execute(message, Discord, f, o); 
        }
        // ITEM
        else if (command === "item") {
            client.commands.get("item").execute(message, Discord, f, o, command); 
        }

        // DAILY
        else if (command === "daily") {
            client.commands.get("daily").execute(message, Discord, f, o, user); 
        }
        // WEEKLY
        else if (command === "weekly") {
            client.commands.get("weekly").execute(message, Discord, f, o, user); 
        }
        // PING
        else if (command === 'ping') {  
            client.commands.get("ping").execute(message, client); 

        }
        // UPTIME
        else if (command === "uptime") {
            client.commands.get("uptime").execute(message, Discord, client);
        }
        // FEEDBACK
        else if (command === "feedback") {
            client.commands.get("feedback").execute(message, feedbackList, fs);
        }
        // else if (command === 'trade') {  
        //     client.commands.get("trade").execute(message, Discord, user, client); 
        // }
        
        // ADMIN COMMANDS -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        // REMOVE
        else if ((command === "remove" || command === "re") && message.author.id === "461059264388005889") { // my id :)
            client.commands.get("remove").execute(message, client, f);
        }
        // LEVELUP
        else if ((command === "levelup" || command === "lu") && message.author.id === "461059264388005889") { // my id :)
            client.commands.get("levelup").execute(message, client, f);
        }
        // GIVE
        else if ((command === "give" || command === "g") && message.author.id === "461059264388005889") { // my id :)
            client.commands.get("give").execute(message, client, f);
        }
        else if ((command === "accounts" || command === "acc") && message.author.id === "461059264388005889") { // my id :)
            client.commands.get("accounts").execute(message, Discord, client);
        }
        else if ((command === "admin") && message.author.id === "461059264388005889") { // my id :)
            client.commands.get("admin").execute(message, Discord, client.commands);
        }
        else if ((command === "error") && message.author.id === "461059264388005889") { // my id :)
            client.commands.get("error").execute(message, f);
        }

        // START
        else if (command === "start") {
            var hasAccount = false;
            for (var i = 0; i < client.data.users.length; i++) {
                if (client.data.users[i].userID == message.author.id) return;
            }
            client.commands.get("start").execute(message, f, client, Discord);
            return;
        }
    }




    // logs errors with info to help fix and prevents bot from crashing during an error
    catch (error) {
        f.errorHandle(error, user.username, message.content)

        message.reply("there was an error! \nThe error has been logged!\n");
    }


});


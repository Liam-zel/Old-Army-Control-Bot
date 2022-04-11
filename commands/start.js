const { Areas } = require("../objects.js");
const { botColour, prefix} = require("../main.js");

module.exports = {
    name: "start",
    category: "game",
    description: "Register your account!",
    alias: "`start`",
    examples: ["start"],
    execute(message, f, client, Discord, idleData) {
        // account creation date
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        
        var newdate = day + "/" + month + "/" + year;


        client.data.users[client.data.users.length] = {
            username: message.author.username,
            userID: message.author.id,
            daily: 43200, // Half a day in seconds
            weekly: 43200, // Half a day in seconds as I dont want them to wait a whole week instantly
            createdAt: newdate,
            multiplier: 1.00,
            armyEfficiency: 1,
            efficiencyLevel: 0,
            storageLevel: 0,
            enemyLimit: 10, // ENEMY LIMIT --------
            balance: 0,  
            totalBalance: 0,
            totalXP: 0,
            userLevel: 1,  
            xp: 0,
            xpToNext: 50, // XPTONEXT -------- 
            prestigeNum: 0,
            prestigeCoins: 0,
            lastLoot: Date.now(),
            lootFull: 0,
            inventory: [],
            trinkets: [],
            armies: [f.createArmy(0)],
            areas: [f.createArea(0)],
            monsterDrops: []
        }

        // idleData.users[idleData.users.length] = {
        //     userID: message.author.id,
        //     armies: [f.createArmy(0)],
        //     monsterDrops: []
        // }


        const startEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp()
        .setTitle(":crossed_swords: **__Welcome to Army Control Bot!__** :crossed_swords:")
        .setDescription(
        "Slay a ton of enemies and gather many armies in this idle game!" + "\n" + 
        "To see a list of commands and find info about them, type: `" + prefix + "help`" + "\n" +
        "To see info about a specific command and it's uses, type: `" + prefix + "help [command name]`" + "\n\n" + 
        "\u25CF Even when youre offline, your armies kill enemies and gather gold and experience!" + "\n" + 
        "\u25CF Use `" + prefix + "profile` to see your profile and other stats!" + "\n" +
        "\u25CF Use `" + prefix + "loot` to reap all your rewards!" + "\n" +
        "\u25CF Money can be used on many upgrades and other things!" + "\n"
        )
        .setFooter("This bot is WIP, use the feedback command to give feedback or report bugs")
        .setImage(client.user.displayAvatarURL());


        f.updateUser();
        // f.updateIdle();

        message.channel.send(startEmbed);
    }
}

console.log("start.js loaded");
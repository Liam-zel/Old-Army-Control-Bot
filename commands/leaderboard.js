const { botColour, client } = require("../main");
const disbut = require('discord-buttons');
const { errorHandle } = require("../functions");


class userEmbed {
    constructor(messageID, userID, pages) {
        this.messageID = messageID;
        this.userID = userID;
        this.pages = pages;
    }
}


//=================================================================================

module.exports = {
    name: "leaderboard",
    category: "general",
    description: "Look at the highest levels across all servers!",
    alias: "`lb`",
    examples: ["leaderboard"],
    activeEmbeds: [],

    execute(message, Discord, f, client, user) {

        class account {
            constructor(name, level, totalBalance) {
                this.name = name;
                this.level = level;
                this.totalBalance = totalBalance;
            }
        }

        var accounts = []

        for (var i = 0; i < client.data.users.length; i++) {
            accounts[i] = new account(client.data.users[i].username, client.data.users[i].userLevel, client.data.users[i].totalBalance);   
        } 

        accounts.sort((a, b) => b.level - a.level);

        // level leaderboard ================================================
        const levelBoardEmbed = new Discord.MessageEmbed()
        .setColor(botColour) 
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setTimestamp();
        
        var boardData = "";

        for (var i = 0; i < 10; i++) {
            // I just gave up at this point, adds users level and username to a string which is the field for levelBoardEmbed
            if (accounts[i] == undefined) break;
            else if (i == 0) boardData += "**:trophy: " + (i + 1) + "st: **`level " + accounts[i].level + "` - " + accounts[i].name + "\n";
            else if (i == 1) boardData += "**:second_place: " + (i + 1) + "nd: **`level " + accounts[i].level + "` - " + accounts[i].name + "\n";
            else if (i == 2) boardData += "**:third_place: " + (i + 1) + "rd: **`level " + accounts[i].level + "` - " + accounts[i].name + "\n";
            else boardData += "**:white_small_square: " + (i + 1) + ": **`level " + accounts[i].level + "` - " + accounts[i].name + "\n";
        }

        levelBoardEmbed.addField("**__Level leaderboard__**", boardData, false);

        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].name == message.author.username) {
                if (i == 0) { levelBoardEmbed.addField("\u200B", message.author.username + "'s rank: :trophy:**" + (i + 1) + "**", false); break; }
                else { levelBoardEmbed.addField("\u200B", "Your rank: **" + (i + 1) + "**", false); break; }
            }
        }


        // balance leaderboard ================================================

        accounts.sort((a, b) => b.totalBalance - a.totalBalance);

        const balanceBoardEmbed = new Discord.MessageEmbed()
        .setColor(botColour) 
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setTimestamp();
        
        for (var i = 0 ;i < accounts.length; i++) {
            accounts[i].totalBalance = f.addComma(accounts[i].totalBalance);
        }

        boardData = "";

        for (var i = 0; i < 10; i++) {
            // I just gave up at this point, adds users level and username to a string which is the field for balanceBoardEmbed
            if (accounts[i] == undefined) break;
            else if (i == 0) boardData += "**:trophy: " + (i + 1) + "st: **`$" + accounts[i].totalBalance + "` - " + accounts[i].name + "\n";
            else if (i == 1) boardData += "**:second_place: " + (i + 1) + "nd: **`$" + accounts[i].totalBalance + "` - " + accounts[i].name + "\n";
            else if (i == 2) boardData += "**:third_place: " + (i + 1) + "rd: **`$" + accounts[i].totalBalance + "` - " + accounts[i].name + "\n";
            else boardData += "**:white_small_square: " + (i + 1) + ": **`$" + accounts[i].totalBalance + "` - " + accounts[i].name + "\n";
        }

        balanceBoardEmbed.addField("**__Total Balance leaderboard__**", boardData, false);

        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].name == message.author.username) {
                if (i == 0) { balanceBoardEmbed.addField("\u200B", message.author.username + "'s rank: :trophy:**" + (i + 1) + "**", false); break; }
                else { balanceBoardEmbed.addField("\u200B", "Your rank: **" + (i + 1) + "**", false); break; }
            }
        }

        // buttons
        const levelButton = new disbut.MessageButton()
        .setID("level")
        .setStyle("blurple")
        .setLabel("Level leaderboard")
        .setDisabled(true);

        const balanceButton = new disbut.MessageButton()
        .setID("balance")
        .setStyle("blurple")
        .setLabel("Total Balance leaderboard")
        .setDisabled(false);

        const leaderboardRow = new disbut.MessageActionRow()
        .addComponent(levelButton)
        .addComponent(balanceButton)


        const pages = [levelBoardEmbed, balanceBoardEmbed];

        message.channel.send({
            embed: levelBoardEmbed, 
            component: leaderboardRow
        }).then(msg => {

            const localEmbed = new userEmbed(msg.id, message.author.id, pages);

            module.exports.activeEmbeds[module.exports.activeEmbeds.length] = localEmbed;

            // clear embed meaning you cant interact with it later by getting rid of the button
            var clearEmbed = setInterval(() => {

                msg.edit({
                    embed: msg.embeds[0],
                    component: msg.components[0]
                });

                module.exports.activeEmbeds.splice(0, 1); // deletes first item in the array (which is always the oldest)

                clearInterval(clearEmbed);
            }, 120000); // 2 minutes in ms

        }); 
    }
}


// BUTTON -----------------------------------------
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

            if (button.id === "level") {
                button.message.components[0].components[0].setDisabled(true);
                button.message.components[0].components[1].setDisabled(false);

                button.message.update({
                    embed: embed.pages[0],
                    components: [button.message.components[0]]
                });
            }

            else if (button.id === "balance") {
                button.message.components[0].components[0].setDisabled(false);
                button.message.components[0].components[1].setDisabled(true);

                button.message.update({
                    embed: embed.pages[1],
                    components: [button.message.components[0]]
                });
            }
        }catch (error) {
            errorHandle(error, button.clicker.user.username, button.message.content)
    
            button.message.channel.send("<@" + button.clicker.id + ">there was an error! \nThe error has been logged!\n");
        }
    }
})


console.log("leaderboard.js loaded");
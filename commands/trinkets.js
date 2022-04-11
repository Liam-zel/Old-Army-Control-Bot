const { botColour, client } = require("../main");
const disbut = require('discord-buttons');

const f = require('../functions.js');
const Discord = require('discord.js');

const contentAmount = 8; // default 8 (used to be 6 if 8 causes shit)

class userEmbed {
    constructor(userID, msgID, embeds, pageNum) {
        this.userID = userID;
        this.msgID = msgID;
        this.embeds = embeds;
        this.pageNum = pageNum;
    }
}


function createPage(pageNum, user, totalPages, message) {

    const trinketsEmbed = new Discord.MessageEmbed()
    .setColor(botColour)
    .setAuthor(message.author.username + "'s Trinkets", message.author.avatarURL())
    .setTimestamp()
    .setFooter("page " + pageNum + " of " + totalPages);

    var half1 = "\u200B"; // embed wont accept empty strings
    var half2 = "\u200B";

    for (var i = contentAmount * (pageNum - 1); i < contentAmount * pageNum; i++) {
        var trinket = user.trinkets[i];
        if (trinket == undefined) break;

        if (i % 2 == 0) { // NaN returns 0 (for when i == 0)
            half1 += "**" + trinket.name + "** x" + user.trinkets[i].strength + "\n" + 
            "Drop rate: " + trinket.dropRate + "%\n" +
            "Bonus: +" + trinket.bonus + " to " + trinket.bonusType + "\n\n";
        }
        else {
            half2 += "**" + trinket.name + "** x" + user.trinkets[i].strength + "\n" + 
            "Drop rate: " + trinket.dropRate + "%\n" +
            "Bonus: +" + trinket.bonus + " to " + trinket.bonusType + "\n\n";
        }
    }

    
    trinketsEmbed.addField("\u200B", half1, true);
    trinketsEmbed.addField("\u200B", half2, true);

    return trinketsEmbed

}

// ======================================================

module.exports = {
    name: "trinkets",
    category: "general",
    description: "Shows all of your trinkets!",
    alias: "`trinkets`, `tr`",
    activeEmbeds: [],
    examples: [
        "trinkets [page number]", 
        "trinkets", 
        "trinkets 2"
    ],
    execute(message, Discord, f, user, pageNum) {

        var totalPages = Math.ceil(user.trinkets.length / contentAmount);


        if (pageNum == 0) pageNum = 1;

        if (pageNum > totalPages || isNaN(pageNum) || pageNum < 0) {
            // grammar is important
            if (totalPages == 1) message.reply("That isn't a valid page number!\n Your inventory has " + totalPages + " page");
            else  message.reply("That isn't a valid page number!\n Your inventory has " + totalPages + " pages");
            return;
        }

        
        var pages = [];
        for (var i = 0; i < Math.ceil(user.trinkets.length / contentAmount); i++) {
            pages[pages.length] = createPage(pageNum + i, user, totalPages, message);
        }



        // buttons
        const nextPage = new disbut.MessageButton()
        .setID("t_nextPage")
        .setStyle("blurple")
        .setLabel("Next Page")
        .setDisabled(false);

        const previousPage = new disbut.MessageButton()
        .setID("t_previousPage")
        .setStyle("blurple")
        .setLabel("Previous Page")
        .setDisabled();

        const buttonRow = new disbut.MessageActionRow()
        .addComponent(previousPage)
        .addComponent(nextPage)


        message.channel.send({
            embed: pages[pageNum - 1],
            component: buttonRow
        }).then(msg => {

            module.exports.activeEmbeds[module.exports.activeEmbeds.length] = new userEmbed(user.userID, msg.id, pages, pageNum);

            var clearEmbed = setInterval(() => {
                const embed = module.exports.activeEmbeds[0];

                console.log(embed);

                msg.components[0].components[0].setDisabled(true);
                msg.components[0].components[1].setDisabled(true);


                msg.edit({
                    embed: embed.embeds[embed.pageNum - 1], 
                    components: [ msg.components[0] ]
                });


                module.exports.activeEmbeds.splice(0, 1); // deletes first item in the array (which is always the oldest)

                clearInterval(clearEmbed);
            }, 120000); // 2 minutes in ms
        });
    }
}


// ===============================================



client.on("clickButton", async (button) => {   
    const activeEmbeds = module.exports.activeEmbeds;

    var embed;

    for (var i = 0; i < activeEmbeds.length; i++) {
        if (activeEmbeds[i].msgID === button.message.id) {
            embed = activeEmbeds[i];
            break;
        }
    }


    if (embed != undefined && button.clicker.id === embed.userID) {
        try {

            if (button.id === 't_nextPage') {
                embed.pageNum++;
            }
            else if (button.id === 't_previousPage') {
                embed.pageNum--;
            }


            // because PAGENUM starts at 1 and an array starts at 0, there are misguided offsets, such as subtracting 2 when disabling "t_previousPage" or not adding 1 for disabling "t_nextPage"
            if (embed.pageNum >= embed.embeds.length) {
                button.message.components[0].components[1].setDisabled(true);
                embed.pageNum = embed.embeds.length;
            }
            else button.message.components[0].components[1].setDisabled(false);

        
            if ((embed.pageNum - 2) < 0) { 
                button.message.components[0].components[0].setDisabled(true);
                embed.pageNum = 1;
            }
            else button.message.components[0].components[0].setDisabled(false);
            


            button.message.update({ 
                embed: embed.embeds[embed.pageNum - 1], 
                components: [ button.message.components[0] ]
            })

        }catch (error) {
            f.errorHandle(error, button.clicker.user.username, button.message.content)
    
            button.message.channel.send("<@" + button.clicker.id + ">there was an error! \nThe error has been logged!\n");
        }
    }
})

console.log("trinkets.js loaded");
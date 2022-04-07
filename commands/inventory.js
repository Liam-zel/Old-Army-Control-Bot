const { botColour, prefix } = require("../main");

module.exports = {
    name: "inventory",
    category: "general",
    description: "See whats in your inventory.",
    alias: "`inv`",
    examples: ["inventory [page number]",
    "inventory",
    "inventory 3"
    ],
    execute(message, Discord, f, user) {
        var pageNum = message.content.split(" ").pop()
        pageNum = parseInt(pageNum, 10)

        if (isNaN(pageNum)) {
            pageNum = 1;
        }

        contentAmount = 6;
        var totalPages = Math.ceil(user.inventory.length / contentAmount);
        if (totalPages == 0) totalPages = 1;

        if (pageNum == 0) pageNum = 1;

        if (pageNum > totalPages || isNaN(pageNum) || pageNum < 0) {
            // grammar is important
            if (totalPages == 1) message.reply("That isn't a valid page number!\n Your inventory has " + totalPages + " page");
            else  message.reply("That isn't a valid page number!\n Your inventory has " + totalPages + " pages");
            return;
        }

        const inventoryEmbed = new Discord.MessageEmbed()
        .setColor(botColour)
        .setTimestamp() 
        .setAuthor(message.author.username + "'s Inventory", message.author.avatarURL())
        .setFooter("page " + pageNum + " of " + totalPages);

        var half1 = "\u200B"; // embed wont accept empty strings
        var half2 = "\u200B";

        for (var i = contentAmount * (pageNum - 1); i < contentAmount * pageNum; i++) {
            var item = user.inventory[i];
            if (item == undefined) break;

            if (i % 2 == 0) { // NaN returns 0 (for when i == 0)
                half1 += "**" + item.name + "** `x" + user.inventory[i].amount + "`\n" + 
                "Sell value: `$" + item.sellValue + "`\n\n";
            }
            else {
                half2 += "**" + item.name + "** `x" + user.inventory[i].amount + "`\n" + 
                "Sell value: `$" + item.sellValue + "`\n\n";
            }
        }

        if (half1 == "\u200B") half1 = "*You don't have any items yet!\nItems can drop from enemies or you can buy some in the shop!*";

        inventoryEmbed.addField("\u200B", half1, true);
        inventoryEmbed.addField("\u200B", half2, true);

        message.channel.send(inventoryEmbed);
    }
}

console.log("inventory.js loaded");
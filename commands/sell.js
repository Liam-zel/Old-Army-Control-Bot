const { botColour, prefix } = require("../main.js");

module.exports = {
    name: "sell",
    category: "game",
    description: "Sell your items in return for money!",
    alias: "None",
    examples: [
        "sell [amount] {Item Name}", 
        "sell 3 stick ", // NOT AN ITEM 
        "sell max rock shard",
        "sell half feather"
    ],
    execute(message, args, Discord, user) {
        const sellEmbed = new Discord.MessageEmbed()
        .setColor(botColour) 
        .setTimestamp()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());
        

        var item = message.content.split(prefix + "sell ").pop();
        var amount = 1;

        // if Amount is specified (through an integer)
        // This does mean items names cant start with a number would cause errors
        if (parseInt(item[0])) {
            amount = item.split(" ");
            amount = parseInt(amount[0]);

            if (amount < 1) {
                message.reply("that's not a valid amount!");
            }
            
            item = item.split(amount + " ").pop();
        }

        // set all elements to lower case so command isnt case sensitive
        for (var i = 0; i < item.length; i++) { 
            item[i] = item[i].toLowerCase();
        }
        
        itemPos = undefined;
        for (var i = 0; i < user.inventory.length; i++) {
            var invItem = user.inventory[i].name.split(" ");

            var loopLength = Math.max(invItem.length, item.length); // use as the loop amount for the nested loop below

            for (var j = 0; j < loopLength; j++) {
                // If the words that make up an item name dont match 
                // at any point, break
                if (invItem[j].toLowerCase() != item[j]) {
                    break;
                }

                else if (invItem[j] == item[j] && j == loopLength - 1) {
                    itemPos = i;
                }
            }
        }


        if (itemPos === undefined) {
            message.reply("that's not a valid item!\nMake sure you spelt it correctly!");
            return;
        }

        if (amount > user.inventory[itemPos].amount) {
            message.reply("You don't have that many " + user.inventory[itemPos].name + 
            "\nYou only have `x" + user.inventory[itemPos].amount + "`");
            return;
        }
    }
}

console.log("sell.js loaded");
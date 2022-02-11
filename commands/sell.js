const { botColour, prefix } = require("../main.js");

module.exports = {
    name: "sell",
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
        var amount = message.content

        
        var foundItem = false;
        for (var i = 0; i < user.inventory.length; i++) {
            var invItem = user.inventory[i].name.split(" ");
            //invItem = arr.map( element => { return element.toLowerCase(); } ); // makes all elements lowercase

            var loopLength = Math.max(invItem.length, item.length); // use as the loop amount for the nested loop below

            for (var j = 0; j < loopLength; j++) {
                if (invItem[j] != item[j]) {
                    break;
                }

                else if (invItem[j] == item[j] && j == loopLength - 1) {
                    foundItem = true;
                }
            }
        }

        if (foundItem) {
            console.log("item FOUND");
            console.log(item);
        }

        console.log(user.asidawoas[12]);

        
    }
}

console.log("sell.js loaded");
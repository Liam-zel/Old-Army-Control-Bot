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

        // split the message into two groups and pop so youre left with the half that has the amount and item name
        // then split the array into each individual word and shift to get the first element which will be checked for as the amount
        var amount = message.content.split(prefix + "sell ").pop();
        amount.split(" ").shift(); 

        var item = message.content.split(prefix + "sell " + amount).pop();

        item = arr.map( element => { return element.toLowerCase(); } ); // makes all elements lowercase

        var foundItem = false;
        for (var i = 0; i < user.inventory.length; i++) {
            var invItem = user.invetory[i].name.split(" ");
            invItem = arr.map( element => { return element.toLowerCase(); } ); // makes all elements lowercase

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

        if (foundItem) {/*stuff*/}

        
    }
}

console.log("sell.js loaded");
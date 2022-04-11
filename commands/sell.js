const { botColour, prefix } = require("../main.js");

module.exports = {
    name: "sell",
    category: "game",
    description: "Sell your items in return for money!",
    alias: "`sell`",
    examples: [
        "sell [amount] {Item Name}", 
        "sell 3 stick ", // NOT AN ITEM 
        "sell max rock shard",
        "sell half feather"
    ],
    execute(message, Discord, f, user) {

        var item = message.content.split(prefix + "sell ").pop();
        var amount = item.split(" ")[0];
        var amountInt = parseInt(amount, 10); // the 10 at the end refers to the radix (the base), base 10 is what we count in


        // if they just say "sell" 
        if (message.content.split(" ").length == 1) {
            message.reply("You need to specify an amount and item to sell!\n" + 
            "`" + prefix + "sell [amount] {Item Name}`");
            return;
        }

        // if Amount is specified (through an integer)
        // ------- This does mean items names cant start with a number would cause errors -------
        var half = false
        var max = false
        if (isNaN(amountInt)) {
            console.log(amount)

            if (amount === "all" || amount === "max") {
                max = true; 
                item = item.split(amount + " ").pop();
            }
            else if (amount === "half") {
                half = true;
                item = item.split(amount + " ").pop();
            }
        
            amount = 1;
        }
        else {
            if (amount < 1) {
                message.reply("that's not a valid amount!");
                return;
            }
            
            item = item.split(amount + " ").pop();
        }

        // set all elements to lower case so command isnt case sensitive
        item = item.split(" ")
        for (var i = 0; i < item.length; i++) { 
            item[i] = item[i].toLowerCase();
        }
        
        let itemPos = undefined;
        for (let i = 0; i < user.inventory.length; i++) {
            var invItem = user.inventory[i].name.split(" "); 

            let loopLength = Math.max(invItem.length, item.length); // use as the loop amount for the nested loop below

            for (let j = 0; j < loopLength; j++) {
                // console.log("ItemPos: " + itemPos)
                // console.log("Item: " + item)
                // console.log("InvItem: " + invItem)
                // console.log("LoopLength: " + loopLength)
                // console.log("Index: " + j)

                if (item[j] === undefined || invItem[j] === undefined) {
                    break;
                }

                // If the words that make up an item name dont match 
                // at any point, not the correct item
                if (invItem[j].toLowerCase() != item[j].toLowerCase()) {
                    break;
                }
                   
                // found item by getting to end of J without breaking
                if (j === loopLength - 1) {
                    itemPos = i;
                }
            }
        }

        // item
        let foundItem = user.inventory[itemPos]

        // cant find item
        if (itemPos === undefined) {
            message.reply("that's not a valid item!\nMake sure you've spelt it correctly!\n" +
            "You need to specify an amount and item to sell!\n" + 
            "`" + prefix + "sell [amount] {Item Name}`");
            return;
        }

        // if given amount is too much
        if (amount > user.inventory[itemPos].amount) {
            message.reply("You don't have that many " + user.inventory[itemPos].name + "'s" + 
            "\nYou only have `x" + user.inventory[itemPos].amount + " " + user.inventory[itemPos].name + "'s`");
            return;
        }


        // Item has been found, sell process --------------------
        if (half) { amount = Math.round(foundItem.amount / 2); }
        else if (max) { amount = foundItem.amount; }

        let earnings = foundItem.sellValue * amount;
        user.balance += earnings * 100;
        user.totalBalance += earnings * 100;

        foundItem.amount -= amount;
        
        // remove from inventory if run out
        if (foundItem.amount === 0) user.inventory.splice(itemPos, 1); 

        // embed
        const sellEmbed = new Discord.MessageEmbed()
        .setColor(botColour) 
        .setTimestamp()
        .setTitle("Item Sold!")
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());

        // grammar :)
        if (amount > 1) {
            sellEmbed.setDescription("You've sold `x" + amount + " " + foundItem.name + "'s` " +
            "for `$" + earnings + "`")
        }
        else {
            sellEmbed.setDescription("You've sold `x" + amount + " " + foundItem.name + "` " +
            "for `$" + earnings + "`")
        }

        f.updateUser()

        message.channel.send(sellEmbed);
    }
}

console.log("sell.js loaded");
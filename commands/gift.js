var { prefix, botColour } = require("../main"); 

module.exports = {
    name: "gift",
    category: "game",
    description: "Give an item to someone!",
    alias: "None", 
    examples: ["gift {user} {amount} {item}", 
    "gift <@!461059264388005889> 2 feather", 
    "gift <@!461059264388005889> max rock", 
    "gift <@!461059264388005889> half twig"
    ],
    execute(message, args, Discord, f, user, data) {

        if (message.content.split(" ").length < 2) { // didnt mention users
            message.reply("Who do you want to gift to?\nTo gift go: `" + prefix + "gift {user} {amount} {item}`");
            return;
        }
        else if (message.content.split(" ").length === 2) { // only mentioned user
            message.reply("Type the amount and then what item you want to give.\nTo gift go: `" + prefix + "gift {user} {amount} {item}`");
            return;
        }
        else if (message.content.split(" ").length === 3) { // only mentioned user and item
            message.reply("What item do you want to gift?\nTo gift go: `" + prefix + "gift {user} {amount} {item}`");
            return;
        }

        const gifted = message.mentions.users.first();
        const giftedString = "<@" + gifted.id + "> ";

        // find items position in string by looping through items in inventory
        var item = "";
        var itemPos;

        var amount = message.content.split(giftedString).pop();
        amount = amount.split(" ");
        amount = amount[0];

        var giftItem = message.content.split(amount + " ").pop();
        giftItem = giftItem.split(" ");

        var isItem = true;  
        for (var i = 0; i < user.inventory.length; i++) {

            isItem = true;

            // turn item name into an array 
            var invItem = user.inventory[i].name.split(" ")
            
            for (var j = 0; j < invItem.length; j++) {
                if (giftItem[j] != invItem[j]) {
                    isItem = false;
                }
            }


            if (isItem) {
                itemPos = i;
                break;
            }
            
        }
        
        if (!isItem) {
            message.reply("You either don't have that item or it doesn't exist!"); 
            return;
        }

        var item = user.inventory[itemPos];

        // amount
        if (amount === "half") {
            amount = Math.round(item.amount / 2);
        }
        else if (amount === "max" || amount === "all") {
            amount = item.amount;
        }

        amount = parseInt(amount);


        // cap amount if its too big
        if (amount > item.amount) {
            amount = item.amount;
        }

        // delete item if amount is 0
        item.amount -= amount;
        if (item.amount == 0) {
            user.inventory.splice(itemPos, 1);  
        }

        
        // find receiver
        var receiver;
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].username === gifted.username) {
                receiver = data.users[i];
            }
        }
        
        var r_itemPos = undefined;
        for (var i = 0; i < receiver.inventory.length; i++) {
            if (receiver.inventory[i].name == item.name) {
                r_itemPos = i;
                break;
            }
        }
        
        // giving item
        if (r_itemPos != undefined) {
            receiver.inventory[r_itemPos].amount += amount;
        }
        else {
            receiver.inventory[receiver.inventory.length] = item;
            receiver.inventory[receiver.inventory.length - 1].amount = amount;
        }


        const giftEmbed = new Discord.MessageEmbed()
        .setTitle("Sent __" + item.name + "__ to " + gifted.username)
        .setDescription("**" + gifted.username + "** has received: `" + item.name + " x" + amount + "`")
        .setTimestamp()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour);

        message.channel.send(giftEmbed);
        f.updateUser();
    }
}

console.log("gift.js loaded");
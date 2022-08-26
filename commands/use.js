const { prefix } = require("../main.js")

module.exports = {
    name: "use",
    category: "game",
    description: "Use an item",
    alias: "`use`",
    examples: ["use {item name}", "use feather"], // CHANGE LATER TO AN ACTUAL ITEM
    execute(message, f, o, user) {
        var itemName = message.content.split(" ").pop();
        var item = undefined;

        for (let i = 0; i < user.inventory.length; i++) {
            // found item
            if (itemName.toLowerCase() === user.inventory[i].name.toLowerCase()) { 
                for (let j = 0; j < o.items.length; j++) {
                    if (o.items[j].name.toLowerCase() === itemName.toLowerCase()) {
                        item = o.items[j];
                        break;
                    }
                }
            
                break; 
            }
        }

        if (item == undefined) {
            message.reply("You don't have that item!");
            return;
        }

        item.use(user);
    }
}

console.log("use.js loaded");
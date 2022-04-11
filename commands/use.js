const { prefix } = require("../main.js")

module.exports = {
    name: "use",
    category: "game",
    description: "Use an item",
    alias: "`use`",
    examples: ["use {item name}", "use feather"], // CHANGE LATER TO AN ACTUAL ITEM
    execute(message, f, user) {
        var itemName = message.content.split(" ").pop();
        var item = undefined;

        for (let i = 0; i < user.inventory.length; i++) {
            // found item
            if (itemName === user.inventory[i].name) { 
                console.log(itemName)
                console.log(user.inventory[i])

                item = user.inventory[i]
                break; 
            }
        }

        if (item = undefined) {
            message.reply("You don't have that item!");
            return;
        }

        item.use();

    }
}

console.log("use.js loaded");
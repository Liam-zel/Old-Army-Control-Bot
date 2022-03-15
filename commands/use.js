const { prefix } = require("../main.js")

module.exports = {
    name: "use",
    category: "game",
    description: "Use an item",
    alias: "None",
    examples: ["use {item name}", "use feather"], // CHANGE LATER TO AN ACTUAL ITEM
    execute(message, args, user, useableItems) {
        var itemName = message.content.slice(5); // cuts off "+use " and leaves the item name 

        // checks to see if item is in inventory
        var inInventory = false;

        for (var i = 0; i < user.inventory.length; i++) {
            if (itemName == user.inventory[i].name) { inInventory = true; break; }
        }
        if (!inInventory) {
            message.reply("You don't have that item!");
            return;
        }

        switch(itemName) {
            case "feather":
                console.log("You used the feather item!");
                break;
            case "test":
                console.log("You used the test item!");
                break;
            default:
                console.log("did you type that right?");
                break;
        }
    }
}

console.log("use.js loaded");
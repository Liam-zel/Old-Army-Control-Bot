const { prefix, botColour } = require("../main.js")

module.exports = {
    name: "item",
    category: "general",
    description: "See information and stats about an item!",
    alias: "`item`",
    examples: ["item {item name}", "item feather"], 
    execute(message, Discord, f, o, command) {

        var item = message.content.split(prefix + command + " ").pop();

        var itemPos = undefined;
        for (let i = 0; i < o.items.length; i++) {

            let currentItem = o.items[i];

            if (currentItem.name.toLowerCase() === item.toLowerCase()) {
                itemPos = i
                break;  
            }
        }

        if (itemPos === undefined) {
            message.reply("Couldn't find that item! Make sure you've spelt it correctly!")
            return;
        }

        // monsters that drop it
        let monsters = "\u200B"
        item = o.items[itemPos]
        
        for (let i = 0; i < o.Areas.length; i++) {

            for (let j = 0; j < o.Areas[i].monsters.length; j++) {
                let monster = o.Areas[i].monsters[j];

                for (let k = 0; k < monster.drops.length; k++) {

                    // minibosses and bosses require the area to be levelled up, so if 'J' (the mob position)
                    // is either the areas length -1 or -2, its a boss or miniboss
                    // the level emojis are "0_" "1_", "2_", "3_"
                    let areaLevelImg = "\u200B"
                    if (j == o.Areas[i].monsters.length - 2) areaLevelImg = f.findImage("1_") // MiniBoss
                    else if (j == o.Areas[i].monsters.length - 1) areaLevelImg = f.findImage("2_") // Boss

                    if (monster.drops[k].name.toLowerCase() === item.name.toLowerCase()) {
                        monsters += "**" + areaLevelImg + o.Areas[i].name + 
                        "** - " + monster.eName + " `" + monster.dropRates[k] + "%`\n"
                    }
                } // end of k

            } // end of j
        } // end of i

        if (monsters === "\u200B") {
            monsters = "None";
        }


        // Creating item data and embed
        let itemData = o.items[itemPos];
        let itemImage = f.findImage(itemData.name.split(" ").join("")); // split(" ").join("") removes spaces


        const itemEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp()
        .setTitle(itemImage + "\u2800__**" + itemData.name + " Information!**__\u2800" + itemImage);

        itemEmbed.addField("**Description: **", item.description);
        itemEmbed.addField("**Sell Value: **", "`$" + item.sellValue + "`");
        itemEmbed.addField("**Drops From: **", monsters);


        message.channel.send(itemEmbed);

    }
}

console.log("item.js loaded");
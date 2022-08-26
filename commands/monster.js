const { prefix, botColour } = require("../main.js")

module.exports = {
    name: "monster",
    category: "general",
    description: "See information and stats about a monster!",
    alias: "`monster`, `mob`",
    examples: ["monster {monster name}", "monster rock", "mob bird"], 
    execute(message, Discord, f, o) {

        var monster = message.content.split(" ").pop();


        var areaPos, mobPos;
        for (let i = 0; i < o.Areas.length; i++) {
            for (let j = 0; j < o.Areas[i].monsters.length; j++) {

                let currentMob = o.Areas[i].monsters[j];

                if (currentMob.eName.toLowerCase() === monster.toLowerCase()) {
                    areaPos = i
                    mobPos = j
                    break;
                }

            }

            if (mobPos != undefined) break; // if found mob break
        }

        if (mobPos === undefined) {
            message.reply("Couldn't find that monster! Make sure you've spelt it correctly!")
            return;
        }

        
        // Creating monster data and embed
        let monsterData = o.Areas[areaPos].monsters[mobPos];
        let monsterImage = f.findImage(monsterData.eName);

        const monsterEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setColor(botColour)
        .setTimestamp()
        .setTitle(monsterImage + "\u0020__**" + monsterData.eName + " Information!**__\u0020" + monsterImage);

        let drops = "\u200B"
        for (let i = 0; i < monsterData.drops.length; i++) {
            drops += monsterData.drops[i].name + " - `" + monsterData.dropRates[i] + "%`\n"
        }

        if (drops === "\u200B") { drops = "None"}

        let areaLevel = "Level 0"; // normal enemy
        let tag = "\u200B"

        if (mobPos === o.Areas[areaPos].monsters.length - 2) {
            areaLevel = "Level 1\u0020" + f.findImage("1_") // miniboss
            tag = "**[Mini Boss]**"
        }
        else if (mobPos === o.Areas[areaPos].monsters.length - 1) {
            areaLevel = "Level 2\u0020" + f.findImage("2_") // boss
            tag = "**[Boss]**"
        }

        monsterEmbed.addField("**Area: **", o.Areas[areaPos].name + " " + areaLevel)
        monsterEmbed.addField("**Earnings: **", "`$" + (monsterData.goldEarn / 100) + " | " + monsterData.xpEarn + "xp`")
        monsterEmbed.addField("**Drops: **", drops)


        message.channel.send(monsterEmbed)

    }
}

console.log("monster.js loaded");
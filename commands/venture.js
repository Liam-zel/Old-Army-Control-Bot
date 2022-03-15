const { prefix, botColour } = require("../main.js")
const { Areas } = require("../objects.js")

const costScale = 2.2;

module.exports = {
    name: "venture",
    category: "game",
    description: "Explore new areas or venture deeper in current ones for new foes!",
    alias: "`ven`",
    examples: [
        "venture [area]",
        "venture",
        "venture forest"
    ],
    execute(message, args, Discord, f, user, client) {

        const ventureEmbed = new Discord.MessageEmbed()
        ventureEmbed.setColor(botColour) 
        ventureEmbed.setTimestamp()
        ventureEmbed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL());

        const splitMessage = message.content.split(" ");

        // if there isn't a second element in the message, they arent venturing, just show info
        if (splitMessage.length < 2) {

            ventureEmbed.setTitle("__Areas__")
            ventureEmbed.setFooter(prefix + "venture [area]");

            // user areas
            for (var i = 0; i < user.areas.length; i++) {
                var area = user.areas[i];

                var image = f.findImage(area.level + "_");

                if (area.level < 3) ventureEmbed.addField("**__" + area.name + "__**\u2000" + image, 
                "Level: `" + area.level + "`\n\n" +
                "Upgrade Cost: `$" + area.upgradeCost + 
                "`", true);

                else ventureEmbed.addField("**__" + area.name + "__**\u2000" + image, 
                "Level: `" + area.level + "` **MAX**" + 
                "\n\n\u2000", true);
            }

            // locked areas
            for (var i = 0; i < Areas.length; i++) {
                var area = Areas[i];

                if (area.prestigeReq > user.prestigeNum) break;

                // check if they already have area unlocked
                var unlocked = false;
                for (var j = 0; j < user.areas.length; j++) {
                    if (area.name == user.areas[j].name) unlocked = true; break; 
                }
                

                if (!unlocked) {
                    ventureEmbed.addField("**__" + area.name + "__**\u2000", 
                    "**AREA LOCKED**" + "\n\n" + 
                    "Unlock Cost: `$" + area.upgradeCost + 
                    "`", true);
                }
            }

            message.channel.send(ventureEmbed);
            return;
        }


        // venturing an area
        else {
            const area = splitMessage.pop(); // turn into array and return last element (area)


            var isUpgrade = false;
            for (var i = 0; i < user.areas.length; i++) {
                if (area.toLowerCase() == user.areas[i].name.toLowerCase()) {
                    isUpgrade = true;
                }
            }

            // upgrading the area ------------------------------
            if (isUpgrade) {
                
                var image;
                var previousImage;
    
                var effect;
    
                var foundArea = false;
                for (var i = 0; i < user.areas.length; i++) {
                    if (area.toLowerCase() == user.areas[i].name.toLowerCase()) {
                        foundArea = true;

                        
                        if (user.areas[i].level === 3) {
                            message.reply("You've already explored the entire area!\nYou can't venture here any more.");
                            return;
                        }
                        
                        if (user.balance < user.areas[i].upgradeCost) {
                            message.reply("You don't have that much money!\nYou need `$" + user.areas[i].upgradeCost + "` to venture here!");
                            return;
                        }

                        user.areas[i].level++;
                        user.balance -= user.areas[i].upgradeCost;
                        user.areas[i].upgradeCost *= costScale;
    
    
                        // images
                        image = f.findImage(user.areas[i].level + "_")     
                        previousImage = f.findImage((user.areas[i].level - 1) + "_");

    
                        // effects
                        if (user.areas[i].level === 1) {
                            effect = "You unlocked this area's **Mini Boss!**";
                            user.areas[i].miniBoss = true;
                        }
                        else if (user.areas[i].level === 2) {
                            effect = "You unlocked this area's **Boss!**";
                            user.areas[i].megaBoss = true;
                        }
                        else {
                            effect = "Monsters in this area now reward you **`1.5x` more!**";
                            user.areasp[i].isMaxed = true;
                        }
                          
                        break;
                    }
                }
    
                if (!foundArea) {
                    message.reply("That's not a valid area!\nYou can only venture areas you've unlocked and make sure you spelt it correctly!");
                    return;
                }
    
                ventureEmbed.setTitle("You ventured further into the " + area.toUpperCase())
                ventureEmbed.addField(area.toUpperCase() + " " + previousImage + " **-->** " + image, "You verntured further into the " + area.toLowerCase() + "!")
                ventureEmbed.addField("\u200B", effect)
    
                message.channel.send(ventureEmbed);
                f.updateUser();
            }
            

            // unlocking new area ------------------------------
            else {

                var foundArea = false;
                var canAccess = false; // for prestige requirements
                var o_Area; // area object
                for (var i = 0; i < Areas.length; i++) {

                    console.log(Areas[i].name.toLowerCase())
                    console.log(area.toLowerCase());

                    if (Areas[i].name.toLowerCase() == area.toLowerCase()) {
                        foundArea = true;
                        o_Area = Areas[i];

                        if (Areas[i].prestigeReq > user.prestigeNum) break;

                        else if (Areas[i].upgradeCost > user.balance) {
                            message.reply("You can't afford to unlock that area!\nYou need `$" + Areas[i].upgradeCost + "` to venture here!");
                            return;
                        }
                        
                        else {
                            canAccess = true;
                            break;
                        }

                    }
                }

                if (!foundArea) {
                    message.reply("Couldn't find that area!\nMake sure you spelt it correctly!")
                    return;
                }

                else if (!canAccess) {
                    message.reply("You can't venture to the " + o_Area.name + " yet, you aren't a high enough prestige!")
                    return;
                }
                


                user.areas[user.areas.length] = { 
                    name: o_Area.name,
                    level: 0,
                    upgradeCost: o_Area.upgradeCost
                }  

                const unlockEmbed = new Discord.MessageEmbed()
                .setColor(botColour) 
                .setTimestamp()
                .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
                .setTitle("You unlocked the " + o_Area.name + " area!")
                .setDescription("You can now assign an army to this area using the `assign` command to fight new foes and earn new items!")
                .addField("Current balance: `$" + user.balance + "`", "\u200B");

                message.channel.send(unlockEmbed);
                f.updateUser();
            }
            
        }   
    }
}

console.log("venture.js loaded");
const { Areas } = require("../objects");

module.exports = {
    name: "levelup",
    category: "admin",
    description: "levels up specified user from data. **[ADMIN COMMAND]**",
    alias: "`levelup`",
    examples: ["levelup {user} {amount}", "levelup <@!461059264388005889> 10"],
    execute(message, client, f) {
        var user = message.mentions.users.first();
        var amount = message.content.split(user).pop()

        amount = parseInt(amount, 10)
        if (isNaN(amount)) amount = 1;

        // find specified users from data 
        for (var i = 0; i < client.data.users.length; i++) {
            if (client.data.users[i].username == user.username) {

                let userData = client.data.users[i];    
                let xpEarn = 0;
                let xpToNext = 0;
                xpToNext += userData.xpToNext; // it cant be = or it overwrites the data (i think)

                while (amount) {
                    xpEarn += xpToNext
                    xpToNext = Math.ceil(xpToNext * 1.5)

                    amount--;
                }

                userData.xp += xpEarn

                f.updateLevel(userData, message, Areas)

            }
        }

        f.updateUser();
    }
}

console.log("remove.js loaded");
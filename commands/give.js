const { prefix } = require("../main.js");

module.exports = {
    name: "give",
    category: "admin",
    description: "Give specified account money. **[ADMIN COMMAND]**",
    alias: "`give`, `g`",
    examples: ["give {user} {amount}", 
    "give `<@!461059264388005889>` 10000",
    "give `<@!461059264388005889>` -250"
    ],
    execute(message, client, f) {
        var user = message.mentions.users.first()

        // search for user id in client data
        var found = false;
        for (let i = 0; i < client.data.users.length; i++) {

            if (client.data.users[i].userID === user.id) {
                found = true;
                
                let userAccount = client.data.users[i];

                let amount = message.content.split("<@" + user.id + "> ").pop();

                amount = parseFloat(amount)

                amount *= 100; // user balance stored in cents

                if (isNaN(amount)) {
                    message.reply("not a valid amount");
                    return; 
                }

                message.channel.send("Gave <@" + user.id + "> `$" + (amount/100) + "`");
                userAccount.balance += amount;
            }   
        }

        if (!found) {
            message.reply("Couldn't find that user!");
        }

        f.updateUser();
    }   
}

console.log("give.js loaded");
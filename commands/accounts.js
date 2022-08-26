const { prefix, botColour } = require("../main.js")

module.exports = {
    name: "accounts",
    category: "admin",
    description: "See all registered accounts **[ADMIN COMMAND]**",
    alias: "`accounts`, 'acc'",
    examples: ["accounts [page num]", "accounts", "accounts 2"], 
    execute(message, Discord, client) {
        var accountList = ""

        const accountsPerPage = 10;
        var pageNum = parseInt(message.content.split(" ").pop());
        const totalPages = Math.ceil(client.data.users.length / accountsPerPage)

        if (isNaN(pageNum)) {
            pageNum = 1;
        }
        else if (pageNum < 1 || pageNum > totalPages) {
            message.reply("That's not a valid page number!")
            return;
        }

        for (let i = 1 * (pageNum-1); i < 1 * (pageNum-1) + accountsPerPage; i++) {
            let user = client.data.users[i];

            if (user === undefined) break; 

            // add data to string
            accountList += 
            user.username + 
            " - lvl: " + user.userLevel + 
            " | pr: " + user.prestigeNum + 
            " | `$" + Math.trunc(user.balance) + "`\n";
        }


        const accountEmbed = new Discord.MessageEmbed()
        .setTitle("Accounts")
        .setFooter("Page " + pageNum + " of " + totalPages)
        .setColor(botColour)
        .setDescription(accountList)
        .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
        .setTimestamp();
        
        message.channel.send(accountEmbed)
    }
}

console.log("accounts.js loaded");
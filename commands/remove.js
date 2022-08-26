module.exports = {
    name: "remove",
    category: "admin",
    description: "Removes users from data. **[ADMIN COMMAND]**",
    alias: "`remove`, 're'",
    examples: ["remove {user}", "remove `<@!461059264388005889> "],
    execute(message, client, f) {
        var user = message.mentions.users.first();

        // find specified users from data 
        for (var i = 0; i < client.data.users.length; i++) {
            if (client.data.users[i].username == user.username) {
                client.data.users.splice(i, 1); // remove them from the array
                message.reply("removed " + user.username + "\n" + client.data.users.length + " Accounts");
            }
        }

        f.updateUser();
    }
}

console.log("remove.js loaded");
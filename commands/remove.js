module.exports = {
    name: "remove",
    description: "",
    alias: "None",
    examples: ["remove"],
    execute(message, args, client, f) {
        var user = message.mentions.users.first();

        for (var i = 0; i < client.data.users.length; i++) {
            if (client.data.users[i].username == user.username) {
                client.data.users.splice(i, 1);
                message.reply("removed " + user.username + "\n" + client.data.users.length);
            }
        }

        f.updateUser();
    }
}

console.log("remove.js loaded");
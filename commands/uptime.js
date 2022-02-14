const { botColour } = require("../main");

module.exports = {
    name: "uptime",
    description: "Shows how long the bot has currently been online for",
    alias: "None",
    examples: ["uptime"],
    execute(message, args, Discord, client) {

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        var duration = "";
        if (days > 0) duration += days + " days, "
        if (hours > 0) duration += hours + " hours, "
        if (minutes > 0) duration += minutes + " minutes and "
        duration += seconds + " seconds.";


        const uptimeEmbed = new Discord.MessageEmbed()
        .setTitle("__Bot Uptime:__ :robot:")
        .setTimestamp()
        .setColor(botColour)    
        .setDescription("This current session has lasted: " + duration + `\nLatency is ${Math.round(client.ws.ping)}ms`);

        message.channel.send(uptimeEmbed);
    }
}

console.log("uptime.js loaded");
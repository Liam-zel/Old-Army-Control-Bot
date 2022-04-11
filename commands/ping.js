
module.exports = {
    name: "ping",
    category: "misc",
    description: "See latency between your commands and the bot.",
    alias: "`ping`",
    examples: ["ping"],
    execute(message, client) {
        message.channel.send(`PONG!\nLatency is ${Math.round(client.ws.ping)}ms`);
    }
}

console.log("ping.js loaded");
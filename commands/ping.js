
module.exports = {
    name: "ping",
    description: "See latency between your commands and the bot.",
    alias: "None",
    examples: ["ping"],
    execute(message, args, client) {
        message.channel.send(`PONG!\nLatency is ${Math.round(client.ws.ping)}ms`);
    }
}

console.log("ping.js loaded");
module.exports = {
    name: "error",
    category: "admin",
    description: "Causes an error. **[ADMIN COMMAND]**",
    alias: "`error`",
    examples: ["error"],
    execute(message, f) {
        let error = "THIS WAS A DEBUG ERROR FROM THE ERROR COMMAND"
        let username = message.author.username

        f.errorHandle(message, username, error);
    }
}

console.log("error.js loaded");
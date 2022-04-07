const { prefix } = require("../main.js");

module.exports = {
    name: "feedback",
    category: "misc",
    description: "for if you have any feedback to give or maybe a bug to report!",
    alias: "None",
    examples: ["feedback {message}", "feedback this bot is great!"],
    execute(message, feedbackList, fs) {
        console.log("\n--Feedback!--\n");
        feedbackList.reports[feedbackList.reports.length] = {
            number: feedbackList.reports.length,
            user: message.author.username,
            issue: message.content.slice(10)
        }

        message.reply("Thanks for the feedback!");

        fs.writeFile("./feedbackList.json", JSON.stringify(feedbackList, null, 4), err => {
            if (err) throw err;
        });
    }
}

console.log("feedback.js loaded");
const { prefix } = require("../main.js");

module.exports = {
    name: "feedback",
    category: "misc",
    description: "for if you have any feedback to give or maybe a bug to report!",
    alias: "`feedback`",
    examples: ["feedback {message}", "feedback this bot is great!"],
    execute(message, feedbackList, fs) {
        console.log("\n--Feedback!--\n");

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
    
        today = mm + '/' + dd + '/' + yyyy;

        feedbackList.reports[feedbackList.reports.length] = {
            date: today,
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
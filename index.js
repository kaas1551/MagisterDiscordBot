const discord = require("discord.js");
const schedule = require("node-schedule");
var client = new discord.Client();
config = JSON.parse(require("fs").readFileSync("./config.json"));
const path = require("path");
var date = new Date();
const process = require("process");

if (date.getHours() > 8) {
    date.setDate(date.getDate() + 1);
    date.setHours(8);
    date.setMinutes(15)
    date.setSeconds(0);
}
else {
    date.setHours(8);
    date.setMinutes(15)
    date.setSeconds(0);
}

client.on("ready", () => {
    console.log("ready");
})

client.on("message", async (msg) => {
    require("./ev/message.js").handleMessage(msg, client);
});

process.on("uncaughtException", (err) => {
    console.log(err);
});

client.on("error", err => {
    console.log(err);
});

let z = schedule.scheduleJob(date, () => {
    require("./util/dailyUpdate.js").run(client);
});
console.log(z);
client.login(config.LOGIN_TOKEN);

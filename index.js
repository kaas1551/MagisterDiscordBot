const discord = require("discord.js");
const client = new discord.Client();
const path = require("path");
const process = require("process");
const fs = require("fs");
config = JSON.parse(require("fs").readFileSync("./config.json"));



process

    .on("uncaughtException", (err) => {
        fs.writeFileSync(`./log/${`${date.toDateString()}-${date.toTimeString().split(" ")[0]}`}`);
        console.log("An error occured, file written to log folder.");
    })



client

    .on("ready", () => console.log("ready"))

    .on("message", async (msg) => {
        require("./ev/message.js").handleMessage(msg, client);
    })

    .login(config.LOGIN_TOKEN);





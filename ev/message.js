const fs = require("fs");
const discord = require("discord.js");
const path = require("path");
var config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json")));
var cmdPath = fs.readdirSync(path.join(__dirname, "../cmds"));

module.exports = {
    handleMessage: (msg, client) => {
        if (msg.content[0] === config.PREFIX) {
            let cmd = msg.content.split("\n")[0].slice(config.PREFIX.length).split(" ")[0];
            let args = msg.content.split("\n").join(" ").slice(msg.content.split(" ")[0].length);
            //msg.content.split("\n") voor register command om line break arguments binnen args te krijgen.


            if (fs.existsSync(path.join(__dirname, `../cmds/${cmd}.js`))) {
                let commandFile = require(path.join(__dirname, `../cmds/${cmd}.js`));

                if (msg.channel.type === "dm") {
                    if (commandFile.DM === "disallowed") return msg.channel.send("Dit command mag niet gebruikt worden in DM");
                }

                else if (msg.channel.type != "dm" && commandFile.DM === "required") return msg.channel.send("Moet in DM");

                if (!commandFile.needAdminPrivileges) {
                    commandFile.run(msg, args.replace(args[0], ""));
                }

                else if (commandFile.needAdminPrivileges && msg.author.id == config.OWNER_ID) {
                    commandFile.run(msg, args.replace(args[0], ""), client);
                }

                else if (commandFile.needAdminPrivileges && msg.author.id != config.OWNER_ID) {
                    return msg.channel.send("nee jij niet");
                }
            }
        }
    }
}
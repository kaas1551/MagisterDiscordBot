const fs = require("fs");
const path = require("path");
prefix = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"))).PREFIX;
module.exports = {
    needAdminPrivileges: false,
    help: "Serieus?",
    run: (msg, args) => {
        if (args.length === 0) {
            let cmds = fs.readdirSync(path.join(__dirname, "../cmds")).map(x => x.split(".")[0]);
            msg.channel.send(`\`\`\`CSS\nprefix: ${JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"))).PREFIX}\n\nCommand namen:\n${cmds.join(",\n")} \`\`\``)
        }
        else if (args.length >= 1) {

            if (fs.existsSync(path.join(__dirname, `../cmds/${args}.js`))) {
                let help = require(path.join(__dirname, `../cmds/${args}.js`)).help;
                msg.channel.send(`__**${args}**__ help\n\n${help}`);
            }
        }
    }

}
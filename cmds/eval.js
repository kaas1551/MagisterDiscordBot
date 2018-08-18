const clean = require("../util/clean.js").clean;
const fs = require("fs");
const path = require("path");
const discord = require("discord.js");
prefix = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"))).PREFIX;
module.exports = {
    needAdminPrivileges: true,
    help: "ES6 runnen, admin-only.",
    run: (msg, args, client) => {
        try {
            let code = msg.content.slice(msg.content.split(" ")[0].length);
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            msg.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
}
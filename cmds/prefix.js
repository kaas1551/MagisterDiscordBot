const fs = require("fs");
const path = require("path");
prefix = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"))).PREFIX;

module.exports = {

    needAdminPrivileges: false,
    help: `Verander het prefix, het dingetje wat voor een command staat. Het prefix is nu: "${prefix}"`,

    run: (msg, args) => {
        if (args != null && args != "") {
            if (args.includes(" ")) msg.channel.send("Geen spaties kut");
            else if (args.length > 1) msg.channel.send("lengte niet boven de 1 irritante hond");

            else {
                let config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json")));
                msg.channel.send(`Prefix veranderd naar: "${args}"`)
                config.PREFIX = args;
                fs.writeFileSync(path.join(__dirname, "../config.json"), JSON.stringify(config));
            }
        }
    }
}
const fs = require("fs");
const path = require("path");

module.exports = {
    help: "Verwijder je magister-account van de bot.",
    needAdminPrivileges: false,

    run: (msg, args) => {
        let loginObject = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/registered.json")));


        if (loginObject[msg.author.id]) {
            loginObject[msg.author.id] = undefined;
            fs.writeFileSync(path.join(__dirname, "../db/registered.json"), JSON.stringify(loginObject));
            return msg.channel.send("Je account is verwijderd!");
        }
        else {
            msg.channel.send("Je hebt geen account.");
        }

    }
}
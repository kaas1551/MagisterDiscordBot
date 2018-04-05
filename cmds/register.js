const magister = require("magister.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    needAdminPrivileges: false,
    DM: "required",
    help: "Registreert jouw magister account bij de bot.\nZorg ervoor dat alles op een nieuwe regel staat. Voorbeeld:\n```CSS\n.register\nschoolnaam\nusername\npassword```\n\nVul de naam van jouw school PRECIES in zoals het staat op de magister-inlog pagina van jouw school. Voorbeeld:pantarijn.magister.net",

    run: (msg, args) => {
        //0:school,1:username,2:password
        args = msg.content.split("\n").slice(1);
        console.log(args);

        new magister.Magister({
            school: args[0],
            username: args[1],
            password: args[2]
        }).ready(function (err) {

            if (err) {
                console.log(err);
                return msg.channel.send("Er ging iets verkeerd. Doublecheck dat je je info goed hebt ingevuld en gebruik het help command.\nAls je login info is veranderd, gebruik dan eerst het unregister command")
            }

            else {
                let registered = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/registered.json")));

                if (registered[msg.author.id]) return msg.channel.send("Je bent al geregistreerd!");

                else {
                    registered[msg.author.id] = {
                        school: args[0],
                        username: args[1],
                        password: args[2],
                        date: new Date()
                    }
                    console.log(registered);
                    fs.writeFileSync(path.join(__dirname, "../db/registered.json"), JSON.stringify(registered));
                    return msg.channel.send("Je bent toegevoegd! je kan nu commands als rooster gebruiken.");
                }

            }

        })
    }
}


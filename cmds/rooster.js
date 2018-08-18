const magister = require("magister.js");
const fs = require("fs");
const discord = require("discord.js");
const path = require("path");
prefix = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"))).PREFIX;

module.exports = {
    needAdminPrivileges: false,

    help: `rooster ophalen. Je moet hiervoor uiteraard geregistreerd zijn, gebruik ${prefix}register om je te registreren.\nArgs: \"morgen\" of een dagnaam (zoals \"woensdag\")`,

    run: (msg, args) => {
        let dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
        LOGIN_INFO = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/registered.json")))[msg.author.id];
        if (LOGIN_INFO === undefined) return msg.channel.send("Er zijn geen Magister gegevens gelinkd aan je discord id.");

        let obj = new magister.Magister({
            school: LOGIN_INFO.school,
            username: LOGIN_INFO.username,
            password: LOGIN_INFO.password
        }).ready(function (err) {
            if (err) {
                console.log(err);
                return msg.channel.send("Kon niet inloggen");
            }

            else if (args === "morgen") {
                let bigObj = this.profileInfo()._magisterObj;
                let init = bigObj.profileInfo()._initials;
                let lastName = bigObj.profileInfo()._lastName;
                let date = new Date();
                date.setDate(date.getDate() + 1);
                this.appointments(date, (err, result) => {
                    if (result.length === 0) {
                        return msg.channel.send("Je hebt morgen geen lessen.");
                    }

                    for (i = 0; i < result.length; i++) {
                        if (result[i]._classes.length === 0) result[i]._classes.push(result[i]._description);
                        if (result[i]._scrapped) result[i]._classes[0] = `~~${result[i]._classes[0]}~~ (**__UITVAL__**)`;
                        if (result[i]._teachers.length === 0) {
                            result[i]._teachers[0] = {}
                            result[i]._teachers[0]._fullName = "Geen docent";
                        }

                    }


                    let embed = new discord.RichEmbed()
                        .setTitle(`Rooster  | [${bigObj.magisterSchool.name}]`)
                        .setColor(0x00AE86)
                        .setFooter(new Date().toString())
                        .setThumbnail("https://pubblestorage.blob.core.windows.net/d9c7ad83/content/2017/6/fed03e4c-67e0-46ba-8db9-a99432de167a.jpg")
                        .addField("Morgen",
                            `${result.map(x => `Uur: ${x._beginBySchoolHour}, Lokaal: ${x._classRooms[0]}, Les: ${x._classes[0]}  (${x._teachers[0]._fullName})`).join("\n\n")}`);
                    msg.channel.send({ embed });
                }
                )

            }

            else if (dayNames.includes(args)) {

                for (let i = 0; i <= 7; i++) {
                    date = new Date();
                    date.setDate(date.getDate() + i);
                    dag = dayNames[date.getDay()];
                    if (dag === args) break;
                }


                if (dag === args) {

                    this.appointments(date, (err, result) => {
                        let bigObj = this.profileInfo()._magisterObj;
                        let init = bigObj.profileInfo()._initials;
                        let lastName = bigObj.profileInfo()._lastName;
                        console.log(result);

                        if (result.length === 0) {
                            return msg.channel.send(`Je hebt ${dag} geen lessen.`);
                        }

                        for (i = 0; i < result.length; i++) {

                            if (result[i]._classes.length === 0) result[i]._classes.push(result[i]._description);
                            if (result[i]._scrapped) result[i]._classes[0] = `~~${result[i]._classes[0]}~~ (**__UITVAL__**)`;

                            if (result[i]._teachers.length === 0) {
                                result[i]._teachers[0] = {};
                                result[i]._teachers[0]._fullName = "Geen docent";
                            }

                        }
                        let embed = new discord.RichEmbed()
                            .setTitle(`Rooster  | [${bigObj.magisterSchool.name}]`)
                            .setColor(0x00AE86)
                            .setFooter(date.toString())
                            .addField(`${dag}\n`,
                                `${result.map(x => `Uur: ${x._beginBySchoolHour}, Lokaal: ${x._classRooms[0]}, Les: ${x._classes[0]}  (${x._teachers[0]._fullName})`).join("\n\n")}`);
                        msg.channel.send({ embed });
                    });
                }
            }


            else {
                this.appointments(new Date(), (err, result) => {
                    let bigObj = this.profileInfo()._magisterObj;
                    let init = bigObj.profileInfo()._initials;
                    let lastName = bigObj.profileInfo()._lastName;

                    if (result.length === 0) {
                        return msg.channel.send("Je hebt vandaag geen lessen.");
                    }

                    for (i = 0; i < result.length; i++) {
                        if (result[i]._classes.length === 0) result[i]._classes.push(result[i]._description);
                        if (result[i]._scrapped) result[i]._classes[0] = `~~${result[i]._classes[0]}~~ (**__UITVAL__**)`;
                        if (result[i]._teachers.length === 0) {
                            result[i]._teachers[0] = {};
                            result[i]._teachers[0]._fullName = "Geen docent";
                        }
                    }
                    let embed = new discord.RichEmbed()
                        .setTitle(`Rooster  | [${bigObj.magisterSchool.name}]`)
                        .setColor(0x00AE86)
                        .setFooter(new Date().toString())
                        .addField("Vandaag\n",
                            `${result.map(x => `Uur: ${x._beginBySchoolHour}, Lokaal: ${x._classRooms[0]}, Les: ${x._classes[0]}  (${x._teachers[0]._fullName})`).join("\n\n")}`);
                    msg.channel.send({ embed });
                });
            }
        });
    }
}

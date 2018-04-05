const fs = require("fs");
const path = require("path");
const magister = require("magister.js");

module.exports = {

    run: (client) => {
        var annChan = client.channels.get("423150660041834497");

        let registered = JSON.parse(fs.readFileSync(path.join(__dirname, "../registered.json"))).registered;
        for (let i = 0; i < registered.length; i++) {
            registeredUser = registered[i];
            var LOGIN_INFO = JSON.parse(fs.readFileSync(path.join(__dirname, "../configmagister.json")))[registeredUser];

            let obj = new magister.Magister({
                school: LOGIN_INFO.school,
                username: LOGIN_INFO.username,
                password: LOGIN_INFO.password
            }).ready(function () {

                this.appointments(new Date(), (err, result) => {
                    let uitval = [];
                    result.forEach(x => {
                        if (x._classes.length === 0) {
                            x._classes.push(x._description);
                        }
                        if (x._scrapped) uitval.push(x);
                    });

                    if (uitval.length === 0) {
                        annChan.send(`<@!${registeredUser}> je hebt geen uitval vandaag.`);
                    }
                    else if (uitval.length >= 1) {
                        annChan.send(`<@!${registeredUser}>, je hebt vandaag${uitval.length} uur uitval.\n` + uitval.map(x => `~~${x._classes[0]}~~ valt uit`).join("\n"))
                    }

                })
            })
        }
    }

}
const enquirer = require("enquirer");
const { readFileSync, writeFileSync, closeSync } = require("fs");
const path = require("path");
const { lastPass } = require("./tables.js");

module.exports.password = async () => {
    const url = await enquirer.prompt({
        name: "url",
        type: "input",
        message: "What website is this password for? (URL)"
    });        

    const username = await enquirer.prompt({
        name: "username",
        type: "input",
        message: "What is the username?"
    });

    const password = await enquirer.prompt({
        name: "password",
        type: "select",
        message: "What is the password?",
        choices: [
            "Generate a random password",
            "Enter a password"
        ]
    });

    switch (password.password) {
        case "Generate a random password": {
            const random = () => {
                const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";
                const char = chars[Math.floor(Math.random() * chars.length)];
                return char;
            };

            let pwd = "";
            
            for (let i = 0; i < 26; i++) {
                if ((i != 0) && (i % 7 === 0)) {
                    pwd += "-";
                }
                else {
                    pwd += random();
                }
            };

            password.password = pwd;

            break;
        };
        case "Enter a password": {
            const pwd = await enquirer.prompt({
                name: "password",
                type: "input",
                message: "What is the password?"
            }).catch(err => {
                console.error(err);
                prompt();
            });
            
            password.password = pwd.password;

            break;
        };
    };

    const data = {
        url: url.url,
        username: username.username,
        password: password.password
    };

    let pswrds = readFileSync(path.join(__dirname, "../data/passwords.json"), { encoding: "utf-8" });
    const pass = JSON.parse(pswrds);
    
    let elem = [];

    for(let prop in pass) {
        elem.push(prop);
    };
    
    if (elem.length === 0) {
        writeFileSync(path.join(__dirname, "../data/passwords.json"), JSON.stringify({ "_0": data  }), { encoding: "utf-8" });
    }
    else {
        let name = elem.pop();
        let num = parseInt(name.slice(1));
        let newData = JSON.stringify({ [`_${num + 1}`]: data });

        pswrds = JSON.parse(JSON.stringify(pswrds));
        newData = newData.replace("{", ",");
        pswrds = pswrds.slice(0, -1);
        pswrds = pswrds.concat(newData);

        writeFileSync(path.join(__dirname, "../data/passwords.json"), pswrds, { encoding: "utf-8" });
    };

    closeSync(0);
    lastPass();
};
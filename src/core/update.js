const { passwords, selectPass } = require("./tables.js")
const enquirer = require("enquirer");
const { readFileSync, closeSync } = require("fs");
const updater = require("jsonfile-updater");
const path = require("path");

module.exports.selectPassword = async () => {
    passwords();

    const passes = readFileSync(path.join(__dirname, "../data/passwords.json"), { encoding: "utf-8" });
    const passwordsObj = JSON.parse(passes);

    const keys = Object.keys(passwordsObj);

    for (const key in keys) {
        keys[key] = keys[key].slice(1);
    }

    const password = await enquirer.prompt({
        name: "password",
        type: "select",
        message: "Which password would you like to use?",
        choices: keys
    }).catch(err => {
        console.error(err);
        prompt();
    });

    const data = {
        url: passwordsObj[`_${password.password}`].url,
        username: passwordsObj[`_${password.password}`].username,
        password: passwordsObj[`_${password.password}`].password
    };

    this.updatePassword(`_${password.password}`, data);

    closeSync(0);
    return password.password;
};

module.exports.updatePassword = async (_password, data) => {
    const url = await enquirer.prompt({
        name: "url",
        type: "input",
        message: "What would you like to change the URL to?"
    });

    const username = await enquirer.prompt({
        name: "username",
        type: "input",
        message: "What would you like to change the username to?"
    });

    const password = await enquirer.prompt({
        name: "password",
        type: "select",
        message: "What would you like to change the password to?",
        choices: [
            "Generate a random password",
            "Enter a password",
            "Keep the same password"
        ]
    });

    if (url.url === "") {
        url.url = data.url; 
    };
    if(username.username === "") {
        username.username = data.username;
    };

    switch (password.password) {
        case "Generate a random password": {
            const random = () => {
                const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";
                const char = chars[Math.floor(Math.random() * chars.length)];
                return char;
            };

            let pwd = "";
            
            for (let i = 0; i < 26; i++) {
                if ((i != 0) && (i % 7 == 0)) {
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
        case "Keep the same password": {
            password.password = data.password;

            break;
        };
    };

    data = {
        url: url.url,
        username: username.username,
        password: password.password
    };

    updater(path.join(__dirname, "../data/passwords.json")).set(_password, data, (err) => {
        if (err) {
            console.error(err);
        }
    });

    closeSync(0);
    setTimeout(() => {
        selectPass(_password);
    }, 10);
};
const Table = require("ascii-table");
const { readFileSync } = require("fs");
const path = require("path");

module.exports.passwords = async () => {
    // Make a table of the passwords
    const passwordTable = new Table("Passwords");
    passwordTable.setHeading("#", "URL", "Username", "Password");
    
    const passwords = readFileSync(path.join(__dirname, "../data/passwords.json"), { encoding: "utf-8" });
    const pass = JSON.parse(passwords);

    let value = 0;

    for(let prop in pass) {
        passwordTable.addRow(value, pass[prop].url, pass[prop].username, pass[prop].password);
        value++;
    };

    console.log(passwordTable.toString());
};

module.exports.selectPass = async (pwd) => {
    const passwordTable = new Table("Passwords");
    passwordTable.setHeading("#", "URL", "Username", "Password");

    const passwords = readFileSync(path.join(__dirname, "../data/passwords.json"), { encoding: "utf-8" });
    const pass = JSON.parse(passwords);

    passwordTable.addRow(pwd.slice(1), pass[pwd].url, pass[pwd].username, pass[pwd].password);

    console.log(passwordTable.toString());
}

module.exports.lastPass = async () => {
    // Make a table with only the last password

    const passwordTable = new Table("Passwords");
    passwordTable.setHeading("#", "URL", "Username", "Password");

    const passwords = readFileSync(path.join(__dirname, "../data/passwords.json"), { encoding: "utf-8" });
    let pass = JSON.parse(passwords);

    pass = pass[Object.keys(pass)[Object.keys(pass).length - 1]];

    passwordTable.addRow("NEW", pass.url, pass.username, pass.password);

    console.log(passwordTable.toString());
}
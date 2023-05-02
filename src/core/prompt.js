const { passwords } = require("./tables.js");
const { password } = require("./element.js");
const { selectPassword } = require("./update.js")
const enquirer = require("enquirer");

module.exports.prompt = async () => {
    const answers = await enquirer.prompt({
        name: "menu",
        type: "select",
        message: "What would you like to do?",
        choices: [
            "Add a new password",
            "Edit password",
            "View all passwords",
            "Exit the program"
        ]
    });

    switch (answers.menu) {
        case "Add a new password": {
            password();
            break;
        };
        case "Edit password": {
            selectPassword();
            break;
        };
        case "View all passwords": {
            passwords();
            break;
        };
        default: {
            console.log("Goodbye!");
            process.exit();
        };
    };
};
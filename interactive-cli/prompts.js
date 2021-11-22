const inquirer = require('inquirer');

exports.selectSearchType = async () => {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Do you want to search Pokemon with ID or name?',
                choices: ['ID', 'Name'],
            }
        ]);

        return answers.type === 'Name';
    } catch (error) {
        throw error;
    }
}

exports.inputIdOrName = async (isName) => {
    try {
        if (isName) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'keyword',
                    message: `Please input the Pokemon's name:`
                }
            ]);

            return answers.keyword.toLowerCase();
        } else {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'keyword',
                    message: `Please input the Pokemon's ID:`
                }
            ]);

            return parseInt(answers.keyword);
        }
    } catch (error) {
        throw error;
    }
}
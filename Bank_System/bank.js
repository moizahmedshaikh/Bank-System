#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
//***Customer Class */
class customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accountNumber;
    constructor(fName, lName, age, gender, mNumber, accNumber) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mNumber;
        this.accountNumber = accNumber;
    }
}
//***Bank Class */
class bank {
    customer = [];
    account = [];
    addcustomer(obj) {
        this.customer.push(obj);
    }
    addAccount(obj) {
        this.account.push(obj);
    }
    transaction(obj) {
        let newAccount = this.account.filter(acc => acc.accNumber !== obj.accNumber);
        this.account = [...newAccount, obj];
    }
}
//***Customer Create */
let meezanBank = new bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName("male");
    let number = parseInt(faker.string.numeric('##########'));
    const cus = new customer(fName, lName, 18 * i, "male", number, 1000 + i);
    meezanBank.addcustomer(cus);
    meezanBank.addAccount({ accNumber: cus.accountNumber, balance: 1000 * i });
}
console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
console.log(chalk.italic.bold.magenta("<------------------  WELCOME MY BANK ------------------->"));
console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
//***Bank Functionality */
async function bankService(bank) {
    do {
        let service = await inquirer.prompt([
            {
                name: "select",
                type: "list",
                message: "please select the service",
                choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
            }
        ]);
        //***Exit */
        if (service.select === "Exit") {
            console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
            console.log(chalk.bold.red.italic("Exiting"));
            process.exit();
        }
        //***View Balance */
        if (service.select === "View Balance") {
            console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
            let res = await inquirer.prompt({
                name: "input",
                type: "input",
                message: "Please Enter your Account Number"
            });
            let account = meezanBank.account.find((acc) => acc.accNumber == res.input);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number!"));
            }
            if (account) {
                let name = meezanBank.customer.find((item) => item.accountNumber == account?.accNumber);
                console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your Account balance is ${chalk.bold.blue.italic(`$${account.balance}`)} `);
                console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
            }
        }
        //*** Cash Withdraw */
        if (service.select === "Cash Withdraw") {
            console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
            let res = await inquirer.prompt({
                name: "input",
                type: "input",
                message: "Please Enter your Account Number"
            });
            let account = meezanBank.account.find((acc) => acc.accNumber == res.input);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    name: "rupee",
                    type: "number",
                    message: "Please Enter Your Amount"
                });
                if (ans.rupee <= account.balance) {
                    let newBalance = account.balance - ans.rupee;
                    // transaction method 
                    meezanBank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
                    console.log(chalk.bold.italic.magenta(`<---- Withdraw ${chalk.green(ans.rupee)} from account ${chalk.gray(account.accNumber)}. New balance: ${chalk.bold.green(newBalance)} ---->`));
                    console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
                }
                else {
                    console.log(chalk.red.bold.italic("Insufficiant Balance!"));
                    console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
                }
            }
            ;
        }
        //*** Cash Deposit */
        if (service.select === "Cash Deposit") {
            console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
            let res = await inquirer.prompt({
                name: "input",
                type: "input",
                message: "Please Enter your Account Number"
            });
            let account = meezanBank.account.find((acc) => acc.accNumber == res.input);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    name: "rupee",
                    type: "number",
                    message: "Please Enter Your Amount"
                });
                let newBalance = account.balance + ans.rupee;
                // transaction method 
                meezanBank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
                console.log(chalk.bold.italic.magenta(`<---- Debited ${chalk.green(ans.rupee)} from account ${chalk.gray(account.accNumber)}. New balance: ${chalk.bold.green(newBalance)} ---->`));
                console.log(chalk.italic.bold.magenta("<------------------------------------------------------->"));
            }
        }
    } while (true);
}
;
bankService(meezanBank);

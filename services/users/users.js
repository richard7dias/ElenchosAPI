const { addCurrentMonth } = require('../sourceExpenses/sourceExpense');
const { addEntryLaunch } = require('../balances/balances');
const fs = require('fs');
const dataBase = "database/users.json";
const { generateUniqueUserId } = require('../idGenerator/id');

function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllUsers() {
    return reloadDataBase();
}

function getUserById(id) {
    return reloadDataBase().filter(user => user.id === id)[0];
}

function getUserForLogin(email, password) {
    return reloadDataBase().filter(
        user => user.email === email && user.password === password && user.active
    )[0];
}

function getUserNotActiveByEmail(email) {
    return reloadDataBase().filter(user => user.email === email && user.active === false)[0];
}

function getUserActiveByEmail(email) {
    return reloadDataBase().filter(user => user.email === email && user.active === true)[0];
}

function insertUser(newUser) {
    const newUserActive = {
        ...newUser,
        id: generateUniqueUserId(reloadDataBase()),
        active: true
    }
    const newUserList = [...reloadDataBase(), newUserActive];
    fs.writeFileSync(dataBase, JSON.stringify(newUserList));

    addCurrentMonth(newUserActive.id);
    addEntryLaunch(newUserActive.id);
}

function activeUser(newUser, id) {
    const newUserActive = {
        ...newUser,
        active: true,
        id: id
    }
    modifyUser(newUserActive, id);
}

function modifyUser(modifications, id) {
    let currentUsers = reloadDataBase()
    const indexModified = currentUsers.findIndex(user => user.id === id)
    const contentChanged = { ...currentUsers[indexModified], ...modifications }
    currentUsers[indexModified] = contentChanged
    fs.writeFileSync(dataBase, JSON.stringify(currentUsers))
}

function excludeUser(id) {
    modifyUser({ active: false }, id)
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserNotActiveByEmail,
    getUserActiveByEmail,
    getUserForLogin,
    insertUser,
    activeUser,
    modifyUser,
    excludeUser
}
const fs = require('fs');
const dataBase = "database/balances.json";
const { generateUniqueUserId } = require('../idGenerator/id');

function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllBalances(idOwner) {
    return reloadDataBase().filter(balance => balance.idOwner === idOwner);
}

function getBalancePerId(idOwner, id) {
    const filteredBalances = reloadDataBase().filter(
        balance => balance.idOwner === idOwner && balance.id === id
    );

    return filteredBalances.length === 0 ? null : filteredBalances[0];
}

function insertBalance(idOwner, newBalance) {
    const newBalanceWithIds = {
        ...newBalance,
        idOwner: idOwner
    }

    if (newBalance.id !== '1f66c7c6-7a4a-4673-bae8-22233f674848') {
        newBalanceWithIds.id = generateUniqueUserId(
            reloadDataBase().filter(balances => balances.idOwner === idOwner)
        );
    }

    const newBalanceList = [...reloadDataBase(), newBalanceWithIds];
    fs.writeFileSync(dataBase, JSON.stringify(newBalanceList));
}

function modifyBalance(modifications, idOwner, id) {
    let currentBalances = reloadDataBase()
    const indexModified = currentBalances.findIndex(
        balance => balance.idOwner === idOwner && balance.id === id
    )
    const contentChanged = { ...currentBalances[indexModified], ...modifications }
    currentBalances[indexModified] = contentChanged
    fs.writeFileSync(dataBase, JSON.stringify(currentBalances))
}

function excludeBalance(idOwner, id) {
    let currentBalances = reloadDataBase()
    const index = currentBalances.findIndex(
        balance => balance.idOwner === idOwner && balance.id === id
    )
    currentBalances.splice(index, 1)
    fs.writeFileSync(dataBase, JSON.stringify(currentBalances))
}

function addEntryLaunch(userId) {
    const newEntryLaunch = {
        id: '1f66c7c6-7a4a-4673-bae8-22233f674848',
        account: 'Entradas futuras',
        valueBalance: 0
    }
    insertBalance(userId, newEntryLaunch)
}

module.exports = {
    getAllBalances,
    getBalancePerId,
    insertBalance,
    modifyBalance,
    excludeBalance,
    addEntryLaunch
}
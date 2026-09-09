const fs = require('fs');
const dataBaseBalances = "database/balances.json";
const dataBaseEntries = "database/entries.json";

function reloadDataBaseBalances() {
    return JSON.parse(fs.readFileSync(dataBaseBalances));
}

function reloadDataBaseEntries() {
    return JSON.parse(fs.readFileSync(dataBaseEntries));
}

function getTotalEntries(idOwner) {
    const entries = reloadDataBaseEntries().filter(entry => entry.idOwner === idOwner);;
    let totalSum = 0;

    entries.forEach(entry => {
        if (!entry.payed) {
            totalSum += entry.value
        }
    });

    return totalSum;
}

function atualizeFutureEntries(idOwner) {
    let currentBalances = reloadDataBaseBalances()
    const indexModified = currentBalances.findIndex(
        entry => entry.idOwner === idOwner && entry.id === '1f66c7c6-7a4a-4673-bae8-22233f674848'
    )

    const valueBalance = getTotalEntries(idOwner);

    if (indexModified === -1) {
        currentBalances.push({
            id: '1f66c7c6-7a4a-4673-bae8-22233f674848',
            account: 'Entradas futuras',
            valueBalance: valueBalance,
            idOwner: idOwner
        });
    } else {
        currentBalances[indexModified] = { ...currentBalances[indexModified], valueBalance: valueBalance };
    }

    fs.writeFileSync(dataBaseBalances, JSON.stringify(currentBalances))
}

module.exports = {
    atualizeFutureEntries
}
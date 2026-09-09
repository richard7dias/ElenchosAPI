const fs = require('fs');
const dataBase = "database/entries.json";
const { generateUniqueUserId } = require('../idGenerator/id');
const { atualizeFutureEntries } = require('../balances/futureEntries');


function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllEntries(idOwner) {
    return reloadDataBase().filter(entry => entry.idOwner === idOwner);
}

function getEntryById(idOwner, id) {
    const filteredEntry = reloadDataBase().filter(
        entry => entry.idOwner === idOwner && entry.id === id
    );

    return filteredEntry.length === 0 ? null : filteredEntry[0];
}

function insertEntry(idOwner, newEntry) {
    const newEntryWithIds = {
        ...newEntry,
        idOwner: idOwner,
        id: generateUniqueUserId(getAllEntries()),
    }
    const newEntriesList = [...reloadDataBase(), newEntryWithIds];
    fs.writeFileSync(dataBase, JSON.stringify(newEntriesList));

    atualizeFutureEntries(idOwner);
}

function modifyEntry(modifications, idOwner, id) {
    let currentReleases = reloadDataBase()
    const indexModified = currentReleases.findIndex(
        entry => entry.idOwner === idOwner && entry.id === id
    )
    const contentChanged = { ...currentReleases[indexModified], ...modifications }
    currentReleases[indexModified] = contentChanged
    fs.writeFileSync(dataBase, JSON.stringify(currentReleases))

    atualizeFutureEntries(idOwner);
}

function excludeEntry(idOwner, id) {
    let currentReleases = reloadDataBase()
    const index = currentReleases.findIndex(
        entry => entry.idOwner === idOwner && entry.id === id
    )
    currentReleases.splice(index, 1)
    fs.writeFileSync(dataBase, JSON.stringify(currentReleases))

    atualizeFutureEntries(idOwner);
}

module.exports = {
    getAllEntries,
    getEntryById,
    insertEntry,
    modifyEntry,
    excludeEntry
}
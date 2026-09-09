const fs = require('fs');
const dataBase = "database/currency.json";
const { generateUniqueUserId } = require('../idGenerator/id');

function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllCurrencies(idOwner) {
    return reloadDataBase().filter(currency => currency.idOwner === idOwner);
}

function getCurrencyById(idOwner, id) {
    const filteredCurrency = reloadDataBase().filter(
        currency => currency.idOwner === idOwner && currency.id === id
    );

    return filteredCurrency.length === 0 ? null : filteredCurrency[0];
}

function getCurrenciesFilteredByName(idOwner, name) {
    let currenciesFilteredByName = getAllCurrencies(idOwner).filter(
        currency => name == currency.quoteFor || name == currency.quoteFrom
    );
    return currenciesFilteredByName.length === 0 ? null : currenciesFilteredByName;
}

function insertCurrency(idOwner, newCurrency) {
    const newCurrencyWithIds = {
        ...newCurrency,
        idOwner: idOwner,
        id: generateUniqueUserId(reloadDataBase().filter(currency => currency.idOwner === idOwner)),
    }
    const newCurrencyList = [...reloadDataBase(), newCurrencyWithIds];
    fs.writeFileSync(dataBase, JSON.stringify(newCurrencyList));
}

function modifyCurrency(modifications, idOwner, id) {
    let currentCurrency = reloadDataBase()
    const indexModified = currentCurrency.findIndex(
        currency => currency.idOwner === idOwner && currency.id === id
    )
    const contentChanged = { ...currentCurrency[indexModified], ...modifications }
    currentCurrency[indexModified] = contentChanged
    fs.writeFileSync(dataBase, JSON.stringify(currentCurrency))
}

function excludeCurrency(idOwner, id) {
    let currentCurrency = reloadDataBase()
    const index = currentCurrency.findIndex(
        currency => currency.idOwner === idOwner && currency.id === id
    )
    currentCurrency.splice(index, 1)
    fs.writeFileSync(dataBase, JSON.stringify(currentCurrency))
}

function excludeCurrencies(currenciesFilteredByName) {
    let currentCurrency = reloadDataBase();
    currenciesFilteredByName.forEach(element => {
        const index = currentCurrency.findIndex(
            currency => currency.idOwner === element.idOwner && currency.id === element.id
        );
        currentCurrency.splice(index, 1);
    });
    fs.writeFileSync(dataBase, JSON.stringify(currentCurrency))
}

module.exports = {
    getAllCurrencies,
    getCurrencyById,
    getCurrenciesFilteredByName,
    insertCurrency,
    modifyCurrency,
    excludeCurrency,
    excludeCurrencies
}
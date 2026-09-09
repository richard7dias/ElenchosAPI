const fs = require('fs');
const dataBase = "database/sourceExpense.json";
const { generateUniqueUserId } = require('../idGenerator/id');
const { getTotalCurrentMonth } = require('../sourceExpenses/sourceExpenseCalculations');

function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllSourceExpense(idOwner) {
    return reloadDataBase().filter(sourceExpense => sourceExpense.idOwner === idOwner);
}

function getSourceExpenseByDescription(idOwner, id) {
    const filteredSourceExpense = reloadDataBase().filter(
        sourceExpense => sourceExpense.idOwner === idOwner && sourceExpense.id === id
    );

    return filteredSourceExpense.length === 0 ? null : filteredSourceExpense[0];
}

function insertSourceExpense(idOwner, newExpense) {
    let newSourceExpenseWithIds = {
        ...newExpense,
        idOwner: idOwner
    }

    if (newExpense.id !== '9b9f704a-938a-4923-8e63-277ba52007ef') {
        newSourceExpenseWithIds.id = generateUniqueUserId(
            reloadDataBase().filter(sourceExpense => sourceExpense.idOwner === idOwner)
        );
    }

    const newExpenseList = [...reloadDataBase(), newSourceExpenseWithIds];
    fs.writeFileSync(dataBase, JSON.stringify(newExpenseList));
}

function modifySourceExpense(modifications, idOwner, id) {
    let currentExpenses = reloadDataBase()
    const indexModified = currentExpenses.findIndex(
        expense => expense.idOwner === idOwner && expense.id === id
    )
    const contentChanged = { ...currentExpenses[indexModified], ...modifications }
    currentExpenses[indexModified] = contentChanged
    fs.writeFileSync(dataBase, JSON.stringify(currentExpenses))
}

function excludeSourceExpense(idOwner, id) {
    let currentExpenses = reloadDataBase()
    const index = currentExpenses.findIndex(
        expense => expense.idOwner === idOwner && expense.id === id
    )
    currentExpenses.splice(index, 1)
    fs.writeFileSync(dataBase, JSON.stringify(currentExpenses))
}

function addCurrentMonth(userId) {
    const newCurrentMonth = {
        id: '9b9f704a-938a-4923-8e63-277ba52007ef',
        description: 'Mês atual',
        valueExpense: 0
    };
    insertSourceExpense(userId, newCurrentMonth);
}

function refreshCurrentMonthValue(idOwner) {
    const modifidedCurrentMonth = {
        valueExpense: getTotalCurrentMonth(idOwner)
    };
    modifySourceExpense(modifidedCurrentMonth, idOwner, '9b9f704a-938a-4923-8e63-277ba52007ef');
}

function refreshCurrentMonthValueByNumber(idOwner, number) {
    const modifidedCurrentMonth = {
        valueExpense: getTotalCurrentMonth(idOwner) + number
    };
    modifySourceExpense(modifidedCurrentMonth, idOwner, '9b9f704a-938a-4923-8e63-277ba52007ef');
}

module.exports = {
    getAllSourceExpense,
    getSourceExpenseByDescription,
    insertSourceExpense,
    modifySourceExpense,
    excludeSourceExpense,
    addCurrentMonth,
    refreshCurrentMonthValue,
    refreshCurrentMonthValueByNumber
}
const fs = require('fs');
const dataBase = "database/annualCategories.json";
const { generateUniqueUserId } = require('../idGenerator/id');
const { refreshCurrentMonthValue } = require('../annualCategories/annualCategoryCalculations');

function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllAnnualCategories(idOwner) {
    return reloadDataBase().filter(category => category.idOwner === idOwner);
}

function getCategoryId(idOwner, id) {
    const filteredCategories = reloadDataBase().filter(
        category => category.idOwner === idOwner && category.id === id
    );

    return filteredCategories.length === 0 ? null : filteredCategories[0];
}

function insertCategory(idOwner, newCategory) {
    const newCategoryWithIds = {
        ...newCategory,
        idOwner: idOwner,
        id: generateUniqueUserId(reloadDataBase().filter(category => category.idOwner === idOwner))
    }
    const newCategoryList = [...reloadDataBase(), newCategoryWithIds];
    fs.writeFileSync(dataBase, JSON.stringify(newCategoryList));

    refreshCurrentMonthValue(idOwner);
}

function modifyCategory(modifications, idOwner, id) {
    let currentCategories = reloadDataBase()
    const indexModified = currentCategories.findIndex(
        category => category.idOwner === idOwner && category.id === id
    )
    const contentChanged = { ...currentCategories[indexModified], ...modifications }
    currentCategories[indexModified] = contentChanged
    fs.writeFileSync(dataBase, JSON.stringify(currentCategories));

    refreshCurrentMonthValue(idOwner);
}

function excludeCategory(idOwner, id) {
    let currentCategories = reloadDataBase()
    const index = currentCategories.findIndex(
        category => category.idOwner === idOwner && category.id === id)
    currentCategories.splice(index, 1)
    fs.writeFileSync(dataBase, JSON.stringify(currentCategories));

    refreshCurrentMonthValue(idOwner);
}

module.exports = {
    getAllAnnualCategories,
    getCategoryId,
    insertCategory,
    modifyCategory,
    excludeCategory
}
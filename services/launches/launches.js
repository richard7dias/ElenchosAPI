const fs = require('fs');
const dataBase = "database/launches.json";
const { generateUniqueUserId } = require('../idGenerator/id');
const { calculateExpenseValue } = require('../categories/categoriesCalculations');
const { getCategoryId, modifyCategory } = require('../categories/categories');
const { refreshCurrentMonthValue } = require('../sourceExpenses/sourceExpense');

function reloadDataBase() {
    return JSON.parse(fs.readFileSync(dataBase));
}

function getAllLaunches(idOwner) {
    return reloadDataBase().filter(launch => launch.idOwner === idOwner);
}

function getLaunchesByMonth(monthNumber, idOwner) {
    return getAllLaunches(idOwner).filter(launch => {
        const launchMonth = parseInt(launch.date.split('-')[1]);
        return launchMonth === parseInt(monthNumber);
    });
}

function getLaunchById(idOwner, id) {
    const filteredLaunch = reloadDataBase().filter(
        launch => launch.idOwner === idOwner && launch.id === id
    );

    return filteredLaunch.length === 0 ? null : filteredLaunch[0];
}

function insertLaunch(idOwner, newLaunch) {
    const newLaunchWithIds = {
        ...newLaunch,
        idOwner: idOwner,
        id: generateUniqueUserId(reloadDataBase().filter(launche => launche.idOwner === idOwner)),
    }
    const newLaunchesList = [...reloadDataBase(), newLaunchWithIds];
    fs.writeFileSync(dataBase, JSON.stringify(newLaunchesList));

    setExpenseAndAvailableValueByCategory(idOwner, newLaunch);
    refreshCurrentMonthValue(idOwner);
}

function modifyLaunch(modifications, idOwner, id) {
    let currentReleases = reloadDataBase();
    const indexModified = currentReleases.findIndex(
        launch => launch.idOwner === idOwner && launch.id === id
    );

    let launch = currentReleases[indexModified];

    const contentChanged = { ...currentReleases[indexModified], ...modifications };
    currentReleases[indexModified] = contentChanged;
    fs.writeFileSync(dataBase, JSON.stringify(currentReleases));

    setExpenseAndAvailableValueByCategory(idOwner, launch);
    refreshCurrentMonthValue(idOwner);
}

function excludeLaunch(idOwner, id) {
    let currentReleases = reloadDataBase();
    const index = currentReleases.findIndex(
        launch => launch.idOwner === idOwner && launch.id === id
    );

    let launch = currentReleases[index];

    currentReleases.splice(index, 1);
    fs.writeFileSync(dataBase, JSON.stringify(currentReleases));

    setExpenseAndAvailableValueByCategory(idOwner, launch);
    refreshCurrentMonthValue(idOwner);
}

function setExpenseAndAvailableValueByCategory(idOwner, launch) {
    let category = getCategoryId(idOwner, launch.categoryId);

    if (!category) {
        return;
    }

    let expense = calculateExpenseValue(idOwner, launch.categoryId);

    body = {
        expense: expense,
        available: category.budget - expense
    };

    modifyCategory(body, idOwner, launch.categoryId)
}

module.exports = {
    getAllLaunches,
    getLaunchesByMonth,
    getLaunchById,
    insertLaunch,
    modifyLaunch,
    excludeLaunch
}
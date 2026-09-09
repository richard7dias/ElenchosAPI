const fs = require('fs');
const dataBaseLaunches = "database/launches.json";
const dataBaseCategories = "database/categories.json";

function reloadDataBaseLaunches() {
    return JSON.parse(fs.readFileSync(dataBaseLaunches));
}

function reloadDataBaseCategories() {
    return JSON.parse(fs.readFileSync(dataBaseCategories));
}

function getAllCategories(idOwner) {
    return reloadDataBaseCategories().filter(category => category.idOwner === idOwner);
}

function getAllLaunches(idOwner) {
    return reloadDataBaseLaunches().filter(launch => launch.idOwner === idOwner);
}

function getLaunchesByMonth(monthNumber, idOwner) {
    return getAllLaunches(idOwner).filter(launch => {
        const launchMonth = parseInt(launch.date.split('-')[1]);
        return launchMonth === parseInt(monthNumber);
    });
}

function calculateExpenseValue(idOwner, categoryId) {
    let currentMonth = new Date().getMonth() + 1;

    let categories = getAllCategories(idOwner);
    let launches = getLaunchesByMonth(currentMonth, idOwner);

    if (categories && categories.length > 0 && launches) {
        const filteredLaunchesByCategory = launches
            .filter(launch => launch.categoryId === categoryId);

        const sumMonthExpenses = filteredLaunchesByCategory
            .map(obj => obj.value)
            .reduce((acc, value) => acc + value, 0);

        return sumMonthExpenses;
    } else {
        return 0;
    }
}

module.exports = {
    calculateExpenseValue
}
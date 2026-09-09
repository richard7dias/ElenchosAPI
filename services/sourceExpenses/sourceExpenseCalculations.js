const fs = require('fs');
const dataBaseCategories = "database/categories.json";

function reloadDataBaseCategories() {
    return JSON.parse(fs.readFileSync(dataBaseCategories));
}

function getAllCategories(idOwner) {
    return reloadDataBaseCategories().filter(category => category.idOwner === idOwner);
}

function getTotalCurrentMonth(idOwner) {
    const categories = getAllCategories(idOwner);

    if (categories && categories.length > 0) {
        const sum = categories
            .map(obj => obj.available)
            .reduce((acc, value) => acc + value, 0);
        return sum;
    } else {
        return 0;
    }
}

module.exports = {
    getTotalCurrentMonth
}
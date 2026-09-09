const fs = require('fs');
const { refreshCurrentMonthValueByNumber } = require('../sourceExpenses/sourceExpense');
const { calculateExpenseValue } = require('../categories/categoriesCalculations');

const annualCategoryId = '80280f52-61d8-4b36-869b-2030d0e176fq';

function getAllAnnualCategoriesByMonth(idOwner, month) {
    return JSON.parse(fs.readFileSync("database/annualCategories.json")).filter(
        category => category.idOwner === idOwner &&
            category.monthOfPayment === month
    );
}

function refreshCurrentMonthValue(idOwner) {
    const currentMonth = new Date().getMonth() + 1;
    const annualCategoriesByCurrentMont = getAllAnnualCategoriesByMonth(idOwner, currentMonth);
    let totalSumValue = 0;

    annualCategoriesByCurrentMont.forEach(category => {
        totalSumValue += category.value
    });

    refreshCurrentMonthValueByNumber(idOwner, totalSumValue);
}

function checkAnnualCategories(idOwner) {
    const categoriesDataBase = JSON.parse(fs.readFileSync("database/categories.json"));
    let allCategories = categoriesDataBase.filter(category => category.idOwner === idOwner);
    const currentMonth = new Date().getMonth() + 1;
    const annualCategoriesByCurrentMont = getAllAnnualCategoriesByMonth(idOwner, currentMonth);

    if (annualCategoriesByCurrentMont.length > 0) {
        let totalSumValue = 0;
        annualCategoriesByCurrentMont.forEach(category => {
            const expense = calculateExpenseValue(idOwner, annualCategoryId);

            let convertedAnnualCategory = {
                expense: expense,
                available: category.value - expense,
                id: annualCategoryId,
                idOwner: category.idOwner,
                name: category.description,
                budget: category.value
            };

            allCategories.push(convertedAnnualCategory);
            totalSumValue += category.value
        });
        refreshCurrentMonthValueByNumber(idOwner, totalSumValue);
    }

    return allCategories;
}

module.exports = {
    refreshCurrentMonthValue,
    checkAnnualCategories
}
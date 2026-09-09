const express = require("express");

const balancesRoute = require("./routes/balances/balances");
const categoriesRoute = require("./routes/categories/categories");
const annualCategoriesRoute = require("./routes/annualCategories/annualCategories");
const currencyRoute = require("./routes/currencies/currency");
const entriesRoute = require("./routes/entries/entries");
const launchesRoute = require("./routes/launches/launches");
const sourceExpenseRoute = require("./routes/sourceExpenses/sourceExpense");
const usersRoute = require("./routes/users/users");

const cors = require("cors");
const app = express();
const port = 8000;

// Rotas para dados diretos do bd
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/balances', balancesRoute);
app.use('/categories', categoriesRoute);
app.use('/annual-categories', annualCategoriesRoute);
app.use('/currency', currencyRoute);
app.use('/entries', entriesRoute);
app.use('/launches', launchesRoute);
app.use('/source-expenses', sourceExpenseRoute);
app.use('/users', usersRoute);

// Rotas para informações processadas


// Ao rodar
app.listen(port, () => {
    console.log(`listening to the port ${port}`)
});

//Para rodar, comando: node app.js
//http://localhost:8000/
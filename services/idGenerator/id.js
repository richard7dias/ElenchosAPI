const { v4: uuidv4 } = require('uuid');

function generateUniqueUserId(list) {
    let newId;
    let isUnique = false;

    while (!isUnique) {
        newId = uuidv4();
        isUnique = !list.some(user => user.id === newId);
    }

    return newId;
}

module.exports = {
    generateUniqueUserId
}
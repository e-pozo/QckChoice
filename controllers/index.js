const person = require('./personController');
const local = require('./localPersonController');
const session = require('./sessionController');

module.exports = {
    person,
    local,
    session
};

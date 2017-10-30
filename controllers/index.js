const person = require('./personController');
const local = require('./localPersonController');
const session = require('./sessionController');
const vote = require('./voteController');

module.exports = {
    person,
    local,
    session,
    vote
};

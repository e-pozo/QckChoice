const person = require('./personController');
const local = require('./localPersonController');
const session = require('./sessionController');
const vote = require('./voteController');
const event = require('./eventController');
const choice = require('./choiceController');

module.exports = {
    person,
    local,
    session,
    event,
    vote,
    choice
};

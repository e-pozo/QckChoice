'use strict'

const Sequelize = require('sequelize');
const connection = new Sequelize('ADWS PyramidWorks DB', 'root', 'pass1234',{dialect: 'mysql'});
const Article = connection.define('article', {
    title: Sequelize.STRING,
    content: Sequelize.STRING
});

const Person = connection.define('person',{
    userName: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    imgURL: Sequelize.TEXT
},{
    timestamps: false
});

const Registered = connection.define('person',{
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},{
    timestamps: false
});

const Session = connection.define('session',{
    title: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    }
});

const Event = connection.define('event', {
    timeTaked: {
        type: Sequelize.TIME,
        allowNull: false
    },
    objective: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

const Decision = connection.define('decision', {
    name: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    mechanism: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    result: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},{
        timestamps: false
});

connection.sync({
    force: true,
    logging: console.log
});
module.exports = connection;

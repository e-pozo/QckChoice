const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const db = {};

let sequelize = new Sequelize('ADSW PyramidWorks DB', 'root', 'pass1234',{dialect: 'mysql'});

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize.sync().then(() => {
    //All Ok. Query is displayed.
}).catch(error => {
    console.log(error);
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

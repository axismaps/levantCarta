const Sequelize = require('sequelize');
const UserModel = require('./models/user');

// Connect to postgres
const sequelize = new Sequelize('postgres://username:Dummy123@postgres:5432/levantcarta-store')

// Test Connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Sequelize Models 
const User = UserModel(sequelize, Sequelize);

// Sync db
sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!')
})

module.exports = {
    User
}
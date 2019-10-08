const Sequelize = require('sequelize');
const UserModel = require('./models/user');

// Connect to postgres
// const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres:5432/${process.env.POSTGRES_DB}`)
const sequelize = new Sequelize('postgres://postgres:@localhost:5432/postgres');

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
const router = require('express').Router();
const { User } = require('./../sequelize');


router.post('/users', (req, res) => {
    User.create(req.body).then(user => res.json(user))
})

router.get('/users', (req, res) => {
    User.findAll().then(users => res.json(users))
})

module.exports = router;
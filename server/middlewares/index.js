const router = require('express').Router();

const user = require('./user');

router.use(user)

module.exports = router
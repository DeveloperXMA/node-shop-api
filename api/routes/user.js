const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

router.post('/signup', UserController.user_signup);

router.get('/', UserController.user_get_all);

router.delete('/:userId', checkAuth, UserController.user_delete);

router.post('/login', UserController.user_login);

module.exports = router;
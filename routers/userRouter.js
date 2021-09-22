const express = require('express');
const router = express.Router();

const {
  userRegister,
  userLogin,
  userVerify,
  userLogOut,
} = require('../controllers/userController');

// @desc Register User
// @route POST /
router.post('/', userRegister);

// @desc Log In User
// @route POST /login
router.post('/login', userLogin);

// @desc Verify User
// @route GET /loggedIn
router.get('/loggedIn', userVerify);

// @desc Log Out User
// @route get /logOut
router.get('/logOut', userLogOut);

module.exports = router;

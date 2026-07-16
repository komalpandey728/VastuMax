const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  guestSession,
} = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/guest', guestSession);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;

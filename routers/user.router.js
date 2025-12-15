const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

//http://localhost:5000/api/v1/user/register
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;

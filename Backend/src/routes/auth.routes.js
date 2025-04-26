
const { Router } = require("express");
const { register, login , profile} = require("../controllers/auth.controller");
const userAuth = require("../middlewares/userAuth");
const router  = Router();

router.get("/me", userAuth, profile)

router.post("/register", register);

router.post("/login", login)

module.exports = router;
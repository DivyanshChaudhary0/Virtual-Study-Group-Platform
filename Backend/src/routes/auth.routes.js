
const { Router } = require("express");
const { register, login , profile} = require("../controllers/auth.controller");
const router  = Router();

router.get("/me", profile)

router.post("/register", register);

router.post("/login", login)

module.exports = router;
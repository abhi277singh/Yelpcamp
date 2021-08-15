const express = require("express")
const router = express.Router();
const passport = require("passport")
const { renderRegister, makingNewUser, renderLogin, loginUser, logoutUser } = require("../controller/user")

router.route("/register")
    .get(renderRegister)
    .post(makingNewUser)

router.route("/login")
    .get(renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), loginUser)

router.get("/logout", logoutUser)

module.exports = router;

const express = require("express")
const router = express.Router();
const User = require("../models/user")
const passport = require("passport")


router.get("/register", (req, res) => {
    res.render("user/register")
})
router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email })
        const registerUser = await User.register(user, password)
        req.login(registerUser, (err) => {
            if (err) return next(err)
            else {
                req.flash("success", "Successfully Registered")
                res.redirect("/campgrounds")
            }
        })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
})
router.get("/login", (req, res) => {
    res.render("user/login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome Back")
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye")
    res.redirect("/campgrounds")
})

module.exports = router;

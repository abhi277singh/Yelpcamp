const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")

module.exports.renderRegister = (req, res) => {
    res.render("user/register")
}

module.exports.makingNewUser = async (req, res, next) => {
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
}
module.exports.renderLogin = (req, res) => {
    res.render("user/login")
}
module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome Back")
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}
module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye")
    res.redirect("/campgrounds")
}

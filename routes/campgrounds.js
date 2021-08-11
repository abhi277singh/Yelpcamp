const express = require("express")
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const Review = require("../models/review")
const { campgroundSchema } = require("../schemas.js")
const isLoggedIn = require("../middleware")


const campgroundValidate = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const isAuthenticated = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You are not authorised to do that")
        return res.redirect(`/campgrounds/${campground._id}`);
    } next();
}



router.get("/", catchAsync(async (req, res, next) => {
    const campground = await Campground.find({});
    res.render("campgrounds/index", { campground })
}))
router.get("/new", isLoggedIn, (req, res) => {

    res.render("campgrounds/new")
})
router.post("/", isLoggedIn, campgroundValidate, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash("success", "Successfully created a Campground")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews").populate("author");
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })
}))
router.get("/:id/edit", isLoggedIn, isAuthenticated, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}))
router.put("/:id", isLoggedIn, isAuthenticated, campgroundValidate, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", "Successfully update the Campground")
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete("/:id", isLoggedIn, isAuthenticated, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Campground")
    res.redirect("/campgrounds")
}))


module.exports = router;
const express = require("express")
const router = express.Router({ mergeParams: true });
const isLoggedIn = require("../middleware")
const Campground = require("../models/campground")
const Review = require("../models/review")

const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

const { reviewSchema } = require("../schemas.js")


const reviewValidate = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post("/", reviewValidate, isLoggedIn, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully added a Review")
    res.redirect(`/campgrounds/${campground._id}`);
}));
router.delete("/:reviewId", isLoggedIn, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review.id } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
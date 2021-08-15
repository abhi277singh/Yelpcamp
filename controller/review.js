const Campground = require("../models/campground")
const Review = require("../models/review")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

module.exports.postReview = catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully added a Review")
    res.redirect(`/campgrounds/${campground._id}`);
})
module.exports.deleteReview = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review")
    res.redirect(`/campgrounds/${id}`);
})
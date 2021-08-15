const express = require("express")
const router = express.Router({ mergeParams: true });
const { reviewValidate, isLoggedIn, isReviewAuth } = require("../middleware")
const { postReview, deleteReview } = require("../controller/review")

router.post("/", reviewValidate, isLoggedIn, postReview)
router.delete("/:reviewId", isLoggedIn, isReviewAuth, deleteReview)

module.exports = router;
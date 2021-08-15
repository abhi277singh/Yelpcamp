const express = require("express")
const router = express.Router();
const { isLoggedIn, isAuthenticated, campgroundValidate } = require("../middleware")
const { index, renderNew, showCampground, renderEdit, editCampground, deleteCampground, makeNew } = require("../controller/campground")
const multer = require('multer')
const { storage } = require("../cloudinary")
const upload = multer({ storage })
const Campground = require('../models/campground');

router.route("/")
    .get(index)
    .post(isLoggedIn, upload.array("image"), campgroundValidate, makeNew)



router.get("/new", isLoggedIn, renderNew)

router.route("/:id")
    .get(showCampground)
    .put(isLoggedIn, isAuthenticated, upload.array("image"), campgroundValidate, editCampground)
    .delete(isLoggedIn, isAuthenticated, deleteCampground)

router.get("/:id/edit", isLoggedIn, isAuthenticated, renderEdit)

module.exports = router;
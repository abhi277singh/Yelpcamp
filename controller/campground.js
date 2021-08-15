const Campground = require("../models/campground")
const catchAsync = require("../utils/catchAsync")
const { cloudinary } = require("../cloudinary");


module.exports.index = catchAsync(async (req, res, next) => {
    const campground = await Campground.find({});
    res.render("campgrounds/index", { campground })
})

module.exports.renderNew = (req, res) => {

    res.render("campgrounds/new")
}
module.exports.makeNew = catchAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id

    await campground.save();
    req.flash("success", "Successfully created a Campground")
    res.redirect(`/campgrounds/${campground._id}`)
})
module.exports.showCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })
})
module.exports.renderEdit = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
})
module.exports.editCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    await campground.save();
    req.flash("success", "Successfully updated the Campground")
    res.redirect(`/campgrounds/${campground._id}`)
})
module.exports.deleteCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Campground")
    res.redirect("/campgrounds")
})
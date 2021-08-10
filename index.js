const express = require("express")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const path = require("path")
const { campgroundSchema, reviewSchema } = require("./schemas.js")
const Review = require("./models/review")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override")
const Campground = require("./models/campground")
const review = require("./models/review")


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => {
    console.log("Database Connected")
})

const app = express()

app.engine("ejs", ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

const campgroundValidate = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const reviewValidate = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get("/", (req, res) => {
    res.render("home")
})

app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campground = await Campground.find({});
    res.render("campgrounds/index", { campground })
}))
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})
app.post("/campgrounds", campgroundValidate, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground })
}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit", { campground })
}))
app.put("/campgrounds/:id", campgroundValidate, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))
app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
}))

app.post("/campgrounds/:id/reviews", reviewValidate, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review.id } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Error Not Found", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh No, Something went wrong";
    res.status(status).render("error", { err })
})

app.listen(3000, () => {
    console.log("Listening")
})
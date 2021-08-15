const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")


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
const sample = (array => array[Math.floor(Math.random() * array.length)])

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: "61140ac57e1d2803d01f7632",
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit dignissimos repellat ullam voluptas cum tempora velit neque quam quod cupiditate. Mollitia officiis sapiente tempore rem minima! Quia incidunt aspernatur sunt.",
            location: `${cities[random1000].state}, ${cities[random1000].city}`,
            price,
            images: [
                {

                    url: 'https://res.cloudinary.com/abhi277singh/image/upload/v1629015868/YelpCamp/ot9q5qhnrxegvg1dpauw.jpg',
                    filename: 'YelpCamp/ot9q5qhnrxegvg1dpauw'
                },
                {

                    url: 'https://res.cloudinary.com/abhi277singh/image/upload/v1629015876/YelpCamp/bd6rncyzlgyqgjpdo8vu.jpg',
                    filename: 'YelpCamp/bd6rncyzlgyqgjpdo8vu'
                },
                {

                    url: 'https://res.cloudinary.com/abhi277singh/image/upload/v1629015902/YelpCamp/snabmq7ykl7tqnby62tl.jpg',
                    filename: 'YelpCamp/snabmq7ykl7tqnby62tl'
                }
            ]
        })
        await camp.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close()
})
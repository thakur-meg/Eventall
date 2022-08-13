const mongoose = require('mongoose');
const cities = require('./cities');
const { game, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(game)}`,
            image: 'https://source.unsplash.com/collection/4959235',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae deserunt omnis soluta odit eveniet ipsam nulla facere reiciendis? Mollitia aut nam asperiores eligendi soluta doloribus. Sit et iste maxime excepturi.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
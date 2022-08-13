const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    date : String,
    time: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');


const catchAsync = require('../utils/catchAsync');
 const { campgroundSchema } = require('../schemas.js');

 const ExpressError = require('../utils/ExpressError');
 const Campground = require('../models/campground');

 const validateCampground = (req, res, next) => {
     const { error } = campgroundSchema.validate(req.body);
     if (error) {
         const msg = error.details.map(el => el.message).join(',')
         throw new ExpressError(msg, 400)
     } else {
         next();
     }
 }

 router.get('/', catchAsync(async (req, res) => {
     const campgrounds = await Campground.find({});
     res.render('campgrounds/index', { campgrounds })
 }));

 router.get('/new', isLoggedIn, (req, res) => {
     res.render('campgrounds/new');
 })


 router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
     const campground = new Campground(req.body.campground);
     await campground.save();
     req.flash('success', 'Successfully created a new event!');
     res.redirect(`/events/${campground._id}`)
 }))

 router.get('/:id', catchAsync(async (req, res,) => {
     const campground = await Campground.findById(req.params.id).populate('reviews');
     if (!campground) {
        req.flash('error', 'Cannot find that event!');
        return res.redirect('/events');
    }
     res.render('campgrounds/show', { campground });
 }));

 router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
     const campground = await Campground.findById(req.params.id)
     if (!campground) {
        req.flash('error', 'Cannot find that event!');
        return res.redirect('/events');
    }
     res.render('campgrounds/edit', { campground });
 }))

 router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
     const { id } = req.params;
     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
     req.flash('success', 'Successfully updated event!');
     res.redirect(`/events/${campground._id}`)
 }));

 router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
     const { id } = req.params;
     await Campground.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted event!');
     res.redirect('/events');
 }));

 module.exports = router; 
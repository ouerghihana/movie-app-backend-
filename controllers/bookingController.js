const Bookings = require('../models/Bookings');
const Movie = require('../models/Movie');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;

  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);

    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = new Bookings({
      movie: existingMovie._id,
      date: new Date(date),
      seatNumber,
      user: existingUser._id
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingUser.bookings.push(booking._id);
    existingMovie.bookings.push(booking._id);

    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to create booking" });
  }
};


exports.getBookingById = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const booking = await Bookings.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch booking" });
  }
};



    exports.getAllBookings = async (req, res, next) => {
      try {
        const bookings = await Bookings.find();
        return res.status(200).json({ bookings });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to fetch bookings" });
      }
    };
    


    exports.deleteBooking = async (req, res, next) => {
      const { id } = req.params;
    
      try {
        const booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
    
        if (!booking.user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const session = await mongoose.startSession();
        session.startTransaction();
    
        booking.user.bookings.pull(booking);
        booking.movie.bookings.pull(booking);
        await booking.movie.save({ session });
        await booking.user.save({ session });
        await session.commitTransaction();
    
        return res.status(200).json({ message: "Booking deleted", booking });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to delete booking" });
      }
    };
    

    
    
    
    
    
    

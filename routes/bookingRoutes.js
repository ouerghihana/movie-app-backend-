const express = require('express');
const bookingRouter = express.Router();
const {newBooking,getAllBookings, getBookingById,deleteBooking} = require('../controllers/bookingController')



// Route pour créer un nouveau booking
bookingRouter.post('/',newBooking );

// Route pour get all booking par son ID
bookingRouter.get('/:id',getBookingById );

// Route pour récupérer tous les bookings
bookingRouter.get('/', getAllBookings);

 // Route pour supprimer un film par son ID
 bookingRouter.delete('/:id',deleteBooking );

 // Route pour mettre à jour un film par son ID
// router.put('/:id', movieController.updateMovie);




module.exports = bookingRouter;
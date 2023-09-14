const express = require('express');
const movieRouter = express.Router();
const { addMovie,getAllMovies , getMovieById, deleteMovieById} = require('../controllers/movieControllers');

// Route pour récupérer tous les films
movieRouter.get('/', getAllMovies);

// Route pour créer un nouveau film
movieRouter.post('/', addMovie);

// Route pour récupérer un film par son ID
movieRouter.get('/:id', getMovieById);


// // Route pour supprimer un film par son ID
movieRouter.delete('/:id', deleteMovieById);

module.exports = movieRouter;

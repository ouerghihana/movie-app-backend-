const Movie = require('../models/Movie');
const Admin= require('../models/Admin')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
 // Contrôleur pour récupérer tous les films
 exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    if (!movies) {
      return res.status(500).json({ message: 'Request failed' });
    }
    res.status(200).json(movies);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Request failed' });
  }
};



 // Contrôleur pour récupérer un film par son ID
 exports.getMovieById = async (req, res, next) => {
   const id = req.params.id;
let movie;
 try {
      movie = await Movie.findById(id);
    } catch (err) {
        return    console.log(err);
        }
   if (!movie) {
      return res.status(404).json({ message: 'Invalid Movies ID' });
    }
     res.status(200).json(movie);
 };

// Contrôleur pour créer un nouveau film
exports.addMovie = async (req, res, next) => {
    const extractedToken = req.headers.authorization.split(' ')[1];
    if (!extractedToken || extractedToken.trim() === '') {
      return res.status(401).json({ message: 'Token not found' });
    }
  
    let adminId;
    // Verify token
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
      if (err) {
        return res.status(400).json({ message: `${err.message}` });
      } else {
        adminId = decrypted.id;
      }
    });
  
    const { title, description, actors, releaseDate, posterUrl, trailer,featured } = req.body;
  
    // Check if any required field is missing or empty
    if (
      !title ||
      title.trim() === '' ||
      !description ||
      description.trim() === '' ||
      !releaseDate ||
      releaseDate.trim() === '' ||
      !trailer || 
      trailer.trim() === '' ||
      !posterUrl ||
      posterUrl.trim() === '' ||
      featured === undefined
    ) {
      return res.status(400).json({ message: 'Invalid inputs' });
    }
  
    let movie;
    try {
      movie = new Movie({
        title,
        description,
        actors,
        releaseDate: new Date(`${releaseDate}`),
        posterUrl,
        trailer,
        featured,
        admin: adminId
      });
      const session= await mongoose.startSession();
   const adminUser = await Admin.findById(adminId);

    session.startTransaction();
    await movie.save({session});
    adminUser.addedMovies.push(movie)
    await adminUser.save({session});
    await session.commitTransaction()
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Request failed' });
    }
  
    if (!movie) {
      return res.status(500).json({ message: 'Request failed' });
    }
  
    return res.status(201).json({ message: 'Movie created', movie });
  };
  

// Contrôleur pour supprimer un film par son ID
exports.deleteMovieById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const movie = await Movie.findByIdAndRemove(id);
    if (!movie) {
      return res.status(404).json({ message: 'Invalid Movie ID' });
    }

    return res.status(200).json({ message: 'Movie deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Request failed' });
  }
};


const express = require('express');
const {
  getAllUsers,
  signup,
  login,
  updateUser,
  deleteUser,
  getBookingsOfUser,
  getUserById
} = require('../controllers/user-controller');

const userRouter = express.Router();

// Route pour créer un nouvel utilisateur
userRouter.post('/signup', signup);
userRouter.get('/:id', getUserById)


// Route pour récupérer tous les utilisateurs
userRouter.get('/', getAllUsers);

// Route pour mettre à jour un utilisateur spécifique par son ID
userRouter.put('/:id', updateUser);

// Route pour supprimer un utilisateur spécifique par son ID
userRouter.delete('/:id', deleteUser);

// Route pour authentification
userRouter.post('/login', login);

userRouter.get('/bookings/:id', getBookingsOfUser);

module.exports = userRouter;

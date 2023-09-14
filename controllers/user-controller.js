const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Bookings= require('../models/Bookings')
// Contrôleur pour créer un nouvel utilisateur
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name ||
     name.trim() === '' ||
   !email ||
    email.trim() === '' ||
     !password || 
    password.trim() === '') {
    return res.status(422).json({ message: 'Invalid input' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Unexpected error' });
  }

  if (!user) {
    return res.status(500).json({ message: 'Unexpected error' });
  }

  return res.status(201).json({ id: user._id});
};

// Contrôleur pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(500).json({ message: 'Unexpected error' });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Unexpected error' });
  }
};

// Contrôleur pour mettre à jour un utilisateur spécifique par son ID
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  if (!name || name.trim() === '' || !email || email.trim() === '' || !password || password.trim() === '') {
    return res.status(422).json({ message: 'Invalid input' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  let user;
  try {
    user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  if (!user) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  return res.status(200).json({ msg: 'Updated successfully' });
};

// Contrôleur pour supprimer un utilisateur spécifique par son ID
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  if (!user) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  return res.status(200).json({ message: 'Deleted successfully' });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
    return res.status(422).json({ message: 'Invalid input' });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  if (!existingUser) {
    return res.status(404).json({ message: 'Unable to find user' });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  return res.status(200).json({ message: 'Login successfully', id: existingUser._id });
};


exports.getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const bookings = await Bookings.find({ user: id }).populate('user', 'name email').populate('movie', 'title');

    if (!bookings) {
      return res.status(500).json({ message: 'No bookings found' });
    }

    return res.status(200).json({ bookings });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Unexpected error' });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(500).json({ message: 'Unexpected error' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Unexpected error' });
  }
};

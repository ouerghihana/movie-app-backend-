const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.addAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
    return res.status(422).json({ message: 'Invalid input' });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  if (existingAdmin) {
    return res.status(400).json({ msg: 'Admin already exists' });
  }

  let admin;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Admin not created' });
  }

  if (!admin) {
    return res.status(400).json({ msg: 'Admin not created' });
  }

  res.status(201).json({ msg: 'Admin created successfully', admin });
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
    return res.status(422).json({ message: 'Invalid input' });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }

  if (!existingAdmin) {
    return res.status(400).json({ msg: 'Admin not found' });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: 'Incorrect password' });
  }

  const token = jwt.sign({id:existingAdmin._id}, process.env.SECRET_KEY)

  return res.status(200).json({ message: 'Authentication complete',token,id:existingAdmin._id });
};



exports.getAllAdmins = async (req, res, next) => {
    try {
      const admins = await Admin.find();
      
      res.status(200).json(admins);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };

  exports.getAdminById = async (req, res, next) => {
    const id = req.params.id;
  
    try {
      const admin = await Admin.findById(id).populate("addedMovies");
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.status(200).json({admin});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
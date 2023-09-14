const express = require('express');
const { addAdmin, adminLogin, getAllAdmins,getAdminById } = require('../controllers/adminController');

const adminRouter = express.Router();
adminRouter.post('/signup', addAdmin);
adminRouter.post('/login', adminLogin);
adminRouter.get('/', getAllAdmins);
adminRouter.get("/:id", getAdminById)
module.exports = adminRouter;

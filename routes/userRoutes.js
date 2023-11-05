const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
userRouter.use(authController.protect);

userRouter.patch('/updateMyPassword', authController.updatePassword);
userRouter.get('/me', userController.getMe, userController.getSingleUser);
userRouter.patch('/updateMe', userController.updateMe);
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(userController.getAllUsers);
userRouter
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;

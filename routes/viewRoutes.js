const express = require('express');
const viewController = require('../controller/viewController');

const app = express.Router();

app.get('/', viewController.getOverview);
app.get('/tour/:slug', viewController.getTour);

app.get('/login', viewController.Login);

module.exports = app;

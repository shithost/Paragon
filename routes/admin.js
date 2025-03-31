const express = require('express');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/admin/home', isAuthenticated, (req, res) => {
    res.render('admin', { title: 'Paragon' });
});

module.exports = router;
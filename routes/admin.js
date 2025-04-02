const express = require('express');
const isAuthenticated = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

router.get('/admin/home', isAuthenticated, async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, '../users.json'), 'utf8');
        const users = JSON.parse(data);
        const totalUsers = users.length;
        res.render('admin', { title: 'Paragon', totalUsers });
    } catch (err) {
        console.error('Error reading users.json:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin/users', isAuthenticated, async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, '../users.json'), 'utf8');
        const users = JSON.parse(data);
        res.render('admin-users', { title: 'Paragon', users });
    } catch (err) {
        console.error('Error reading users.json:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin/users/create', isAuthenticated, (req, res) => {
    res.render('create-user', { title: 'Paragon' });
});

module.exports = router;
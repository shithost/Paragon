const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

const usersFilePath = path.join(__dirname, '../users.json');

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('index', { title: 'Paragon', errorMessage: '' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.render('index', { title: 'Paragon', errorMessage: 'Error during login' });
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.render('index', { title: 'Paragon', errorMessage: 'Error verifying password' });
                } else if (result) {
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    res.render('index', { title: 'Paragon', errorMessage: 'Invalid email or password' });
                }
            });
        } else {
            res.render('index', { title: 'Paragon', errorMessage: 'Invalid email or password' });
        }
    });
});

router.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { title: 'Paragon' });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/');
    });
});

module.exports = router;
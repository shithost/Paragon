const express = require('express');
const isAuthenticated = require('../middleware/auth');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFilePath = path.join(__dirname, '..', 'users.json');

router.get('/account/profile', isAuthenticated, (req, res) => {
    res.render('profile', { title: 'Paragon' });
});

router.post('/account/change-password', isAuthenticated, (req, res) => {
    const { 'current-password': currentPassword, 'new-password': newPassword } = req.body;
    const userId = req.user.id;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send('Error updating password');
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        bcrypt.compare(currentPassword, user.password, (err, result) => {
            if (err) {
                res.status(500).send('Error verifying password');
            } else if (result) {
                bcrypt.hash(newPassword, 10, (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).send('Error updating password');
                    }
                
                    user.password = hash;

                    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing user data:', err);
                            return res.status(500).send('Error updating password');
                        }
                        res.redirect('/logout');
                    });
                });
            } else {
                res.status(401).send('Current password is incorrect');
            }
        });
    });
});

module.exports = router;
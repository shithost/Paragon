const express = require('express');
const isAuthenticated = require('../middleware/auth');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const usersFilePath = path.join(__dirname, '..', 'users.json');

function generateApiKey() {
    const randomBytes = crypto.randomBytes(6);
    const base64String = randomBytes.toString('base64').replace(/\+/g, '').replace(/\//g, '').slice(0, 11);
    return `paragon-${base64String}`;
}

router.get('/account/profile', isAuthenticated, (req, res) => {
    res.render('profile', { title: 'Paragon' });
});

router.get('/account/api', isAuthenticated, (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send('Internal server error');
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(u => u.id === req.user.id);

            if (!user) {
                return res.status(404).send('User not found');
            }

            const apiKeys = Object.keys(user).filter(k => k.startsWith('apikey'));
            const apiKeyCount = apiKeys.length;

            res.render('user-api', {
                title: 'Paragon',
                user,
                apiKeys,
                apiKeyCount
            });
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return res.status(500).send('Internal server error');
        }
    });
});

router.post('/account/change-password', isAuthenticated, (req, res) => {
    const { 'current-password': currentPassword, 'new-password': newPassword } = req.body;
    const userId = req.user.id;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send('Internal server error');
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(u => u.id === userId);

            if (!user) {
                return res.status(404).send('User not found');
            }

            bcrypt.compare(currentPassword, user.password, (err, result) => {
                if (err) {
                    console.error('Error verifying password:', err);
                    return res.status(500).send('Internal server error');
                }

                if (result) {
                    bcrypt.hash(newPassword, 10, (err, hash) => {
                        if (err) {
                            console.error('Error hashing password:', err);
                            return res.status(500).send('Internal server error');
                        }

                        user.password = hash;

                        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                            if (err) {
                                console.error('Error writing user data:', err);
                                return res.status(500).send('Internal server error');
                            }
                            res.redirect('/logout');
                        });
                    });
                } else {
                    return res.status(401).send('Current password is incorrect');
                }
            });
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return res.status(500).send('Internal server error');
        }
    });
});

router.post('/account/api/generate', isAuthenticated, (req, res) => {
    const userId = req.user.id;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send('Internal server error');
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(u => u.id === userId);

            if (!user) {
                return res.status(404).send('User not found');
            }

            const apiKeys = Object.keys(user).filter(k => k.startsWith('apikey'));
            const apiKeyCount = apiKeys.length;

            if (apiKeyCount >= 10) {
                return res.status(400).send('Maximum number of API keys reached (10)');
            }

            const newApiKey = generateApiKey();
            const apiKeyName = `apikey${apiKeyCount + 1}`;

            if (user[apiKeyName]) {
                return res.status(400).send('API key already exists for this slot');
            }

            user[apiKeyName] = newApiKey;

            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('Error writing user data:', err);
                    return res.status(500).send('Internal server error');
                }
                res.redirect('/account/api');
            });
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return res.status(500).send('Internal server error');
        }
    });
});

router.delete('/account/api/delete', isAuthenticated, (req, res) => {
    const { key } = req.body;
    const userId = req.user.id;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send('Internal server error');
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(u => u.id === userId);

            if (!user) {
                return res.status(404).send('User not found');
            }

            if (!user[key]) {
                return res.status(404).send('API key not found');
            }

            delete user[key];

            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('Error writing user data:', err);
                    return res.status(500).send('Internal server error');
                }
                res.json({ message: 'API key deleted successfully' });
            });
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return res.status(500).send('Internal server error');
        }
    });
});

module.exports = router;
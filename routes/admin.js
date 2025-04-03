const express = require('express');
const isAuthenticated = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const router = express.Router();

const usersFilePath = path.join(__dirname, '../users.json');

async function readUsers() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users.json:', err);
        return [];
    }
}

async function writeUsers(users) {
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing users.json:', err);
    }
}

router.get('/admin/home', isAuthenticated, async (req, res) => {
    try {
        const data = await readUsers();
        const totalUsers = data.length;
        res.render('admin', { title: 'Paragon', totalUsers });
    } catch (err) {
        console.error('Error reading users.json:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin/users', isAuthenticated, async (req, res) => {
    try {
        const data = await readUsers();
        res.render('admin-users', { title: 'Paragon', users: data });
    } catch (err) {
        console.error('Error reading users.json:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin/users/create', isAuthenticated, (req, res) => {
    res.render('create-user', { title: 'Paragon' });
});

router.post('/admin/users/create', isAuthenticated, async (req, res) => {
    const { username, name, email, password, isAdmin } = req.body;

    if (!username || !email || !password || !name || !isAdmin) {
        return res.status(400).send('All fields are required');
    }

    const users = await readUsers();

    const usernameExists = users.some(user => user.username === username);
    const emailExists = users.some(user => user.email === email);

    if (usernameExists) {
        return res.status(400).send('This username is already in use. Please choose a different username.');
    }

    if (emailExists) {
        return res.status(400).send('This email is already in use. Please choose a different email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
    const newUserId = maxId + 1;

    const userData = {
        id: newUserId,
        username,
        email,
        password: hashedPassword,
        name,
        isAdmin: isAdmin === 'true'
    };

    users.push(userData);
    await writeUsers(users);

    res.redirect('/admin/users');
});

module.exports = router;
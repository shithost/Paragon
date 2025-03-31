const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;
    res.locals.isLoggedIn = req.session.user ? true : false;
    res.locals.sidebarTitle = 'Paragon';

    req.user = req.session.user;

    next();
});

app.use('/', authRoutes);
app.use('/', accountRoutes);

app.listen(port, () => {
    console.log(`Paragon is running on http://localhost:${port}`);
});
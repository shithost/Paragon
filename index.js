const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Paragon is running on http://localhost:${port}`);
});
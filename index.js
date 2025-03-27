const express = require('express');
const app = express();
const port = 3001;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Paragon' });
});

app.listen(port, () => {
    console.log(`Paragon is running on http://localhost:${port}`);
});
module.exports = (req, res, next) => {
    res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = isAuthenticated;
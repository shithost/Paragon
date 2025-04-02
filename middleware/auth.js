const isAuthenticated = (req, res, next) => {
    res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;
    res.locals.isLoggedIn = req.session.user ? true : false;

    req.user = req.session.user; 

    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = isAuthenticated;
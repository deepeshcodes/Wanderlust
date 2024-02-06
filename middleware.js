module.exports.isLoggedIn = ((req, res, next) => {
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        console.log(`Redirect URL: ${req.session.redirectUrl}`);
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}
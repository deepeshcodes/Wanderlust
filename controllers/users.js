const User = require('../models/user');

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}; 

module.exports.login = async (req, res) => {
    req.flash("success","Welcome Back to Wanderlust!");
    // let redirectUrl = res.locals.redirectUrl || "/listings";
    // try {
    //     new URL(redirectUrl);
    // } catch (error) {
    //     console.error("Invalid URL: ",redirectUrl);
    //     redirectUrl = "/listings";
    // }
    // console.log(redirectUrl);   
    // // delete req.session.redirectUrl;
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};
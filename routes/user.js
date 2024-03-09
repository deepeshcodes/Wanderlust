const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));  

const userController = require('../controllers/users.js');

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get((req,res) => {
    res.render("users/login.ejs");
})
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login, 
);

router.get("/logout", saveRedirectUrl, userController.logout);

module.exports = router;
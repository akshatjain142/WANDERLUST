const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });

    const result = await User.register(newUser, password);

    req.login(result, (err) => {
      if (err) return next(err);

      req.flash("success", "User registered successfully");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to WanderLust");
  const redirect = res.locals.redirectUrl || "/listings";
  res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "You are successfully logged out");
    res.redirect("/listings");
  });
};
import User from "../models/user.js";
import passport from "passport";

export const renderRegister = (req, res) => {
  res.render("users/register");
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(e);
      req.flash("success", "Welcome To Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("register");
  }
};

export const renderLogin = (req, res) => {
  res.render("users/login");
};

export const loginUser = async (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

export const logoutUser = (req, res) => {
  req.logOut();
  req.flash("success", "You have logged out");
  res.redirect("/campgrounds");
};

import express from "express";
import User from "../models/user.js";
import catchAsync from "../util/catchasync.js";
import passport from "passport";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("register");
    }
    req.flash("success", "Welcome To Yelp Camp!");
    res.redirect("/campgrounds");
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/campgrounds");
  }
);

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "You have logged out");
  res.redirect("/campgrounds");
});

export default router;

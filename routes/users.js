import express from "express";
import User from "../models/user.js";
import catchAsync from "../util/catchasync.js";

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
    console.log(registeredUser);
    req.flash("success", "Welcome To Yelp Camp!");
    res.redirect("/campgrounds");
  })
);

export default router;

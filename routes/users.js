import express from "express";
import catchAsync from "../util/catchasync.js";
import passport from "passport";
import {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
  logoutUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/register", renderRegister);

router.post("/register", catchAsync(registerUser));

router.get("/login", renderLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  loginUser
);

router.get("/logout", logoutUser);

export default router;

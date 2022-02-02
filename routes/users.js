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

router.route("/register").get(renderRegister).post(catchAsync(registerUser));

router
  .route("/login")
  .get(renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    loginUser
  );

router.get("/logout", logoutUser);

export default router;

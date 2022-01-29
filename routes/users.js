import express from "express";
import User from "../models/user.js";
import catchAsync from "../util/catchasync.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  res.send(req.body);
});

export default router;

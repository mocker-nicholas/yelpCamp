import express from "express";
const router = express.Router();
import catchAsync from "../util/catchasync.js";
import Campground from "../models/campground.js";
import { isLoggedIn, validateCampground, isAuthor } from "../middleware.js";
import {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  updateCampground,
  deleteCampground,
} from "../controllers/campgrounds.js";

router.get("/", catchAsync(index));

router.get("/new", isLoggedIn, renderNewForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(createCampground));

router.get("/:id", catchAsync(showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  isAuthor,
  catchAsync(updateCampground)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(deleteCampground));

export default router;

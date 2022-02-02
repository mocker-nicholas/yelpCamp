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

router
  .route("/")
  .get(catchAsync(index))
  .post(isLoggedIn, validateCampground, catchAsync(createCampground));

// remember, this has to go before the id show route, or express thinks (new) is an id
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .put(isLoggedIn, validateCampground, isAuthor, catchAsync(updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

export default router;

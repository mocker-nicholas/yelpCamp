import express from "express";
import catchAsync from "../util/catchasync.js";
import multer from "multer";
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
import { cloudConfig, storage } from "../cloudinary/index.js";
const router = express.Router();
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(createCampground)
  );

// remember, this has to go before the id show route, or express thinks (new) is an id
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

export default router;

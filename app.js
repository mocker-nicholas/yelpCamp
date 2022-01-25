import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs";
import ejsMate from "ejs-mate";
import ExpressError from "./util/expresserror.js";
import campgroundsRouter from "./routes/campgrounds.js";
import reviewsRouter from "./routes/reviews.js";

// set express to a variable for initialization
const app = express();
// set filename to path to the current directory, lets us use __filename in a module
const __filename = fileURLToPath(import.meta.url);
// set dirname to path to the current file, lets us use __dirname in a module
const __dirname = path.dirname(__filename);
// Connect to mongoose and check for connection errors
async function connectDb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("DATABASE CONNECTED");
  } catch (e) {
    console.log("CONNECTION ERROR", e);
  }
}
connectDb();

// set engine for ejs
app.engine("ejs", ejsMate);
// set views engine
app.set("view engine", "ejs");
// set views directory
app.set("views", path.join(__dirname, "views"));
// let our reqs have bodys
app.use(express.urlencoded({ extended: true }));
// use method-override
app.use(methodOverride("_method"));
// campground router
app.use("/campgrounds", campgroundsRouter);
// reviews router
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong...." } = err;
  // the destructured default wont get passed through to our err object, so set that default manually.
  if (!err.message) err.message("Oh No! Something went wrong!");
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

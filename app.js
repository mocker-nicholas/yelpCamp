import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
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
import usersRouter from "./routes/users.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import mongoSanitize from "express-mongo-sanitize";

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
// session
const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
// tell our app to use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// let our reqs have bodys
app.use(express.urlencoded({ extended: true }));
// use method-override
app.use(methodOverride("_method"));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
// serve static assests
app.use(express.static(path.join(__dirname, "public")));
// enable flash
app.use(flash());
// pass flash message onto req if exists. It is then passed to boilerplate
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  return next();
});
// campground router
app.use("/campgrounds", campgroundsRouter);
// reviews router
app.use("/campgrounds/:id/reviews", reviewsRouter);
// users router
app.use("/", usersRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Not found" } = err;
  // the destructured default wont get passed through to our err object, so set that default manually.
  if (!err.message) err.message = "Oh No! Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

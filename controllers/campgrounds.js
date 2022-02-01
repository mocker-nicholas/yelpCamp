import Campground from "../models/campground.js";

export const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

export const renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

export const createCampground = async (req, res, next) => {
  // this works, but we dont want to have to write logic for EVERYTHING. Use JOI for this.
  // if (!req.body.campground)
  //   throw new ExpressError(400, "Invalid Campground Data");
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Sucessfully made new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

export const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

export const renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

export const updateCampground = async (req, res) => {
  const { id } = req.params;
  // because our form name is submitting information in a 'campground' object (name="campground[param]")
  // we can spread that object into our update req to match the params of the thing we are updating
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Sucessfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

export const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Sucessfully deleted your campground");
  res.redirect("/campgrounds");
};
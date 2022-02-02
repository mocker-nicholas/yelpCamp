import Campground from "../models/campground.js";
import Review from "../models/review.js";

export const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Sucessfully posted your review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Sucessfully deleted your review!");
  res.redirect(`/campgrounds/${id}`);
};

import mongoose from "mongoose";
import Review from "./review.js";

// You can make a little shortcut for the mongoose schema method
const Schema = mongoose.Schema;
// define your model schemas

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200/h_200");
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  location: String,
  price: Number,
  description: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
// Since this is a post middleware, the document is already deleted. However, it gets passed in so we still have access to its data
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // use a query to delete all review ids that are included in the document that was passed in.
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);

export default Campground;

import mongoose from "mongoose";
import Campground from "../models/campground.js";
import cities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";
import axios from "axios";
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

// call unsplash and return small image
async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "lwAg2WoGT2OcMsDu_CyLLuBAiYlG3X1Y2N6B_Tpkg9c",
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    // setup
    const placeSeed = Math.floor(Math.random() * places.length);
    const descriptorsSeed = Math.floor(Math.random() * descriptors.length);
    const citySeed = Math.floor(Math.random() * cities.length);

    // seed data into campground
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
      location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
      imgUrl: await seedImg(),
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!",
      price: price,
    });

    await camp.save();
  }
};

seedDb().then(async () => {
  await mongoose.connection.close();
  console.log("CONNECTION CLOSED");
});

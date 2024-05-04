const mongoose = require("mongoose");

// mongo connection paramters
mongoose.set("strictQuery", false);

// generate the url with the password
const url = process.env.MONGODB_URI;

// user feecback about the connection status
console.log("connecting to", url.slice(0, 20), "...");

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// define the base schema for the database
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// transform the returned object data from mongodb
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // create a copy of _id field in string format
    returnedObject.id = returnedObject._id.toString();
    // delete object fields
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);

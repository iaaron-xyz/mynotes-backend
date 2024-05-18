const mongoose = require("mongoose");

// define the base schema for the database
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: [5, "Minimum length allowed is of 5 characters."],
    maxLength: 200,
    required: [true, "You must write a note."],
  },
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

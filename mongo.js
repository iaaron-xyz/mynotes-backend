const mongoose = require("mongoose");

// Make sure the comman line arguments are at least 3
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

// print to console the array of passed arguments
console.log(process.argv);

// Get the passowrd string
const password = process.argv[2];

// create the url with the password value in it
const url = `mongodb+srv://iarnfso:${password}@cluster0.wslzans.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

// // create the schema for the database
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// The new note values
const note = new Note({
  content: "Add more notes to keep testing",
  important: true,
});

// Save the document, print to console the note is saved
// and close the connection
note.save().then(() => {
  console.log("note saved!");
  mongoose.connection.close();
});

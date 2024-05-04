const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Note = require("./models/note");

// Prints information about every request
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};

// CALL MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(requestLogger);
// fetch static files
app.use(express.static("dist"));

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// Get homepage
app.get("/", (request, response) => {
  response.send("<h1>Hello Express World!</h1>");
});

// Get all notes from mongo database
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Get a single note from the Mongo DB
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;

  Note.findById(id).then((note) => {
    // note with null value
    if (note === null) {
      return response.status(400).json({
        error: "content missing",
      });
    }

    //  return the note in JSON format
    response.json(note);
  });
});

// delete one note
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// Save a new note to mongo DB
app.post("/api/notes", (request, response) => {
  // Get the data body from the frontend
  const body = request.body;
  console.log("Note body", body);

  // No content
  if (!body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  // create new note object
  const newNote = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  // save the note to the db
  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Activate server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

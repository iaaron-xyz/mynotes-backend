const express = require("express");
const cors = require("cors");
const app = express();

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

// Error handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  // Error related to malformatted ids
  if (error.name === "CastError") {
    return response.status(400).send({ error: "wrong format id" });
  }
  next(error);
};

// CALL MIDDLEWARES
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(requestLogger);

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
app.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;

  Note.findById(id)
    .then((note) => {
      // note with null value
      if (note === null) {
        return response.status(404).end();
      }
      //  return the note in JSON format
      response.json(note);
    })
    .catch((error) => next(error));
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

// delete one note
app.delete("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  console.log(id);

  Note.findByIdAndDelete(id)
    .then((result) => {
      console.log("DELETE RESULT:", result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Modify/Update a form
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;
  const id = request.params.id;

  // note updated info
  const updatedContent = {
    content: body.content,
    important: body.important,
  };

  // find note with given id and update with the new content
  Note.findByIdAndUpdate(id, updatedContent, { new: updatedContent })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint); // wrong urls
app.use(errorHandler); // MIDDLEWARE to handle errors in requests

// Activate server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

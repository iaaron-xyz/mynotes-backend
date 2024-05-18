const notesRouter = require("express").Router();
const Note = require("../models/note");

const logger = require("../utils/logger");

// GET ALL NOTES
notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// GET 1 NOTE
notesRouter.get("/:id", (request, response, next) => {
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

// SAVE NEW NOTE
notesRouter.post("/", (request, response, next) => {
  // Get the data body from the frontend
  const body = request.body;
  logger.info("Note body", body);

  // No content
  if (body.content === undefined) {
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
  newNote
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

// DELETE 1 NOTE
notesRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  logger.info(id);

  Note.findByIdAndDelete(id)
    .then((result) => {
      logger.info("DELETE RESULT:", result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// MODIFY 1 NOTE
notesRouter.put("/:id", (request, response, next) => {
  const { content, important } = request.body;
  const id = request.params.id;

  // find note with given id and update with the new content
  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;

const express = require("express");
const cors = require("cors");
const app = express();

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// DEFINE MIDDLEWARE FUNCTIONS

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

// Get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// Get one note
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// delete one note
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// Post a new note
app.post("/api/notes", (request, response) => {
  // Get the data body
  const body = request.body;
  console.log("Note body", body);
  // If the content is empty
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  // create new note object
  const newNote = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };
  notes = notes.concat(newNote);
  console.log("Notes updated:", notes);

  response.json(newNote);
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

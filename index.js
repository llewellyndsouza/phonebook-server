require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// MongoDB Init
const Person = require("./models/phonebook");

// Express Init
const app = express();

app.use(express.static("build"));
app.use(express.json());

// Request logger (also logs the content when post)
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

// Sends a page of info with number of contacts in MongoDB
app.get("/info", (request, response, next) => {
  console.log("Request for info - present number of contacts");
  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      );
    })
    .catch((err) => next(err));
});

// Gets all contacts from MongoDB
app.get("/api/persons", (request, response, next) => {
  console.log("Request for all persons");
  Person.find({})
    .then((result) => {
      response.json(result);
    })
    .catch((err) => next(err));
});

// Gets person with 'id' from MongoBD
app.get("/api/persons/:id", (request, response, next) => {
  console.log("Request for particular person");
  console.log("id:", request.params.id);
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// Deleted a contact from MongoDB
app.delete("/api/persons/:id", (request, response, next) => {
  console.log("Request to delete");
  console.log("id:", request.params.id);

  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
    console.log("deleted person");
    response.status(204).end();
    })
    .catch((err) => next(err));
});

// Adds new contact to MongoDB
app.post("/api/persons", (request, response) => {
  console.log("Add new person");
  const body = request.body;
  console.log(body);

  console.log("Checking data integrity");
  if (!body.name || !body.number) {
    console.log("Content missing");
    return response.status(400).json({
      error: "Content missing",
    });
  }

  // console.log("Checking for duplicates");
  // if (checkDuplicate(body.name)) {
  //   console.log("Duplicate found");
  //   return response.status(400).json({
  //     error: "Name already exists",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((newPerson) => {
    console.log("New person added");
    response.json(person);
  });
});

// Defining unknown end point handler (bad path)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// For all unknown URLs (bad path)
app.use(unknownEndpoint);

// Defining a error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware -error handling
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

//Logs (also the content when post)
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

let persons = [
  {
    name: "Arto1 Hellas1",
    number: "040-87476657",
    id: 1,
  },
  {
    name: "Arto2 Hellas2",
    number: "040-652456",
    id: 2,
  },
  {
    name: "Arto3 Hellas3",
    number: "040-123456",
    id: 3757867,
  },
  {
    name: "Arto4 Hellas4",
    number: "040-12748234",
    id: 475527,
  },
];

const totalContacts = () => {
  return persons.length;
};

const generateId = () => {
  return Math.floor(Math.random() * 1000000000000);
};

app.get("/info", (request, response) => {
  console.log("Request for info");
  response.send(
    `<p>Phonebook has info for ${totalContacts()} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  console.log("Request for all persons");
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  console.log("Request for particular person");
  const id = Number(request.params.id);
  console.log("id:", id);
  const person = persons.find((p) => p.id === id);
  console.log("person:", person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const checkDuplicate = (newName) => {
  return persons.find((person) => person.name === newName);
};

app.delete("/api/persons/:id", (request, response) => {
  console.log("Request to delete");
  const id = Number(request.params.id);
  console.log("id:", id);
  const person = persons.find((p) => p.id === id);
  console.log("person:", person);
  if (person) {
    persons = persons.filter((person) => person.id !== id);
    console.log("deleted person");
    response.status(204).end();
  } else {
    console.log("person not found");
    response.status(404).end();
  }
});

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

  console.log("Checking for duplicates");
  if (checkDuplicate(body.name)) {
    console.log("Duplicate found");
    return response.status(400).json({
      error: "Name already exists",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  console.log("New person added");
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

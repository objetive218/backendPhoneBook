if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const port = process.env.PORT || 10000;

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors()); 
app.use(express.static("dist"));

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const getRandomId = () => {
  const random = Math.random(contacts.length - 1) * 2;
  return random;
};

app.get("/api/contacts/", (req, res) => {
  res.json(contacts);
  res.send("Welcome to the Home Page!");
});
app.get("/info", (req, res) => {
  const today = new Date().toString();
  res.send(
    `<p>Phonebook has info for ${contacts.length} people</p> <p>${today}</p>`
  );
});

app.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  contactToDelet = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

app.post("/api/contacts/", (req, res) => {
  const body = req.body;
  const findName = contacts.find((e) => body.name === e.name);

  if (!body.number || !body.name) {
    return res.status(400).json({
      error: "content missing",
    });
  } else if (findName) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newContact = {
    id: getRandomId(),
    name: body.name,
    number: body.number,
  };

  contacts = contacts.concat(newContact);

  res.json(newContact);
});

app.listen(port, () => {
  console.log("running");
});

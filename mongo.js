const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const databaseName = "phonebook";

const url = `mongodb+srv://fullstack:${password}@cluster0.6lwfc.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", noteSchema);

console.log("ARGS - name:", process.argv[3], "number:", process.argv[4]);
const newName = process.argv[3];
const newNumber = process.argv[4];

if (newName && newNumber) {
  // Add new contact to DB
  const person = new Person({
    name: newName,
    number: newNumber,
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  // Retrieve all contacts frm DB
  Person.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}

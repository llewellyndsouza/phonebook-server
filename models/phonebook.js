// MongoDB Init
const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator"); //Unique validator plugin
const url = process.env.MONGODB_URI;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "name too small"],
    unique: true,
    required: [true, "Name required"],
  },
  number: {
    type: String,
    minlength: [8, "Phone number should be min 8 characters"],
    required: [true, "Phone number required"],
  },
});

noteSchema.plugin(uniqueValidator);

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", noteSchema);

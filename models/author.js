const mongoose = require("mongoose");
const schema = mongoose.Schema;

const authorSchema = new schema({
  name : String,
  age : String,
});

module.exports = mongoose.model("author",authorSchema)

const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Phone: { type: String, required: true },
  Token: { type: String, default: null },
});

module.exports = mongoose.model("registration", registrationSchema);

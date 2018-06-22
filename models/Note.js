var mongoose = require("mongoose");

// save refrence to the schema constuctor
var Schema = mongoose.Schema;

var NoteSchema = new Schema ({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.export = Note;
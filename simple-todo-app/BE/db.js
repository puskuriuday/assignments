const mongoose = require("mongoose");

( async () => {
    await mongoose.connect("");
    console.log("ok db connected");
})();

const Schema = mongoose.Schema;

const todo = new Schema({
    title : String,
    desc : String
});

const todoModel = mongoose.model("todos" , todo);

module.exports = {
    todoModel,
}
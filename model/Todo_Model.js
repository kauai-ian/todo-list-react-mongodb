import mongoose from "mongoose";

const { Schema, model } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  _id: {
    type: String,
  },
});

const Todo = model("Todo", todoSchema);
export default Todo;

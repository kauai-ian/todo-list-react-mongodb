import mongoose from "mongoose";

const { Schema, model } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const TodoSchema = model("TodoSchema", todoSchema);
export default TodoSchema;

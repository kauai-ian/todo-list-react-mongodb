import mongoose from "mongoose";
import Todo from "./Todo_Model.js";

const { Schema, model } = mongoose;

const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  todos: [Todo.schema],
});

const List = model("List", ListSchema);
export default List;

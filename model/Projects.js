import mongoose from "mongoose";
import Todo from "./Todo_Model.js";

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  todos: [Todo.schema],
  _id: {
    type: String,
  },
});

const Project = model("Project", ProjectSchema);
export default Project;

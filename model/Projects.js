import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  todos: {
    type: Array,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  
});

const Project = model("Project", ProjectSchema);
export default Project;

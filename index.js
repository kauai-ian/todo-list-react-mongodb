// backend
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 3000;
import cors from "cors";
const connectUrl = process.env.DB_URI;
// console.log(process.env.DB_URI);
// import TodoModel from "./model/Todo_Model.js";

import Project from "./model/Projects.js";
import Todo from "./model/Todo_Model.js";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.Promise = global.Promise;

async function main() {
  console.log("connecting to database");
  try {
    await mongoose.connect(connectUrl);
    console.log("database connected successfully");
  } catch (error) {
    console.log("couldn't connect to the database", error);
    process.exit();
  }
}

// create new list
// const _listModel = new Project({
//   title: 'inbox',
//   activeListId: '1',
// _id: 1,
// })

// save the model
// await _listModel.save()

// delete many
// const deleteAllLists = await List.deleteMany({})

// find a single list
// const firstList = await List.findOne({})
// console.log(firstList)

// find all
// const allLists = await List.find({})
// console.log(allLists)

//routes
// get all lists
app.get("/lists", async (req, res) => {
  try {
    const lists = await Project.find();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new list
app.post("/lists", async (req, res) => {
  try {
    const list = new Project({
      title: req.body.title,
      _id: req.body._id,
      // activeListId: req.body.activeListId,
    });
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete list
app.delete("/lists/:_id", async (req, res) => {
  try {
    const listId = req.params._id; // Extract the list ID from the request parameters
    console.log("List ID to be deleted:", listId); // Log the list id

    const list = await Project.findByIdAndDelete(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//add todo
app.post("/lists/:_id/todos", async (req, res) => {
  try {
    const listId = req.params._id;
    console.log("List ID to be updated:", listId);
    const {title, id } = req.body

    const todo = new Todo({ title, _id: id });

    const list = await Project.findByIdAndUpdate(
      listId,
      { $push: { todos: todo } },
      { new: true }
    );

    const newTodo = list.todos.find((t) => t._id == todo._id)
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//start application
main();

//start server
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

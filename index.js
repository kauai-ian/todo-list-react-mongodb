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

import List from "./model/Projects_Model.js";
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
// const _listModel = new List({
//   title: 'inbox',
//   activeListId: '1',
// list_id: 1,
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
    const lists = await List.find();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new list
app.post("/lists", async (req, res) => {
  try {
    const list = new List({
      title: req.body.title
    });
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete list
app.delete("/lists/:list_id", async (req, res) => {
  try {
    const listId = req.params.list_id; // Extract the list ID from the request parameters
    console.log("List ID to be deleted:", listId); // Log the list id

    const list = await List.findByIdAndDelete(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//add todo
app.post("/lists/:list_id/todos", async (req, res) => {
  try {
    console.log(req.params);
    const listId = req.params._id;
    console.log("List ID to be updated:", _id);
    const { title, todoId } = req.body;
    console.log(req.body);
    const todo = new Todo({ title, todo_id: todoId });

    const list = await List.findByIdAndUpdate(
      listId,
      { $push: { todos: todo } },
      { new: true }
    );

    const newTodo = list.todos.find((t) => t.todo_id == todo.todo_id);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete todo
app.delete("/lists/:list_id/todos/:todo_id", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);

    const listId = req.params._id;
    const todoId = req.params.todo_id;
    console.log("List ID to be deleted:", listId);
    console.log("Todo ID to be deleted:", todoId);

    const list = await List.findByIdAndDelete(
      listId,
      { $pull: { todos: { todo_id: todoId } } },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//start application
main();

//start server
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

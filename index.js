// backend
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import List from "./model/ListModel.js";
import Todo from "./model/TodoModel.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const connectUrl = process.env.DB_URI;
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

//route handlers
// get all lists
app.get("/lists", async (req, res) => {
  try {
    const lists = await List.find().populate('todos');
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new list
app.post("/lists", async (req, res) => {
  try {
    const list = new List({
      title: req.body.title,
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
app.post("/lists/:_id/todos", async (req, res) => {
  try {
    const listId = req.params._id;
    const { title } = req.body;
    console.log("List ID to be updated:", listId);
    const newTodo = new Todo({ title });
    await newTodo.save();

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "list not found" });
    }
    list.todos.push(newTodo._id);
    await list.save();

    res.status(201).json({todo: newTodo});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete todo
app.delete("/lists/:_id/todos/:todo_id", async (req, res) => {
  try {
    const listId = req.params._id;
    const todoId = req.params.todo_id;
    console.log("List ID of item to be deleted:", listId);
    console.log("Todo ID to be deleted:", todoId);

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    list.todos = list.todos.filter(todo => !todo.equals(todoId))
    await list.save();

    await Todo.findByIdAndDelete(todoId);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update todo completed status
app.put("/lists/:list_id/todos/:todo_id", async (req, res) => {
  try {
    const listId = req.params.list_id;
    const todoId = req.params.todo_id;
    const { completed } = req.body;

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "list not found" });
    }
    list.todos = list.todos.filter(todo => !todo.equals(todoId))
    await list.save();

    const todo = await Todo.findById(todoId)
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.completed = completed
    await todo.save()
    res.json({ message: "Todo updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// clear completed
app.delete("/lists/:list_id/todos/:todo_id", async (req, res) => {
  try {
    const listId = req.params.list_id;
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const completedTodoIds = list.todos
      .filter((todo) => todo.completed)
      .map((todo) => todo._id);

    list.todos = list.todos.filter((todo) => !todo.completed);

    await list.save();

    res.status(200).json({ message: "Completed todos cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//start application
main();

//start server
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

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

//route handlers
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
      title: req.body.title,
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
    const listId = req.params.list_id;
    console.log("List ID to be updated:", listId);
    const { title } = req.body;
    console.log(req.body);
    const todo = new Todo({ title, todo_id: Date.now() });

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "list not found" });
    }

    list.todos.push(todo);

    await list.save();

    const newTodo = list.todos.find((t) => t.todo_id === todo.todo_id);
    res.status(201).json(newTodo);
    console.log("success");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete todo
app.delete("/lists/:list_id/todos/:todo_id", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);

    const listId = req.params.list_id;
    const todoId = req.params.todo_id;
    console.log("List ID of item to be deleted:", listId);
    console.log("Todo ID to be deleted:", todoId);

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    const todoItem = list.todos.id(todoId);

    if (!todoItem) {
      return res.status(404).json({ message: "todo not found" });
    }

    todoItem.deleteOne();

    await list.save();

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

    const todoItem = list.todos.id(todoId);

    if (!todoItem) {
      return res.status(404).json({ message: "todo not found" });
    }

    todoItem.completed = completed;

    await list.save();

    res.json({ message: "Todo updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// clear completed
app.delete("/lists/:list_id/todos/:todo_id", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);

    const listId = req.params.list_id;
    console.log("List ID of item to be deleted:", listId);

    const list = await List.findById(listId);
    console.log("List:", list);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // filter out completed todos and extract their ids
    const completedTodoIds = list.todos
      .filter((todo) => todo.completed)
      .map((todo) => todo._id);

      //remove the completed todos
      list.todos = list.todos.filter((todo) => !todo.completed)

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

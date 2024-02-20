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
import List from "./model/List_Model.js";

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
//   title: 'New List',
//   activeListId: '',
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
  const list = new List({
    title: req.body.title,
    activeListId: req.body.activeListId,
  });

  try {
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete todo
app.delete("/list/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (list == null) {
      return res.status(404).json({ message: "List not found" });
    }
    await list.remove();
    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//start application
main();

//start server
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

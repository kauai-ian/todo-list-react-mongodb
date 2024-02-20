import mongoose from "mongoose";
import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 8080;
import cors from "cors";
const connectUrl = process.env.DB_URI;
// console.log(process.env.DB_URI);
// import TodoModel from "./model/Todo_Model.js";
import List from "./model/List_Model.js";



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());



mongoose.Promise = global.Promise;

async function main() {
  console.log("connecting to database");
  try {
    await mongoose.connect(connectUrl);
    console.log("database connected successfully");
  
  

// create new list
const _listModel = new List({
  title: 'New List',
  activeListId: '',
})

// save the model
await _listModel.save()

// delete many
// const deleteAllLists = await List.deleteMany({})

// find a single list
// const firstList = await List.findOne({})
// console.log(firstList)

// find all 
const allLists = await List.find({})
console.log(allLists)



} catch (error) {
  console.log("couldn't connect to the database", error);
  process.exit();
}
}

//start application
main();

//start server
app
  .listen(PORT, () => 
  console.log(`server is running on port ${PORT}`))
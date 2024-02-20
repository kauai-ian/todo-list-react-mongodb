import mongoose from "mongoose";

const { Schema, model } = mongoose;

const listSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  activeListId: String,
});

const List = model("ListSchema", listSchema);
export default List;

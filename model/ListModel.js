import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  todos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

const List = model("List", ListSchema);
export default List;

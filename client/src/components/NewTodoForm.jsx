import { useState } from "react";
import PropTypes from "prop-types";

export function TodoForm({ addTodo, activeList }) {
  const activeListData = activeList ? activeList : null; // get list if its there
  const [newItem, setNewItem] = useState("");
  const handleSubmit = (e) => {
    if (newItem === "") return;
    e.preventDefault();

    if (activeListData) {
      addTodo(newItem);
    }
    setNewItem("");
  };

  return (
    <section className="form-section">
      <h2>Create new Todo</h2>
      <form
        onSubmit={handleSubmit}
        className="new-item-form"
        name="new-item-form"
      >
        <div className="form-row">
          <label htmlFor="item"></label>
          <input
            value={newItem} // update item avlue
            onChange={(e) => setNewItem(e.target.value)} // when event object changes, run function
            type="text"
            id="item"
            placeholder="New todo item title"
          />
        </div>
        <button className="btn">+</button>
      </form>
    </section>
  );
}

TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
  activeList: PropTypes.object,
};

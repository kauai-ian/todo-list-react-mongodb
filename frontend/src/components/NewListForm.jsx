import { useState } from "react";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";

export function ListForm({ addList }) {
  const [newList, setNewList] = useState("");
  const handleListSubmit = (e) => {
    if (newList === "") return;
    e.preventDefault();
    addList({ id: uuid(), title: newList, todos: [] });
    setNewList("");
  };

  return (
    <section className="all-tasks">
      <h2 className="task-list-title">My Projects</h2>
      <ul className="task-list"></ul>
      <form
        onSubmit={handleListSubmit}
        className="new-list-form"
        name="new-list-form"
      >
        <div className="form-row">
          <label htmlFor="listItem"></label>
          <input
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            type="text"
            className="list"
            id="listItem"
            placeholder="New project list title"
          />
        </div>
        <button className="btn createList" type="submit">
          +
        </button>
      </form>
    </section>
  );
}
ListForm.propTypes = { addList: PropTypes.func.isRequired };

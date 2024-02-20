import trashIcon from '../assets/trash.png' 
import PropTypes from "prop-types";

export function TodoItem({
  title,
  id,
  completed,
  toggleCompleted,
  deleteTodo,
}) { 
  const capFrstLtr = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  return (
    <li className={` todo-item ${completed ? "checked" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => toggleCompleted(id, e.target.checked)} // need to call as a function to run
        />
        {capFrstLtr(title)}
      </label>{" "}
      <button
        onClick={() => deleteTodo(id)} // need to call as a function  to run
        className="btn btn-del"
      >
        <img src={trashIcon} alt="remove button" className='trash' />
      </button>
    </li>
  );
}

TodoItem.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  completed: PropTypes.bool,
  toggleCompleted: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
};
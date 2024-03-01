import trashIcon from '../assets/trash.png' 
import PropTypes from "prop-types";
import capFrstLtr from '../helpers/CapFirstLtr';

export function TodoItem({
  title,
  _id,
  completed,
  toggleCompleted,
  deleteTodo,
}) { 
  
  return (
    <li className={` todo-item ${completed ? "checked" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => toggleCompleted(_id, e.target.checked)} 
        />
        {capFrstLtr(title)}
      </label>{" "}
      <button
        onClick={() => deleteTodo(_id)} 
        className="btn btn-del"
      >
        <img src={trashIcon} alt="remove button" className='trash' />
      </button>
    </li>
  );
}

TodoItem.propTypes = {
  title: PropTypes.string,
  _id: PropTypes.string,
  completed: PropTypes.bool,
  toggleCompleted: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
};
import { TodoItem } from "./TodoItem";
import PropTypes from "prop-types";

export function TodoList({
  activeList,
  todos,
  deleteTodo,
  addTodo,
  toggleCompleted,
}) {

  return (
    <>
      {!activeList && <div>No active list selected</div>}
      {activeList && (
        <>
          {!todos && <div>Loading...</div>}{" "}
          {todos && todos.length > 0 && (
            <ul>
              {todos.map((todo) => {
                if (todo && todo._id) {
                  return (
                    <TodoItem
                      {...todo}
                      key={todo._id}
                      deleteTodo={deleteTodo}
                      addTodo={addTodo}
                      toggleCompleted={toggleCompleted}
                    />
                  );
                }
                return null;
              })}
            </ul>
          )}
          {todos && !todos.length && <p>No todo items!</p>}
        </>
      )}
    </>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ),
  addTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  toggleCompleted: PropTypes.func.isRequired,
  activeList: PropTypes.object,
};

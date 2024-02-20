import { ListItem } from "./ListItem";
import PropTypes from "prop-types";

export function List({
  activeList,
  activeListId,
  lists,
  deleteList,
  switchLists,
}) {
  return (
    <>
      {!lists ? (
        <div>Loading...</div>
      ) : !lists.length ? (
        <div>Make a list first to add a todo!</div>
      ) : (
        <ul>
          {lists.map((list) => (
            <ListItem
              {...list}
              key={list.id}
              todos={list.todos}
              activeList={activeList}
              activeListId={activeListId}
              switchLists={switchLists}
              deleteList={deleteList}
            />
          ))}
        </ul>
      )}
    </>
  );
}

List.propTypes = {
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      todos: PropTypes.array.isRequired,
    })
  ).isRequired,
  switchLists: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  activeList: PropTypes.object,
  activeListId: PropTypes.string,
};

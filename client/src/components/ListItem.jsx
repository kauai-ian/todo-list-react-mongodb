import trashIcon from "../assets/trash.png";
import { PropTypes } from "prop-types";
import capFrstLtr from "../helpers/CapFirstLtr";

export function ListItem({
  title,
  _id,
  deleteList,
  switchLists,
  activeListId,
}) {
  const isActive = activeListId === _id;

  return (
    <li onClick={() => switchLists(_id)} className={isActive ? "active" : ""}>
      <p className="list item" type="text">
        {capFrstLtr(title)}
      </p>

      <button onClick={() => deleteList(_id)} className="btn btn-del">
        <img src={trashIcon} alt="remove button" className="trash" />
      </button>
    </li>
  );
}

ListItem.propTypes = {
  title: PropTypes.string,
  _id: PropTypes.string,
  switchLists: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  activeListId: PropTypes.string,
};

import trashIcon from "../assets/trash.png";
import { PropTypes } from "prop-types";

export function ListItem({ title, _id, deleteList, switchLists, activeListId }) {
  const capFrstLtr = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleDeleteList = () => {
    if (_id !== "1") {
      deleteList(_id.toString()); // convert to string before passing it to deleteList
    } else {
      console.log("Cannot delete inbox");
      return;
    }
  };


  const isActive = activeListId === _id


  return (
    <li onClick={() => switchLists(_id)} className={isActive ? "active" : ''} >
      <p className="list item" type="text" >
        {capFrstLtr(title)}
      </p>

      <button onClick={handleDeleteList} className="btn btn-del">
      <img src={trashIcon} alt="remove button" className='trash' />
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

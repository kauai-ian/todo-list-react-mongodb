import { useState, useEffect } from "react";
import { TodoForm } from "./components/NewTodoForm";
import { TodoList } from "./components/TodoList";
import { List } from "./components/List";
import { ListForm } from "./components/NewListForm";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// added code for displaying lists, adding lists.
// couldnt get the active list id to work witht the database.
// need to work on errors

const API_Lists = "http://localhost:3000/lists";

function App() {
  const [activeListId, setActiveListId] = useState("1");
  const [lists, setLists] = useState([]);

  // side effect to update list
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await axios.get(API_Lists, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Check if the list with title inbox already exists
      const defaultListExists = res.data.some((list) => list._id === "1");
      // default list added to database
      if (!defaultListExists) {
        await axios.post(API_Lists, { _id: "1", title: "Inbox", todos: [] });
        const updatedRes = await axios.get(API_Lists, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLists(updatedRes.data);
      } else {
        setLists(res.data);
      }
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  };

  const addList = async (listObject) => {
    const title = listObject.title;

    try {
      const res = await axios.post(API_Lists, { title, _id: Date.now() });

      setLists([...lists, res.data]);
      if (!activeListId) {
        setActiveListId("1");
      }
    } catch (error) {
      console.error("Error adding list", error);
    }
  };

  const deleteList = async (_id) => {
    try {
      await axios.delete(`${API_Lists}/${_id}`);
      setLists((currentLists) => {
        return currentLists.filter((list) => list._id !== _id);
      });
      setActiveListId("1");
    } catch (error) {
      console.error("Error deleting list", error);
    }
  };

  const activeList = lists.find((list) => list._id === activeListId);

  const switchLists = (id) => {
    setActiveListId(id);
  };

  const addTodo = async (newTodo) => {
    try {
      const res = await axios.post(`${API_Lists}/${activeListId}/todos`, {
        ...newTodo,
        id: uuidv4(),
      });

      console.log(res.data)

      setLists((prevLists) => {
        return prevLists.map((list) => {
          return list._id === activeListId
            ? {
                ...list,
                todos: [...list.todos, res.data], // the response from server is the updated list
              }
            : list;
        });
      });
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  const toggleCompleted = (id, completed) => {
    setLists((currentLists) => {
      return currentLists.map((list) => {
        return list.id === activeListId
          ? {
              ...list,
              todos: list.todos.map((todo) => {
                return todo.id === id ? { ...todo, completed } : todo;
              }),
            }
          : list;
      });
    });
  };

  const deleteTodo = (id) => {
    setLists((currentLists) => {
      return currentLists.map((list) => {
        return list.id === activeListId
          ? { ...list, todos: list.todos.filter((todo) => todo.id !== id) }
          : list;
      });
    });
  };

  const clearCompletedTodos = () => {
    if (activeList && activeList.todos) {
      const incompleteTodos = activeList.todos.filter(
        (todo) => !todo.completed
      );
      setLists((prevLists) => {
        return prevLists.map((list) => {
          return list.id === activeListId
            ? { ...list, todos: incompleteTodos }
            : list;
        });
      });
    }
  };

  // console.log(lists);
  // console.log(activeListId);

  return (
    <div>
      <h1>Todo List in React</h1>
      <section className="container">
        <div className="list-container">
          <ListForm addList={addList} setLists={setLists} />
          <List
            lists={lists}
            switchLists={switchLists}
            deleteList={deleteList}
            activeList={activeList}
            activeListId={activeListId}
          />
        </div>

        <div className="todo-container">
          <TodoForm addTodo={addTodo} activeList={activeList} />
          <h2>Todo Items </h2>
          <TodoList
            activeList={activeList}
            todos={activeList ? activeList.todos : []}
            toggleCompleted={toggleCompleted}
            deleteTodo={deleteTodo}
            addTodo={addTodo}
          />

          <div className="buttonContainer">
            <button
              className="btn clearCompleted"
              onClick={clearCompletedTodos}
            >
              Clear Completed
            </button>
          </div>
        </div>
      </section>
      <footer>
        <div className="footerContainer">
          <a
            href="https://github.com/kauai-ian"
            target="_blank"
            rel="noReferrer"
          >
            <img
              src="https://1000logos.net/wp-content/uploads/2021/05/GitHub-logo.png"
              alt="github"
              width="60px"
            />
            <p>Made on Planet Earth by Ian Tierney</p>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

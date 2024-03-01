//client

import { useState, useEffect } from "react";
import { TodoForm } from "./components/NewTodoForm";
import { TodoList } from "./components/TodoList";
import { List } from "./components/List";
import { ListForm } from "./components/NewListForm";
import axios from "axios";
import { fetchLists } from "./helpers/fetchLists";

const API_Lists = "http://localhost:3000/lists";

function App() {
  const [activeListId, setActiveListId] = useState();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listsData = await fetchLists();
        setLists(listsData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const addList = async (listObject) => {
    const title = listObject.title;

    try {
      const res = await axios.post(API_Lists, { title });
      const newList = res.data;
      setLists([...lists, newList]);

      setActiveListId(newList._id);
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
      setActiveListId("");
    } catch (error) {
      console.error("Error deleting list", error);
    }
  };

  const activeList = lists.find((list) => list._id === activeListId);

  const switchLists = (_id) => {
    setActiveListId(_id);
  };

  const addTodo = async (title) => {
    try {
      const res = await axios.post(`${API_Lists}/${activeListId}/todos`, {
        title: title,
      });

      setLists((prevLists) => {
        return prevLists.map((list) => {
          return list._id === activeListId
            ? {
                ...list,
                todos: [...list.todos, res.data.todo],
              }
            : list;
        });
      });
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  const toggleCompleted = async (todo_id, completed) => {
    try {
      await axios.put(`${API_Lists}/${activeListId}/todos/${todo_id}`, {
        completed,
      });
      setLists((currentLists) => {
        return currentLists.map((list) => {
          return list._id === activeListId
            ? {
                ...list,
                todos: list.todos.map((todo) => {
                  return todo._id === todo_id ? { ...todo, completed } : todo;
                }),
              }
            : list;
        });
      });
    } catch (error) {
      console.error("Error toggling todo", error);
    }
  };

  const deleteTodo = async (todo_id) => {
    try {
      console.log("Deleting todo with id:", todo_id, typeof todo_id);
      await axios.delete(`${API_Lists}/${activeListId}/todos/${todo_id}`);
      setLists((currentLists) => {
        return currentLists.map((list) => {
          return list._id === activeListId
            ? {
                ...list,
                todos: list.todos.filter((todo) => todo._id !== todo_id),
              }
            : list;
        });
      });
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  const clearCompletedTodos = async () => {
    try {
      if (!activeList) return;

      const completeTodosIds = activeList.todos // create an array of completed todos
        .filter((todo) => todo.completed)
        .map((todo) => todo._id);

      await Promise.all(
        completeTodosIds.map(async (todoId) => {
          await axios.delete(`${API_Lists}/${activeListId}/todos/${todoId}`);
        })
      );

      setLists((prevLists) => {
        return prevLists.map((list) => {
          return list._id === activeListId
            ? { ...list, todos: list.todos.filter((todo) => !todo.completed) }
            : list;
        });
      });
    } catch (error) {
      console.error("Error clearing completed todos", error);
    }
  };

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
          <h2>Todo Items: {activeList ? activeList.title : ""}</h2>
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

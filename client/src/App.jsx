import { useState, useEffect } from "react";
import { TodoForm } from "./components/NewTodoForm";
import { TodoList } from "./components/TodoList";
import { List } from "./components/List";
import { ListForm } from "./components/NewListForm";
import axios from 'axios'

// added code for displaying lists, adding lists. 
// couldnt get the ID to work witht the database. 



const API_Lists = 'http://localhost:3000/lists'


function App() {
  const [activeListId, setActiveListId] = useState("1");
  const [lists, setLists] = useState([]);
  console.log(lists);

  // side effect to update list
  useEffect(() => {
    fetchLists();
  }, []);

  // working but not rendering the inbox. So need to push that to the db first? 
  const fetchLists = async () => {
    try {
      const res = await axios.get(API_Lists,{
        headers: {
          "Content-Type": "application/json",
          mode: "no-cors"
        }
        })
      setLists(res.data)
    } catch (error) {
      console.error('Error fetching lists', error)
    }
  }

  //not working. 400 error. The title is now a string but how do I get it into the list. 
  const addList = async (listObject) => {
    const title = listObject.title
    try {
      console.log(title);
      const res = await axios.post(API_Lists, { title })
      
    setLists([...lists, res.data]); 
    // if (!activeListId) {
    //   setActiveListId(lists.id);
    // } 
  }catch (error) {
      console.error('Error adding list', error)
    }
  }


  const deleteList = (id) => {
    setLists((currentLists) => {
      return currentLists.filter((list) => list.id !== id);
    });
    if (activeListId === id) {
      setActiveListId("1");
    }
  };

  const activeList = lists.find((list) => list.id === activeListId);

  const switchLists = (id) => {
    setActiveListId(id);
  };

  const addTodo = (newTodo) => {
    setLists((prevLists) => {
      return prevLists.map((list) => {
        return list.id === activeListId
          ? {
              ...list,
              todos: [...list.todos, newTodo],
            }
          : list;
      });
    });
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

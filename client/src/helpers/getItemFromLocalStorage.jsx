// tracks the data in a variable, has a function to set the data. use state function to update storage when state changes.
export function getItemFromLocalStorage() {
  const listsKey = "lists";
  const storedLists = localStorage.getItem(listsKey); // gets the data
  try {
    return storedLists ? JSON.parse(storedLists) : [{ id: "1", title: "Inbox", todos: [] }];
  } catch (error) {
    console.error("Error parsing stored data:", error);
    return [{ id: "1", title: "Inbox", todos: [] }]; // Return default in case of parsing error
  } 
}

import type { TodoItem } from "@batijs/shared-db/database/todoItems";
import React, { useState } from "react";
import { onNewTodo } from "./TodoList.telefunc.js";

export function TodoList({ todoItemsInitial }: { todoItemsInitial: TodoItem[] }) {
  const [todoItems, setTodoItems] = useState(todoItemsInitial);
  const [newTodo, setNewTodo] = useState("");
  return (
    <>
      <ul>
        {todoItems.map((todoItem, i) => (
          <li key={i}>{todoItem.text}</li>
        ))}
        <li>
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();
              const { todoItems } = await onNewTodo({ text: newTodo });
              setNewTodo("");
              setTodoItems(todoItems);
            }}
          >
            <input type="text" onChange={(ev) => setNewTodo(ev.target.value)} value={newTodo} />{" "}
            <button type="submit">Add to-do</button>
          </form>
        </li>
      </ul>
    </>
  );
}

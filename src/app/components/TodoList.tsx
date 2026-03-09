"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  const addTodo = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    );
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
  };

  const deleteTodo = async (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTodo();
  };

  const remaining = todos.filter((t) => !t.completed).length;

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
        />
        <button
          onClick={addTodo}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add
        </button>
      </div>

      {/* List */}
      {todos.length === 0 ? (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
          No todos yet. Add one above!
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors dark:border-zinc-800 dark:bg-zinc-900"
              >
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    todo.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
                  }`}
                >
                  {todo.completed && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-sm transition-colors ${
                    todo.completed
                      ? "text-zinc-400 line-through dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
            {remaining} {remaining === 1 ? "item" : "items"} remaining
          </p>
        </>
      )}
    </div>
  );
}

import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Todo
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Stay on track, one task at a time.
        </p>
      </header>
      <TodoList />
    </div>
  );
}

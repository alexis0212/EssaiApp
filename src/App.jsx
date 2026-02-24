import { useMemo, useState } from 'react';

const FILTERS = {
  all: 'Toutes',
  active: 'En cours',
  done: 'Terminées',
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAdd = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setTasks((current) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setTitle('');
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.done);
    if (filter === 'done') return tasks.filter((task) => task.done);
    return tasks;
  }, [tasks, filter]);

  const remainingCount = tasks.filter((task) => !task.done).length;

  return (
    <div className="app-root">
      <main className="card">
        <header className="card-header">
          <h1>Gestion de tâches</h1>
          <p>Ajoute, coche et organise tes tâches du quotidien.</p>
        </header>

        <section className="card-section">
          <form className="task-form" onSubmit={handleAdd}>
            <input
              type="text"
              className="task-input"
              placeholder="Ex : Appeler le client, faire les courses..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Ajouter
            </button>
          </form>
        </section>

        <section className="card-section card-section--toolbar">
          <div className="filters">
            {Object.entries(FILTERS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={
                  'chip' + (filter === key ? ' chip--active' : '')
                }
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="counter">
            {tasks.length === 0
              ? 'Aucune tâche pour le moment.'
              : remainingCount === 0
              ? 'Toutes les tâches sont terminées 🎉'
              : `${remainingCount} tâche(s) à faire`}
          </p>
        </section>

        <section className="card-section">
          {filteredTasks.length === 0 ? (
            <p className="empty-state">
              Aucune tâche dans cette vue. Ajoute une tâche ou change le filtre.
            </p>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li key={task.id} className="task-item">
                  <label className="task-main">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span
                      className={
                        'task-title' + (task.done ? ' task-title--done' : '')
                      }
                    >
                      {task.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={() => deleteTask(task.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

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
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingFields, setEditingFields] = useState({
    description: '',
    dueDate: '',
    status: 'in_progress',
  });

  const handleAdd = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setTasks((current) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        description: '',
        dueDate: '',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setTitle('');
  };

  const updateTask = (id, partial) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...partial } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => task.status === 'in_progress');
    }
    if (filter === 'done') {
      return tasks.filter((task) => task.status === 'done');
    }
    return tasks;
  }, [tasks, filter]);

  const remainingCount = tasks.filter(
    (task) => task.status === 'in_progress'
  ).length;

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingFields({
      description: task.description || '',
      dueDate: task.dueDate || '',
      status: task.status || 'in_progress',
    });
  };

  const handleEditingFieldChange = (field, value) => {
    setEditingFields((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveEditing = () => {
    if (!editingTaskId) return;
    updateTask(editingTaskId, {
      description: editingFields.description.trim(),
      dueDate: editingFields.dueDate,
      status: editingFields.status,
    });
    setEditingTaskId(null);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const taskBeingEdited = tasks.find((task) => task.id === editingTaskId) || null;

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
                className={'chip' + (filter === key ? ' chip--active' : '')}
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
              : `${remainingCount} tâche(s) en cours`}
          </p>
        </section>

        <section className="card-section">
          {filteredTasks.length === 0 ? (
            <p className="empty-state">
              Aucune tâche dans cette vue. Ajoute une tâche ou change le filtre.
            </p>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => {
                const isDone = task.status === 'done';

                return (
                  <li key={task.id} className="task-item">
                    <div className="task-row">
                      <div className="task-main">
                        <div className="task-text-block">
                          <span
                            className={
                              'task-title' +
                              (isDone ? ' task-title--done' : '')
                            }
                          >
                            {task.title}
                          </span>
                          {task.description ? (
                            <span className="task-description">
                              {task.description}
                            </span>
                          ) : null}
                          {task.dueDate ? (
                            <span className="task-meta">
                              À faire pour le {task.dueDate}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="task-actions">
                        <span
                          className={
                            'task-status-badge' +
                            (isDone
                              ? ' task-status-badge--done'
                              : ' task-status-badge--in-progress')
                          }
                        >
                          {isDone ? 'Terminée' : 'En cours'}
                        </span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-small"
                          onClick={() => startEditing(task)}
                        >
                          Détail
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-small"
                          onClick={() => deleteTask(task.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {taskBeingEdited && (
          <section className="card-section">
            <h2 className="task-details-title">
              Détails de la tâche : {taskBeingEdited.title}
            </h2>
            <div className="task-details">
              <div className="task-details-row">
                <label className="task-details-label">
                  Description
                  <textarea
                    className="task-details-input"
                    rows={2}
                    value={editingFields.description}
                    onChange={(event) =>
                      handleEditingFieldChange(
                        'description',
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
              <div className="task-details-row">
                <label className="task-details-label">
                  Date
                  <input
                    type="date"
                    className="task-details-input"
                    value={editingFields.dueDate}
                    onChange={(event) =>
                      handleEditingFieldChange('dueDate', event.target.value)
                    }
                  />
                </label>
              </div>
              <div className="task-details-row task-details-row--status">
                <span className="task-details-label-text">Statut</span>
                <div className="task-status-toggle">
                  <button
                    type="button"
                    className={
                      'chip' +
                      (editingFields.status === 'in_progress'
                        ? ' chip--active'
                        : '')
                    }
                    onClick={() =>
                      handleEditingFieldChange('status', 'in_progress')
                    }
                  >
                    En cours
                  </button>
                  <button
                    type="button"
                    className={
                      'chip' +
                      (editingFields.status === 'done' ? ' chip--active' : '')
                    }
                    onClick={() =>
                      handleEditingFieldChange('status', 'done')
                    }
                  >
                    Terminée
                  </button>
                </div>
              </div>
              <div className="task-details-row task-details-row--actions">
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  onClick={saveEditing}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={cancelEditing}
                >
                  Fermer
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

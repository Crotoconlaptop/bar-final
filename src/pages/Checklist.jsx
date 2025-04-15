import { useState } from 'react';
import { checklistTasks } from '../data/checklistTasks';
import { logChecklistTask } from '../services/supabaseChecklist';

export default function Checklist() {
  const [taskStates, setTaskStates] = useState({});
  const [lastUser, setLastUser] = useState('');

  const handleCheck = async (index) => {
    const task = checklistTasks[index];
    const currentEntry = taskStates[index];
    const currentUser = currentEntry?.done_by || lastUser;

    if (!currentUser?.trim()) {
      alert('Por favor ingresá un nombre antes de continuar.');
      return;
    }

    const timestamp = new Date().toISOString();

    // Actualizar estado local
    setTaskStates((prev) => ({
      ...prev,
      [index]: {
        done: true,
        done_by: currentUser,
        timestamp,
      },
    }));

    setLastUser(currentUser);

    // Guardar en Supabase
    try {
      await logChecklistTask(task, currentUser, index);
    } catch (err) {
      console.error('Error al registrar tarea:', err.message);
    }
  };

  const handleNameChange = (index, newName) => {
    setTaskStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        done_by: newName,
      },
    }));
    setLastUser(newName);
  };

  const canDownload = checklistTasks.every((_, i) => taskStates[i]?.done);

  const downloadCSV = () => {
    const csvRows = ['Task,Performed by,Timestamp'];

    checklistTasks.forEach((task, i) => {
      const entry = taskStates[i];
      const row = `"${task}","${entry?.done_by || ''}","${new Date(entry?.timestamp).toLocaleString()}"`;
      csvRows.push(row);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Checklist_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-center mt-4">Daily Bar Opening Checklist</h1>

        <div className="mt-4">
          {checklistTasks.map((task, i) => {
            const state = taskStates[i] || {};

            return (
              <div key={i} className="bg-dark rounded shadow p-2 mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.done || false}
                    onChange={() => handleCheck(i)}
                    disabled={state.done}
                    className="mr-2"
                  />
                  <label className="w-full">{task}</label>
                </div>

                {!state.done && (
                  <input
                    type="text"
                    className="w-full mt-2 p-1 text-black rounded"
                    placeholder="Nombre"
                    value={state.done_by ?? lastUser}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                  />
                )}

                {state.done && (
                  <div className="text-sm mt-1 text-green-300">
                    ✅ Realizada por <strong>{state.done_by}</strong> a las{' '}
                    {new Date(state.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {canDownload && (
        <div className="p-4 text-center">
          <button
            onClick={downloadCSV}
            className="mt-6 p-2 bg-dark rounded shadow"
          >
            Descargar checklist CSV
          </button>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd(title, reminderDate ? new Date(reminderDate) : undefined);
    setTitle('');
    setReminderDate('');
    setShowReminder(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border-none focus:outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShowReminder(!showReminder)}
          className="text-gray-500 hover:text-gray-700"
        >
          🔔
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {showReminder && (
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </form>
  );
}
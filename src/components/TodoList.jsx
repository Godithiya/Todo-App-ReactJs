import React from 'react';
import { format } from 'date-fns';
import { Check, Trash2, Bell } from 'lucide-react';

export function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No todos found. Add one to get started!
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggle(todo.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
            >
              {todo.completed && <Check size={14} className="text-white" />}
            </button>
            <div>
              <p
                className={`text-gray-800 ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </p>
              <p className="text-xs text-gray-500">
                Created: {format(new Date(todo.created_at), 'MMM d, yyyy HH:mm')}
              </p>
              {todo.reminder_at && (
                <div className="flex items-center gap-1 text-xs text-indigo-600">
                  <Bell size={12} />
                  <span>
                    Reminder: {format(new Date(todo.reminder_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete todo"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
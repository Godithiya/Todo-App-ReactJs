import React from 'react';
import { format } from 'date-fns'; // Mengimpor fungsi `format` dari `date-fns` untuk memformat tanggal.
import { Check, Trash2, Bell } from 'lucide-react'; // Mengimpor ikon `Check`, `Trash2`, dan `Bell` dari `lucide-react`.

// Komponen TodoList menerima tiga properti:
// - `todos`: array yang berisi daftar todo
// - `onToggle`: fungsi untuk mengubah status penyelesaian todo
// - `onDelete`: fungsi untuk menghapus todo
export function TodoList({ todos, onToggle, onDelete }) {
  // Jika `todos` kosong, tampilkan pesan "No todos found".
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No todos found. Add one to get started!
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {/* Melakukan map untuk setiap item todo dan menampilkannya dalam <li> */}
      {todos.map((todo) => (
        <li
          key={todo.id} // Menggunakan `todo.id` sebagai key unik untuk setiap item
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-3">
            {/* Tombol untuk menandai penyelesaian todo */}
            <button
              onClick={() => onToggle(todo.id)} // Memanggil `onToggle` saat diklik
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${
                  todo.completed
                    ? 'bg-green-500 border-green-500' // Warna hijau untuk todo yang selesai
                    : 'border-gray-300' // Warna abu-abu untuk todo yang belum selesai
                }`}
            >
              {/* Jika todo sudah selesai, tampilkan ikon `Check` */}
              {todo.completed && <Check size={14} className="text-white" />}
            </button>
            
            {/* Menampilkan judul dan detail tanggal todo */}
            <div>
              {/* Judul todo, diberi efek coret jika sudah selesai */}
              <p
                className={`text-gray-800 ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </p>
              
              {/* Tanggal pembuatan todo */}
              <p className="text-xs text-gray-500">
                Created: {format(new Date(todo.created_at), 'MMM d, yyyy HH:mm')}
              </p>

              {/* Pengingat todo jika ada nilai `reminder_at` */}
              {todo.reminder_at && (
                <div className="flex items-center gap-1 text-xs text-indigo-600">
                  <Bell size={12} /> {/* Ikon Bell untuk pengingat */}
                  <span>
                    Reminder: {format(new Date(todo.reminder_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Tombol hapus todo */}
          <button
            onClick={() => onDelete(todo.id)} // Memanggil `onDelete` dengan `todo.id` saat tombol diklik
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete todo" // Menambahkan label untuk aksesibilitas
          >
            <Trash2 size={18} /> {/* Ikon trash sebagai simbol hapus */}
          </button>
        </li>
      ))}
    </ul>
  );
}

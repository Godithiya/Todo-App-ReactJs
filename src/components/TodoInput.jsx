import React, { useState } from 'react'; 
import { Plus, BellPlus } from 'lucide-react'; 

// Komponen TodoInput menerima prop `onAdd`, fungsi yang dipanggil saat task baru ditambahkan.
export function TodoInput({ onAdd }) {
  // Mengelola state untuk judul task.
  const [title, setTitle] = useState('');
  // Mengelola state untuk menampilkan opsi pengingat.
  const [showReminder, setShowReminder] = useState(false);
  // Mengelola state untuk tanggal dan waktu pengingat.
  const [reminderDate, setReminderDate] = useState('');

  // Fungsi yang dijalankan saat form disubmit.
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman refresh.
    
    // Validasi: jika judul kosong, hentikan proses submit.
    if (!title.trim()) return;
    
    // Memanggil fungsi `onAdd` dari prop dengan judul dan tanggal pengingat (jika ada).
    onAdd(title, reminderDate ? new Date(reminderDate) : undefined);
    
    // Mengatur ulang input setelah submit.
    setTitle('');
    setReminderDate('');
    setShowReminder(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Blok input untuk menambah task baru */}
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
        {/* Input untuk judul task */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Menyimpan nilai input di state `title`.
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border-none focus:outline-none bg-transparent"
        />
        
        {/* Tombol untuk mengaktifkan input pengingat */}
        <button
          type="button"
          onClick={() => setShowReminder(!showReminder)} // Menyembunyikan/memperlihatkan input pengingat.
          className="text-gray-500 hover:text-gray-700"
        >
          <BellPlus/>
        </button>
        
        {/* Tombol submit untuk menambahkan task */}
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> {/* Ikon Plus sebagai indikator tambah task */}
        </button>
      </div>
      
      {/* Input pengingat yang muncul saat `showReminder` bernilai true */}
      {showReminder && (
        <div className="flex items-center gap-2">
          {/* Input untuk tanggal dan waktu pengingat */}
          <input
            type="datetime-local"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)} // Menyimpan nilai input di state `reminderDate`.
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </form>
  );
}

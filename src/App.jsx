import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast'; // Untuk menampilkan notifikasi toast
import { TodoInput } from './components/TodoInput'; // Mengimpor komponen input todo
import { TodoList } from './components/TodoList'; // Mengimpor komponen daftar todo
import { SearchFilter } from './components/SearchFilter'; // Mengimpor komponen pencarian dan filter todo
import { supabase } from './lib/supabase'; // Mengimpor instance `supabase` untuk berinteraksi dengan backend
import { BookCheck } from 'lucide-react'; // Mengimpor ikon dari `lucide-react`

// Komponen utama `App` untuk mengelola aplikasi Todo List
function App() {
  // State hooks untuk menyimpan todo, pencarian, filter, dan status loading
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // `useEffect` untuk mengambil data todo dan setup notifikasi saat komponen dimount
  useEffect(() => {
    fetchTodos();
    setupNotifications();
  }, []);

  // Fungsi mengambil data todo dari database menggunakan Supabase
  const fetchTodos = async () => {
    try {
      setLoading(true); // Set loading menjadi `true` saat data sedang diambil
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error; // Tangani error

      setTodos(data || []); // Set data ke state `todos`
    } catch (error) {
      toast.error('Failed to fetch todos'); // Tampilkan pesan error
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false); // Set loading menjadi `false` setelah data diambil
    }
  };

  // Fungsi menambah todo baru ke database
  const addTodo = async (title, reminderAt) => {
    try {
      const newTodo = {
        title,
        completed: false,
        created_at: new Date().toISOString(),
        reminder_at: reminderAt?.toISOString(),
        user_id: 'demo-user', // Contoh ID pengguna; perlu diganti dengan ID pengguna sebenarnya
      };

      const { error } = await supabase.from('todos').insert([newTodo]);
      if (error) throw error;

      toast.success('Todo added successfully'); // Tampilkan pesan sukses
      await fetchTodos(); // Ambil ulang data todo agar data terbaru tampil

      if (reminderAt) {
        scheduleNotification(title, reminderAt); // Jadwalkan notifikasi jika ada pengingat
      }
    } catch (error) {
      toast.error('Failed to add todo');
      console.error('Error adding todo:', error);
    }
  };

  // Fungsi toggle status penyelesaian todo
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      await fetchTodos(); // Refresh data todo
    } catch (error) {
      toast.error('Failed to update todo');
      console.error('Error updating todo:', error);
    }
  };

  // Fungsi hapus todo dari database
  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;

      toast.success('Todo deleted successfully');
      await fetchTodos();
    } catch (error) {
      toast.error('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  // Fungsi setup notifikasi browser untuk izin menampilkan notifikasi
  const setupNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().catch(console.error);
    }
  };

  // Fungsi menjadwalkan notifikasi berdasarkan waktu pengingat
  const scheduleNotification = (title, reminderAt) => {
    const now = new Date();
    const delay = reminderAt.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Todo Reminder', {
            body: title,
            icon: '/favicon.ico',
          });
        }
      }, delay);
    }
  };

  // Filter todo berdasarkan status `completed` dan kata pencarian
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Container utama aplikasi */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          {/* Header aplikasi dengan ikon dan judul */}
          <div className="flex items-center gap-3 mb-8">
            <BookCheck size={32} className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Todo List App</h1>
          </div>

          {/* Input untuk menambahkan todo baru */}
          <TodoInput onAdd={addTodo} />
          
          <div className="mt-8">
            {/* Komponen pencarian dan filter todo */}
            <SearchFilter
              search={search}
              onSearchChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
            />
            
            {/* Kondisi loading atau tampilkan daftar todo */}
            {loading ? (
              <div className="text-center py-8">
                {/* Loader saat data sedang dimuat */}
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              <TodoList
                todos={filteredTodos} // Daftar todo yang telah difilter
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" /> {/* Komponen Toaster untuk menampilkan notifikasi */}
    </div>
  );
}

export default App;

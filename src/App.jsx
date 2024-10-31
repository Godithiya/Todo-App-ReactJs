import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { SearchFilter } from './components/SearchFilter';
import { supabase } from './lib/supabase';
import { BookCheck } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
    setupNotifications();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTodos(data || []);
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title, reminderAt) => {
    try {
      const newTodo = {
        title,
        completed: false,
        created_at: new Date().toISOString(),
        reminder_at: reminderAt?.toISOString(),
        user_id: 'demo-user', // Replace with actual user ID from auth
      };

      const { error } = await supabase.from('todos').insert([newTodo]);
      if (error) throw error;

      toast.success('Todo added successfully');
      await fetchTodos();

      if (reminderAt) {
        scheduleNotification(title, reminderAt);
      }
    } catch (error) {
      toast.error('Failed to add todo');
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      await fetchTodos();
    } catch (error) {
      toast.error('Failed to update todo');
      console.error('Error updating todo:', error);
    }
  };

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

  const setupNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().catch(console.error);
    }
  };

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
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <BookCheck size={32} className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Modern Todo List</h1>
          </div>

          <TodoInput onAdd={addTodo} />
          
          <div className="mt-8">
            <SearchFilter
              search={search}
              onSearchChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
            />
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              <TodoList
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
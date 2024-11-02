import React from 'react';
import { Search } from 'lucide-react'; 

// Komponen SearchFilter menerima beberapa properti untuk pencarian dan filter:
// - `search`: nilai input pencarian
// - `onSearchChange`: fungsi untuk menangani perubahan pada input pencarian
// - `filter`: status filter yang dipilih
// - `onFilterChange`: fungsi untuk menangani perubahan status filter
export function SearchFilter({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Input Pencarian */}
      <div className="relative flex-1">
        {/* Ikon search ditampilkan di dalam input */}
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        
        {/* Input untuk memasukkan kata kunci pencarian */}
        <input
          type="text"
          value={search} // Menggunakan nilai `search` dari prop
          onChange={(e) => onSearchChange(e.target.value)} // Memanggil `onSearchChange` saat nilai input berubah
          placeholder="Search todos..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      {/* Tombol Filter */}
      <div className="flex gap-2">
        {/* Membuat tiga tombol untuk filter (all, active, completed) */}
        {['all', 'active', 'completed'].map((value) => (
          <button
            key={value} // Menambahkan `key` unik untuk setiap tombol
            onClick={() => onFilterChange(value)} // Memanggil `onFilterChange` dengan nilai filter saat tombol diklik
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === value
                ? 'bg-indigo-600 text-white' // Warna saat tombol aktif
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Warna saat tombol tidak aktif
            }`}
          >
            {value} {/* Menampilkan label tombol berdasarkan nilai filter */}
          </button>
        ))}
      </div>
    </div>
  );
}

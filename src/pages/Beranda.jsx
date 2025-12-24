import React from 'react';
// Anda mungkin ingin menambahkan navigasi menggunakan 'react-router-dom' 
// jika Anda memiliki rute lain, tapi di sini kita buat sederhana.

const Beranda = () => {
  // Data placeholder untuk simulasi dokumen yang sudah ditandatangani
  const dokumenTerbaru = [
    { id: 1, nama: 'Kontrak Kerjasama Q3', tanggal: '15 Nov 2025', status: 'Selesai' },
    { id: 2, nama: 'Formulir Persetujuan Cuti', tanggal: '12 Nov 2025', status: 'Menunggu Saya' },
    { id: 3, nama: 'Memo Internal Proyek X', tanggal: '10 Nov 2025', status: 'Selesai' },
  ];

  // Handler fungsi placeholder
  const handleBuatTandaTangan = () => {
    alert('Aksi: Arahkan ke halaman unggah dokumen untuk ditandatangani.');
    // Di aplikasi nyata, gunakan navigate('/buat-tanda-tangan');
  };

  const handleLihatDokumen = (id) => {
    alert(`Aksi: Lihat detail dokumen ID: ${id}`);
    // Di aplikasi nyata, gunakan navigate(`/dokumen/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang di E-Sign App
        </h1>
        <p className="text-gray-500">
          Kelola dokumen dan tanda tangan elektronik Anda dengan mudah.
        </p>
      </header>

      {/* --- Bagian Utama Aksi Cepat --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Kartu 1: Buat Tanda Tangan Baru */}
        <div 
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-500 cursor-pointer"
          onClick={handleBuatTandaTangan}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Buat Tanda Tangan Baru
              </h2>
              <p className="text-gray-500 text-sm">
                Unggah dokumen untuk ditandatangani atau dikirim.
              </p>
            </div>
          </div>
        </div>

        {/* Kartu 2: Lihat Riwayat Dokumen */}
        <div 
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-purple-500 cursor-pointer"
          onClick={() => alert('Aksi: Arahkan ke halaman riwayat dokumen.')}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg 
                className="w-6 h-6 text-purple-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Riwayat & Status Dokumen
              </h2>
              <p className="text-gray-500 text-sm">
                Periksa status semua dokumen yang Anda kirim dan terima.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Bagian Dokumen Terbaru --- */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🗓️ Dokumen Terbaru
        </h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {dokumenTerbaru.map((dokumen) => (
              <li 
                key={dokumen.id} 
                className="p-4 hover:bg-gray-50 transition duration-150 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-gray-700">{dokumen.nama}</p>
                  <p className="text-sm text-gray-500">
                    Terakhir diubah: {dokumen.tanggal}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Badge Status */}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                    ${dokumen.status === 'Selesai' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {dokumen.status}
                  </span>
                  
                  {/* Tombol Aksi */}
                  <button
                    onClick={() => handleLihatDokumen(dokumen.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition duration-150"
                  >
                    Lihat Detail
                  </button>
                </div>
              </li>
            ))}
            {/* Opsi untuk dokumen lain */}
            <li className="p-4 text-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => alert('Aksi: Arahkan ke halaman semua dokumen.')}
              >
                Tampilkan Semua Dokumen →
              </button>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Beranda;
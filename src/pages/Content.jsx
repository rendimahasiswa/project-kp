import React from 'react';

const Content = () => {
  return (
    <div className="w-full min-h-full pb-10">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Sistem Enkripsi Dokumen
        </h1>
        <p className="text-gray-500 mt-2 text-lg font-light max-w-3xl">
          Platform keamanan digital untuk melindungi privasi dokumen Anda dengan standar enkripsi tingkat tinggi.
        </p>
      </div>

      {/* MAIN EXPLANATION CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#339609] rounded-full"></span>
              Cara Kerja Sistem
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Setiap file yang Anda unggah tidak disimpan dalam bentuk asli. Sistem kami mengonversi dokumen Anda menjadi format terenkripsi yang tidak dapat dibaca oleh siapa pun—bahkan oleh administrator—tanpa kunci dekripsi yang valid.
            </p>
            
            {/* ALERT BOX KECIL */}
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-800">
              <strong>Privasi Terjamin:</strong> Dokumen sensitif seperti data pribadi, laporan keuangan, dan arsip hukum aman dari risiko kebocoran.
            </div>
          </div>
        </div>
      </div>

      {/* STEPS GRID (Mengganti List Vertikal agar lebih menarik) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="text-3xl mb-3">🔐</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">1. Enkripsi Otomatis</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Sistem secara otomatis mengunci file sesaat setelah diunggah, bahkan sebelum file dipindahkan ke penyimpanan server.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="text-3xl mb-3">🧩</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">2. Kunci Enkripsi Unik</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Setiap dokumen dibangkitkan dengan kunci enkripsi (key) yang unik dan berbeda satu sama lain untuk keamanan berlapis.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="text-3xl mb-3">☁️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">3. Penyimpanan Aman</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            File terenkripsi disimpan di <i>Supabase Storage</i> dan tidak akan pernah dapat diakses atau dibuka dalam bentuk aslinya.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">4. Privasi Maksimal</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Hanya Anda yang memegang kendali. Tidak ada pihak ketiga yang dapat membaca isi dokumen tanpa proses dekripsi.
          </p>
        </div>
      </div>

      {/* FOOTER & DISCLAIMER */}
      <div className="border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-400 text-center mb-2 italic">
          *Catatan: Website ini hanya menyediakan fitur enkripsi dan penyimpanan dokumen. Tidak terdapat fitur tanda tangan digital atau pengesahan dokumen.
        </p>
        <footer className="text-center text-gray-400 text-xs font-medium">
          © {new Date().getFullYear()} Sistem Enkripsi Dokumen. All rights reserved.
        </footer>
      </div>

    </div>
  );
};

export default Content;
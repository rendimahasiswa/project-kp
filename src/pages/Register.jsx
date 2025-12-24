import React, { useState } from "react";
import logo from "../assets/sien.png";
import { Link, useNavigate } from "react-router-dom"; 
// HAPUS import supabase karena kita pakai API lokal
// import { supabase } from "../supabase-client"; 

const Register = () => {
  const navigate = useNavigate(); 
  const [role, setRole] = useState("user"); 
  const [loading, setLoading] = useState(false); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    telephone: "",
    nik: "",
  });

  function handleChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Siapkan data sesuai format API Backend
    const payload = {
        email: formData.email,
        password: formData.password,
        role: role,
        // Jika admin, nama default 'Administrator', jika user ambil dari form
        name: role === 'admin' ? "Administrator" : formData.fullName,
        telephone: role === 'admin' ? "-" : formData.telephone,
        nik: role === 'admin' ? "-" : formData.nik
    };

    try {
      // GANTI SUPABASE DENGAN FETCH API LOKAL
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registrasi Gagal");
      }

      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/signin"); // Arahkan ke login setelah sukses
      
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f0f5f3] min-h-screen flex flex-col items-center justify-center font-sans p-4">
      
      <div className="mb-8 animate-fade-in-down">
        <img src={logo} alt="Logo Sien" className="w-[180px] object-contain drop-shadow-md" />
      </div>

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        <div className="bg-white p-8 pb-0 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
          <p className="text-gray-500 text-sm">Silakan pilih jenis akun yang ingin Anda buat.</p>
        </div>

        <div className="px-8 mt-6">
          <div className="bg-gray-100 p-1 rounded-full flex relative cursor-pointer">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                role === "user"
                  ? "bg-white text-[#339609] shadow-md transform scale-105"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👤 User
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                role === "admin"
                  ? "bg-white text-[#339609] shadow-md transform scale-105"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🛠️ Admin
            </button>
          </div>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
              />
            </div>

            {role === "user" && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nama Lengkap"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">No. Telepon</label>
                    <input
                      type="text" // Ganti type numeric jadi text agar lebih aman
                      name="telephone"
                      placeholder="0812..."
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">NIK</label>
                    <input
                      type="text"
                      name="nik"
                      placeholder="NIK"
                      value={formData.nik}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === "admin" && (
              <div className="bg-yellow-50 text-yellow-800 text-sm p-4 rounded-xl border border-yellow-200 animate-fade-in-up">
                <p>⚠️ <b>Perhatian:</b> Akun admin memiliki akses penuh ke sistem.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg mt-6 transition-all duration-300 transform hover:-translate-y-1 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#339609] hover:bg-[#287a07] shadow-green-200"
              }`}
            >
              {loading ? "Memproses..." : role === "admin" ? "Daftar Administrator" : "Daftar Sekarang"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 pb-2">
            Sudah punya akun?{" "}
            <Link to="/signin" className="text-[#339609] font-bold hover:underline">
              Login disini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
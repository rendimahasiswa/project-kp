import React, { useState } from "react";
import logo from "../assets/sien.png";
import { Link, useNavigate } from "react-router-dom";
// HAPUS import supabase
// import { supabase } from "../supabase-client";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); 

    try {
      // FETCH KE API LOGIN LOKAL
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login Gagal");
      }

      // LOGIN SUKSES
      // Simpan data user ke LocalStorage (sebagai pengganti Session Supabase)
      // JSON.stringify penting karena localStorage cuma bisa simpan teks
      localStorage.setItem("user_session", JSON.stringify(result.user));

      navigate("/dashboard");

    } catch (error) {
      setMessage("Login Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f5f3] min-h-screen flex flex-col items-center justify-center font-sans p-4">
      
      {/* HEADER LOGO */}
      <div className="mb-8 animate-fade-in-down">
        <img
          src={logo}
          alt="Logo Sien"
          className="w-[180px] object-contain drop-shadow-md"
        />
      </div>

      {/* CARD CONTAINER */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* HEADER CARD */}
        <div className="bg-white p-8 pb-0 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang
          </h2>
          <p className="text-gray-500 text-sm">
            Silakan masuk untuk melanjutkan ke Dashboard.
          </p>
        </div>

        {/* ERROR MESSAGE ALERT */}
        {message && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
            {message}
          </div>
        )}

        {/* FORM SECTION */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSignIn} className="space-y-5">
            
            {/* EMAIL INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:bg-white transition-all"
              />
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#339609] focus:ring-[#339609] border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-700 cursor-pointer"
                >
                  Ingat saya
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="#"
                  className="font-medium text-[#339609] hover:text-[#287a07] hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg mt-6 transition-all duration-300 transform hover:-translate-y-1 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#339609] hover:bg-[#287a07] shadow-green-200"
              }`}
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <a
                href="#"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                Google
              </a>
            </div>
          </div>

          {/* FOOTER LINK */}
          <div className="mt-8 text-center text-sm text-gray-500 pb-2">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-[#339609] font-bold hover:underline"
            >
              Daftar disini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
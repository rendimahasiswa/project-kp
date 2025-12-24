import React, { useState } from "react";
import logo from "../assets/sien.png";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";

const Register = () => {
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
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            telephone: formData.telephone,
            nik: formData.nik,
          },
        },
      });

      if (error) throw error;
      alert("Silakan cek email Anda untuk verifikasi.");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <div className="bg-[#f0f5f3] min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between w-full px-6 sm:px-12 lg:px-[300px] py-4 flex-wrap gap-4">
          <img src={logo} alt="Logo" className="w-[150px] sm:w-[200px] object-contain" />

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/signin"
              className="text-white font-semibold bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full text-center w-full sm:w-auto"
            >
              Login
            </Link>
            <Link
              to="#"
              className="text-white font-semibold bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-center w-full sm:w-auto"
            >
              Kontak Kami
            </Link>
          </div>
        </header>

        {/* MAIN FORM SECTION */}
        <main className="flex flex-col lg:flex-row flex-1 bg-white mx-4 sm:mx-8 lg:mx-[300px] my-6 rounded-xl overflow-hidden shadow-md">
          <div className="flex flex-col items-center justify-center w-full p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
              <h2 className="text-3xl sm:text-4xl font-semibold mb-2 text-center lg:text-left">
                Daftarkan diri anda
              </h2>

              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-full py-2 px-6 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-full py-2 px-6 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="text"
                placeholder="Nama Lengkap"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-full py-2 px-6 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-full py-2 px-6 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="text"
                placeholder="NIK"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-full py-2 px-6 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                className="text-lg sm:text-xl text-white font-medium bg-green-600 py-2 px-12 rounded-full hover:bg-green-700 transition-colors duration-200 w-full"
              >
                Daftar
              </button>
            </form>

            {/* GOOGLE */}
            <div className="mt-5">
              <a href="#" className="text-blue-600 font-medium">Sign in with Google</a>
            </div>

            <div>
              <p className="mt-5 font-semibold">
                Sudah punya akun?{" "}
                <Link to="/signin" className="text-green-600 underline">Login</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Register;

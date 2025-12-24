import React, { useEffect, useState } from "react";
import { Edit2, User, Mail, Phone, CreditCard, X, Save } from "lucide-react";

const Profil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false); 

  // --- 1. FETCH DATA DARI API LOKAL ---
  const fetchProfile = async () => {
    // Ambil user dari Local Storage (Session Login)
    const storedUser = localStorage.getItem("user_session");

    if (!storedUser) {
        console.log("No Session found");
        setLoading(false);
        return;
    }

    try {
        const session = JSON.parse(storedUser);
        const userId = session.id;

        // Request ke Backend Lokal
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Gagal mengambil data user");
        }

        // Simpan data ke state
        setUserData(result.data);

    } catch (error) {
        console.error("Error fetching profile:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateSuccess = () => {
    fetchProfile(); // Refresh tampilan
    setIsEditOpen(false); 
    alert("Profil berhasil diperbarui!");
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-32 bg-gray-200 w-full"></div>
          <div className="px-8 pb-8 relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white absolute -top-12"></div>
            <div className="mt-16 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="text-5xl mb-4">😕</div>
        <h3 className="text-xl font-bold text-gray-800">Data Tidak Ditemukan</h3>
        <p className="text-gray-500">Gagal memuat informasi pengguna.</p>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div className="w-full pb-10">
      
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Profil Saya</h1>
        <p className="text-gray-500 mt-1">Kelola informasi pribadi dan akun Anda.</p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* BANNER */}
        <div className="h-32 bg-gradient-to-r from-[#2c6c50] to-[#339609] w-full relative">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="px-6 md:px-10 pb-10 relative">
          
          {/* AVATAR & NAME */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-8 gap-6">
            <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-md bg-white flex items-center justify-center overflow-hidden relative z-10">
               <span className="text-4xl font-bold text-[#339609]">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
               </span>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{userData.name}</h2>
              <p className="text-gray-500 font-medium">{userData.email}</p>
            </div>

            {/* EDIT BUTTON (Aktif) */}
            <div className="mt-4 sm:mt-0">
               <button 
                 onClick={() => setIsEditOpen(true)}
                 className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-[#339609] font-medium rounded-xl transition-all duration-300 border border-gray-200 hover:border-green-200"
               >
                 <Edit2 size={18} />
                 <span>Edit Profil</span>
               </button>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard 
              label="Nama Lengkap" 
              value={userData.name} 
              icon={<User size={20} />}
            />
             <InfoCard 
              label="Alamat Email" 
              value={userData.email} 
              icon={<Mail size={20} />}
            />
            <InfoCard 
              label="Nomor Telepon" 
              value={userData.telephone || "-"} 
              icon={<Phone size={20} />}
              empty={!userData.telephone}
            />
            <InfoCard 
              label="Nomor Induk Kependudukan (NIK)" 
              value={userData.nik || "-"} 
              icon={<CreditCard size={20} />}
              empty={!userData.nik}
            />
          </div>

        </div>
      </div>

      {/* --- MODAL EDIT PROFIL --- */}
      <EditProfileModal 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={userData}
        onSuccess={handleUpdateSuccess}
      />

    </div>
  );
};

// --- SUB-COMPONENTS ---

const InfoCard = ({ label, value, icon, empty }) => (
  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-start gap-4 hover:border-green-200 transition-colors duration-300">
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 border border-gray-100 shrink-0">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`font-medium text-lg truncate ${empty ? 'text-gray-400 italic' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  </div>
);

// --- COMPONENT MODAL EDIT (LOCAL API UPDATE) ---
const EditProfileModal = ({ isOpen, onClose, userData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    telephone: "",
    nik: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        telephone: userData.telephone || "",
        nik: userData.nik || ""
      });
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. UPDATE KE API LOKAL (PUT)
      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name: formData.name,
              telephone: formData.telephone,
              nik: formData.nik
          })
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || "Gagal update profil");
      }
      
      // Update juga session lokal jika nama berubah (Opsional, agar Sidebar langsung berubah)
      const storedUser = localStorage.getItem("user_session");
      if(storedUser) {
          const session = JSON.parse(storedUser);
          session.name = formData.name; // Update nama di session lokal
          localStorage.setItem("user_session", JSON.stringify(session));
      }

      onSuccess(); // Trigger refresh di parent
    } catch (error) {
      alert("Gagal update profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Profil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#339609] focus:outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
               <input
                 type="text"
                 value={formData.telephone}
                 onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#339609] focus:outline-none transition-all"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
               <input
                 type="text"
                 value={formData.nik}
                 onChange={(e) => setFormData({...formData, nik: e.target.value})}
                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#339609] focus:outline-none transition-all"
               />
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button
               type="button"
               onClick={onClose}
               className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
             >
               Batal
             </button>
             <button
               type="submit"
               disabled={loading}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all ${
                 loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#339609] hover:bg-[#287a07] hover:shadow-green-200"
               }`}
             >
               {loading ? (
                 "Menyimpan..."
               ) : (
                 <>
                   <Save size={18} /> Simpan Perubahan
                 </>
               )}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Profil;
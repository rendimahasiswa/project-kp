import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import EditUserModal from "./EditUserModal";
import DeleteAlert from "./DeleteAlert";

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    const { error } = await supabase.from("users").delete().eq("id", selectedUser.id);

    if (error) {
      alert("Gagal menghapus user: " + error.message);
    } else {
      fetchUsers();
    }
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateSuccess = () => {
    fetchUsers();
    alert("Data user berhasil diperbarui!");
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredUsers = users.filter((user) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manajemen User</h1>
          <p className="text-gray-500 mt-1">
            Total Pengguna: <span className="font-semibold text-[#339609]">{filteredUsers.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="search"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#339609] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <button
            onClick={fetchUsers}
            className="bg-[#339609] hover:bg-[#287a07] text-white px-4 py-2.5 rounded-full transition-colors shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg w-full"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">No</th>
                  <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Telepon</th>
                  <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => {
                    const nomorUrut = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={user.id} className="hover:bg-green-50/30 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{nomorUrut}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span className="text-sm font-semibold text-gray-800">{user.name || "Tanpa Nama"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.telephone || "-"}</td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() => handleEditClick(user)}
                              className="p-2 rounded-lg text-gray-400 hover:text-[#339609] hover:bg-green-50 transition-colors"
                              title="Edit User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>

                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada data user ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsers.length)} dari {filteredUsers.length} data            </span>
            <div className="flex gap-2">
              <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Previous</button>
              <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Next</button>
            </div>
          </div>
        )}
      </div>


      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <DeleteAlert
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        userName={selectedUser?.name || "User ini"}
      />

    </div>
  );
};

export default EditUsers;
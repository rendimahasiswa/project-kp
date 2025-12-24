import React, { useState, useEffect } from "react";
import user_logo from "../assets/user.jpg";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  User,
  Users,
  FileEdit,
  FileText,
  UploadCloud,
  LogOut,
  X,
  FolderOpen
} from "lucide-react";

import menuopen from "../assets/menu-open.png";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import DecryptedList from "./DecryptedList";
import logoutDelete from "../assets/logout-delete.svg";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Beranda");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  
  // State User
  const [user, setUser] = useState(null); // Menyimpan objek user lengkap
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. ACTIVE MENU LOGIC ---
  useEffect(() => {
    const path = location.pathname.toLowerCase(); 

    if (path === "/dashboard" || path === "/dashboard/") {
      setActiveItem("Beranda");
    } else if (path.includes("/dashboard/editusers")) {
      setActiveItem("EditUsers");
    } else if (path.includes("/dashboard/decrypt")) { // EditFile diganti Decrypt
      setActiveItem("DecryptFile");
    } else if (path.includes("/dashboard/documents")) {
      setActiveItem("Documents");
    } else if (path.includes("/dashboard/profil")) {
      setActiveItem("Profile");
    } else if (path.includes("/dashboard/upload")) {
      setActiveItem("Upload");
    } else if (path.includes("/dashboard/open-files")) {
      setActiveItem("OpenFiles");
    }
  }, [location]);

  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/dashboard/decrypt")) return "Dekripsi File";
    if (path.includes("/dashboard/editusers")) return "Manajemen User";
    if (path.includes("/dashboard/documents")) return "Dokumen PDF";
    if (path.includes("/dashboard/profil")) return "Profil Saya";
    if (path.includes("/dashboard/upload")) return "Upload File";
    if (path.includes("/dashboard/open-files")) return "File Terbuka";
    return "Beranda";
  };

  // --- 2. AUTH CHECK (LOCAL STORAGE) ---
  useEffect(() => {
    const checkAuth = () => {
      // Ambil data dari LocalStorage yang kita simpan saat Login
      const storedUser = localStorage.getItem("user_session");

      if (!storedUser) {
        // Jika tidak ada session, tendang ke login
        navigate("/signin");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role);
        setUserName(userData.name);
      } catch (error) {
        console.error("Session rusak:", error);
        localStorage.removeItem("user_session");
        navigate("/signin");
      }
    };

    checkAuth();
  }, [navigate]);

  // --- 3. LOGOUT FUNCTION ---
  const handleLogout = () => {
    // Hapus session dari storage
    localStorage.removeItem("user_session");
    navigate("/signin");
  };

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f0f5f3] overflow-hidden font-sans">

      <aside
        className={`bg-white shadow-xl h-full flex flex-col justify-between transition-all duration-300 z-50
          ${isSidebarActive
            ? "fixed left-0 top-0 w-[280px]"
            : "fixed -left-[280px] w-[280px] lg:static lg:left-0 lg:w-[260px] lg:flex-shrink-0"
          }
        `}
      >
        {/* Sidebar Header & User Info */}
        <div className="overflow-y-auto flex-1 py-8 px-6 no-scrollbar">
          {/* Close Button Mobile */}
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 lg:hidden"
          >
            <X size={28} />
          </button>

          <div className="logo w-full flex justify-center mb-8">
            <Link to="/dashboard">
              <img
                src={logo}
                alt="Logo Sien"
                className="w-32 h-auto object-contain"
              />
            </Link>
          </div>

          <div className="admin-info flex flex-col items-center mb-10">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-[#f0f5f3] shadow-sm mb-4">
              <img
                src={user_logo}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xl font-semibold text-gray-700 hover:text-[#339609] transition-colors"
            >
              {userName || "Loading..."}
            </button>
            <span className="text-sm text-gray-400 capitalize">{role}</span>
          </div>

          {/* Navigation Menu */}
          <nav>
            {role === "admin" && (
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setActiveItem("Beranda")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Beranda"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <LayoutDashboard size={20} />
                    <span className="text-md font-medium">Beranda</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/documents"
                    onClick={() => setActiveItem("Documents")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Documents"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <FileText size={20} />
                    <span className="text-md font-medium">Documents</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/decrypt"
                    onClick={() => setActiveItem("DecryptFile")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "DecryptFile"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <FileEdit size={20} />
                    <span className="text-md font-medium">Deskrip File</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    to="/dashboard/editusers"
                    onClick={() => setActiveItem("EditUsers")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "EditUsers"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <Users size={20} />
                    <span className="text-md font-medium">Users</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/profil"
                    onClick={() => setActiveItem("Profile")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Profile"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <User size={20} />
                    <span className="text-md font-medium">Profil</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/Upload"
                    onClick={() => setActiveItem("Upload")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Upload"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <UploadCloud size={20} />
                    <span className="text-md font-medium">Upload</span>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/dashboard/open-files"
                    onClick={() => setActiveItem("OpenFiles")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "OpenFiles"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <FolderOpen size={20} />
                    <span className="text-md font-medium">File Terbuka</span>
                  </Link>
                </li> */}
              </ul>
            )}
            {role === "user" && (
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setActiveItem("Beranda")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Beranda"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <LayoutDashboard size={20} />
                    <span className="text-md font-medium">Beranda</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/profil"
                    onClick={() => setActiveItem("Profile")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Profile"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <User size={20} />
                    <span className="text-md font-medium">Profil</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/Upload"
                    onClick={() => setActiveItem("Upload")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Upload"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <UploadCloud size={20} />
                    <span className="text-md font-medium">Upload</span>
                  </Link>
                </li>
                    <li>
                  <Link
                    to="/dashboard/documents"
                    onClick={() => setActiveItem("Documents")}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeItem === "Documents"
                        ? "bg-[#339609] text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <FileText size={20} />
                    <span className="text-md font-medium">Documents</span>
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full gap-4 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
          >
            <LogOut size={20} />
            <span className="text-md font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[90px] bg-white flex items-center justify-between px-8 shadow-sm flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <img
              src={menuopen}
              alt="Menu"
              className="w-[30px] h-[30px] cursor-pointer lg:hidden"
              onClick={toggleSidebar}
            />
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {getPageTitle()}
              </h2>
              <p className="text-sm text-gray-500 hidden sm:block">
                Manage your account here
              </p>
            </div>
          </div>

          <div className="hidden lg:block relative w-[350px]">
            <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-none text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f0f5f3]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all duration-300">

          <div className="relative w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl transition-all animate-fade-in-up">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
              <img
                src={logoutDelete}
                alt="Logout Icon"
                className="h-16 w-16 object-contain"
              />
            </div>

            <h3 className="mb-2 text-2xl font-bold text-gray-800">
              Log out?
            </h3>
            <p className="mb-8 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to log out from the application?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="rounded-xl bg-[#2c6c50] py-3 text-sm font-semibold text-white shadow-lg shadow-green-100 hover:bg-[#235740] hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Yes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
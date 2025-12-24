import React from "react";
import deleteIcon from "../assets/delete-icon-01.svg";

const DeleteAlert = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
        
        {/* Icon Warning */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Pengguna?</h3>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Apakah Anda yakin ingin menghapus user <strong>"{userName}"</strong>?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="py-3 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="py-3 px-4 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;
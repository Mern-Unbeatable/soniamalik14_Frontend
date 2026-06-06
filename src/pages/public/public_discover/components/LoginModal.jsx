import React from 'react';

const LoginModal = ({ isOpen, onClose, onLoginClick }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg">
                <div className="text-center">
                    <p className="text-gray-700 text-xl font-semibold mb-6">
                       To contact this club or register interest, please log in.
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="w-full bg-btn-primary hover:bg-[#0d655d] text-white font-semibold py-3 px-4 rounded-lg transition"
                    >
                        Log In
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full text-gray-500 font-semibold py-2 px-4 rounded-lg mt-3 hover:text-gray-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCreateCategoryLoading } from '../../../../../features/sportsCategories/sportsCategoriesSlice';

const AddCategoryModal = ({ isOpen, onClose, onSave, initialName = '' }) => {
    const [sportName, setSportName] = useState('');
    const isLoading = useSelector(selectCreateCategoryLoading);

    useEffect(() => {
        if (isOpen) {
            setSportName(initialName);
        } else {
            setSportName('');
        }
    }, [isOpen, initialName]);

    const handleSave = () => {
        if (sportName.trim() && !isLoading) {
            onSave(sportName);
        }
    };

    const handleClose = () => {
        if (isLoading) return;
        setSportName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">

                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Sport Categories</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sport Name Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sport Name
                    </label>
                    <input
                        type="text"
                        value={sportName}
                        onChange={(e) => setSportName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                        placeholder="Write sport name"
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-transparent disabled:opacity-50"
                        autoFocus
                        disabled={isLoading}
                    />
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isLoading || !sportName.trim()}
                    className="w-full px-6 py-2.5 bg-[#0f766e] text-white font-medium rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default AddCategoryModal;

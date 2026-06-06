import React from 'react';
import { ImagePlus, X } from 'lucide-react';

const AddNewsModal = ({
    isOpen,
    formData,
    onFormChange,
    onImageUpload,
    onUploadImageClick,
    onRemoveImage,
    onSave,
    onClose,
    imageFileRef
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">

                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900">News</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">

                    {/* News Title */}
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">News Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onFormChange}
                            placeholder="Enter membership title here"
                            className="w-full bg-[#f5f5f5] border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500"
                        />
                    </div>

                    {/* News Description */}
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">News Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onFormChange}
                            placeholder="Description"
                            className="w-full h-24 bg-[#f5f5f5] border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0f766e]/20 outline-none resize-none text-gray-800 placeholder-gray-500"
                        />
                    </div>

                    {/* Upload Image */}
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Upload Image</label>
                        <div
                            onClick={onUploadImageClick}
                            className="w-full h-32 bg-[#f5f5f5] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors relative overflow-hidden group border border-gray-200"
                        >
                            {formData.image ? (
                                <>
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveImage();
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <ImagePlus className="w-7 h-7 text-[#0F766E] mb-2 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                                    <span className="text-xs font-medium text-gray-600">Upload image</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden Image Input */}
                <input
                    ref={imageFileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onImageUpload}
                />

                {/* Modal Footer */}
                <div className="border-t border-gray-200 p-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 py-2 px-4 bg-[#0f766e] text-white font-medium rounded-lg hover:bg-teal-800 transition-colors"
                    >
                        Save News
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewsModal;

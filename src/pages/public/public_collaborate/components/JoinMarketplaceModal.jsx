import React, { useState } from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { POST } from '../../../../services/httpMethods';

const JoinMarketplaceModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        brandName: '',
        websiteLink: '',
        whatYouOffer: '',
        postCode: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                sports: formData.whatYouOffer, // map for backwards compatibility
            };
            const response = await POST('/api/brands', payload);
            
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response?.data?.message || 'Successfully submitted application to join the marketplace!',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#107C66',
            });
            
            setFormData({
                name: '',
                email: '',
                phone: '',
                brandName: '',
                websiteLink: '',
                whatYouOffer: '',
                postCode: '',
                message: '',
            });
            onClose();
        } catch (error) {
            console.error('Error submitting brand form:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to submit application. Please try again.',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#107C66',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative max-h-[90vh] flex flex-col overflow-hidden">

                {/* Sticky Header */}
                <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h3 className="text-2xl font-bold text-gray-900">Join Marketplace</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    {/* Scrollable Middle Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="enter your name"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="enter your email"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="enter your phone number"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Brand / business name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand / business name</label>
                            <input
                                type="text"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleInputChange}
                                placeholder="enter brand or business name"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Website or social media link Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website or social media link</label>
                            <input
                                type="text"
                                name="websiteLink"
                                value={formData.websiteLink}
                                onChange={handleInputChange}
                                placeholder="e.g., website or instagram link"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* What do you offer? Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">What do you offer?</label>
                            <input
                                type="text"
                                name="whatYouOffer"
                                value={formData.whatYouOffer}
                                onChange={handleInputChange}
                                placeholder="e.g., Products, Services, Events"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Post Code Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Post Code</label>
                            <input
                                type="text"
                                name="postCode"
                                value={formData.postCode}
                                onChange={handleInputChange}
                                placeholder="e.g., 1212"
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50"
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="write your message"
                                required
                                disabled={isSubmitting}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50 resize-none"
                            />
                        </div>
                    </div>

                    {/* Sticky Submit Button / Footer */}
                    <div className="px-8 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#107C66] hover:bg-[#0c6150] transition-colors duration-200 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Applying...' : 'Apply to join'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinMarketplaceModal;

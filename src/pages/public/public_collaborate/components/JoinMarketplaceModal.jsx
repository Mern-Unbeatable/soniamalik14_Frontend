import React, { useState } from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { POST } from '../../../../services/httpMethods';

const RequiredLabel = ({ children }) => (
    <label className="block text-sm font-medium text-[#107C66] mb-2">
        {children} <span className="text-red-500">*</span>
    </label>
);

const inputClassName =
    'w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#107C66] focus:border-transparent transition-colors disabled:opacity-50';

const JoinMarketplaceModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessname: '',
        offer: '',
        socialMediaLinks: '',
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
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                postCode: formData.postCode.trim(),
                businessname: formData.businessname.trim(),
                offer: formData.offer.trim(),
                socialMediaLinks: formData.socialMediaLinks.trim(),
                message: formData.message.trim(),
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
                businessname: '',
                offer: '',
                socialMediaLinks: '',
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
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full relative max-h-[90vh] flex flex-col overflow-hidden">

                {/* Sticky Header */}
                <div className="relative px-8 pt-8 pb-4 bg-white sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="text-center pr-6">
                        <h3 className="text-2xl font-bold text-[#107C66]">Join the Marketplace</h3>
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                            Tell us a bit about your brand or service and we&apos;ll review your request.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    {/* Scrollable Middle Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                        {/* Name Field */}
                        <div>
                            <RequiredLabel>Full name</RequiredLabel>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your name"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <RequiredLabel>Email address</RequiredLabel>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <RequiredLabel>Phone number</RequiredLabel>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Your phone number"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Brand / business name Field */}
                        <div>
                            <RequiredLabel>Brand / business name</RequiredLabel>
                            <input
                                type="text"
                                name="businessname"
                                value={formData.businessname}
                                onChange={handleInputChange}
                                placeholder="Business name"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Offer Field */}
                        <div>
                            <RequiredLabel>What do you offer?</RequiredLabel>
                            <input
                                type="text"
                                name="offer"
                                value={formData.offer}
                                onChange={handleInputChange}
                                placeholder="e.g. sportswear, kit, equipment"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Social media links Field */}
                        <div>
                            <RequiredLabel>Website or social media link</RequiredLabel>
                            <input
                                type="text"
                                name="socialMediaLinks"
                                value={formData.socialMediaLinks}
                                onChange={handleInputChange}
                                placeholder="Website or Instagram link"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Post Code Field */}
                        <div>
                            <RequiredLabel>Postcode / location</RequiredLabel>
                            <input
                                type="text"
                                name="postCode"
                                value={formData.postCode}
                                onChange={handleInputChange}
                                placeholder="e.g. SW1A 1AA"
                                required
                                disabled={isSubmitting}
                                className={inputClassName}
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <RequiredLabel>Message</RequiredLabel>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Tell us a little more"
                                required
                                disabled={isSubmitting}
                                rows={3}
                                className={`${inputClassName} resize-none`}
                            />
                        </div>
                    </div>

                    {/* Sticky Submit Button / Footer */}
                    <div className="px-8 pb-8 pt-2 bg-white sticky bottom-0 z-10">
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

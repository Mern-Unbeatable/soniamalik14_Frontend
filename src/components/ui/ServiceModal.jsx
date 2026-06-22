import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import Button from './Button';
import { useService } from '../../context/ServiceContext';

const ServiceModal = ({ isOpen, onClose, initialData = null, mode = 'create' }) => {
    const { createService, createLoading, updateService, updateLoading } = useService();

    const [formData, setFormData] = useState({
        title: '',
        serviceType: 'TRAINING',
        description: '',
        fullAddress: '',
        googleMapLinks: '',
        providerName: '',
        phone: '',
        email: '',
        availableDays: '',
        category: '',
        whoServiceFor: '',
        image: null,
    });

    useEffect(() => {
        if (initialData && mode === 'edit') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                title: initialData.title || '',
                serviceType: initialData.serviceType || 'TRAINING',
                description: initialData.description || '',
                fullAddress: initialData.fullAddress || '',
                googleMapLinks: initialData.googleMapLink || initialData.googleMapLinks || '',
                providerName: initialData.providerName || '',
                phone: initialData.providerPhone || initialData.phone || '',
                email: initialData.providerEmail || initialData.email || '',
                availableDays: initialData.availableDays || '',
                category: initialData.category || '',
                whoServiceFor: initialData.whoServiceFor || '',
                image: initialData.image || null,
            });
        } else if (mode === 'create') {
            setFormData({
                title: '',
                serviceType: 'TRAINING',
                description: '',
                fullAddress: '',
                googleMapLinks: '',
                providerName: '',
                phone: '',
                email: '',
                availableDays: '',
                category: '',
                whoServiceFor: '',
                image: null,
            });
        }
    }, [initialData, mode, isOpen]);

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        // minimal validation for required fields
        ['title', 'serviceType', 'description', 'fullAddress', 'providerName', 'phone', 'email'].forEach((k) => {
            const v = formData[k];
            if (!v || (typeof v === 'string' && v.trim() === '')) newErrors[k] = 'This field is required';
        });

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        // Prepare form data for API (use FormData for file upload)
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('serviceType', formData.serviceType);
        submitData.append('googleMapLink', formData.googleMapLinks); // Note: backend expects singular
        submitData.append('fullAddress', formData.fullAddress);
        submitData.append('providerName', formData.providerName);
        submitData.append('providerPhone', formData.phone); // backend expects providerPhone
        submitData.append('providerEmail', formData.email); // backend expects providerEmail
        submitData.append('availableDays', formData.availableDays);
        submitData.append('category', formData.category);
        submitData.append('whoServiceFor', formData.whoServiceFor);

        if (formData.image && typeof formData.image !== 'string') {
            submitData.append('image', formData.image);
        }

        let result;
        if (mode === 'edit' && initialData?.id) {
            result = await updateService(initialData.id, submitData);
        } else {
            result = await createService(submitData);
        }

        if (result.success) {
            // Reset form and close modal
            setFormData({
                title: '',
                serviceType: 'TRAINING',
                description: '',
                fullAddress: '',
                googleMapLinks: '',
                providerName: '',
                phone: '',
                email: '',
                availableDays: '',
                image: null,
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 sm:mx-6 flex flex-col max-h-[86vh]">
                {/* Sticky Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
                    <h2 className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Service' : 'Add Service'}</h2>
                    <button onClick={onClose} className="text-[#000000] bg-[#D9D9D9] rounded-full p-1" aria-label="Close">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-6">
                    <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Service Title</label>
                            <input type="text" placeholder="enter event title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                            {errors.title && <p className="text-base text-red-600 mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Service Type</label>
                            <select value={formData.serviceType} onChange={(e) => handleChange('serviceType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary">
                                <option value="COACHING">Coaching</option>
                                <option value="TRAINING">Training</option>
                                <option value="THERAPY">Therapy</option>
                                <option value="CONSULTATION">Consultation</option>
                                <option value="NUTRITION">Nutrition</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Full Description</label>
                            <textarea placeholder="Describe your event in details" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary resize-none" />
                            {errors.description && <p className="text-base text-red-600 mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Full Address</label>
                            <input type="text" placeholder="enter full address" value={formData.fullAddress} onChange={(e) => handleChange('fullAddress', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Google Maps Link</label>
                            <input type="text" placeholder="enter Google Maps Link" value={formData.googleMapLinks} onChange={(e) => handleChange('googleMapLinks', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-1">Service Provider Name</label>
                                <input type="text" placeholder="name" value={formData.providerName} onChange={(e) => handleChange('providerName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                                {errors.providerName && <p className="text-base text-red-600 mt-1">{errors.providerName}</p>}
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="text" placeholder="Phone number" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                                {errors.phone && <p className="text-base text-red-600 mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" placeholder="enter your email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                            {errors.email && <p className="text-base text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Available Days</label>
                            <input type="text" placeholder="e.g., Monday, Wednesday, Friday" value={formData.availableDays} onChange={(e) => handleChange('availableDays', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Category</label>
                            <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary">
                                <option value="">Select category</option>
                                <option value="Physio">Physio</option>
                                <option value="Nutrition">Nutrition</option>
                                <option value="Mental Health">Mental Health</option>
                                <option value="Wellbeing">Wellbeing</option>
                                <option value="Training">Training</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Who This Service Is For</label>
                            <input type="text" placeholder="e.g., Female athletes, Coaches" value={formData.whoServiceFor} onChange={(e) => handleChange('whoServiceFor', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-btn-primary" />
                        </div>

                        {/* Upload Image */}
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Upload Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                                <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-green-600 font-medium text-base mb-1">Upload Image</p>
                                <p className="text-gray-400 text-xs">JPEG files accepted. Max 100MB</p>
                                <input type="file" accept="image/jpeg,image/jpg" onChange={(e) => handleChange('image', e.target.files[0])} className="hidden" id="service-image-upload" />
                                <label htmlFor="service-image-upload" className="mt-3 inline-block cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-base text-gray-700">Choose File</label>
                                {formData.image && typeof formData.image === 'object' && formData.image.name && (
                                    <p className="text-base text-gray-700 mt-2">{formData.image.name}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer */}
                <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-lg z-10">
                    <Button
                        type="submit"
                        form="service-form"
                        variant="primary"
                        className="w-full rounded-lg py-3"
                        disabled={createLoading || updateLoading}
                    >
                        {(createLoading || updateLoading) ? (mode === 'edit' ? 'Updating...' : 'Submitting...') : (mode === 'edit' ? 'Update Service' : 'Submit For Approval')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;

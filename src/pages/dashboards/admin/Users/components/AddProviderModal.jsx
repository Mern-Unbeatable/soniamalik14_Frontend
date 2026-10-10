import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { SERVICE_TYPE_OPTIONS } from '../../../../../utils/serviceTypes';

const SPORT_OPTIONS = ['Football', 'Squash', 'Rugby', 'Netball', 'Cricket', 'Padel', 'Tennis', 'Badminton', 'Golf', 'Running', 'Other'];

const EMPTY_FORM = {
    organizationName: '',
    fullName: '',
    email: '',
    phone: '',
    postcode: '',
    about: '',
    options: [],
    otherOption: '',
};

const inputClassName =
    'w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-base text-[#1A1D1D] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/40';

const Field = ({ label, optional, children }) => (
    <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
            {label} {optional && <span className="font-normal text-white/60">(optional)</span>}
        </label>
        {children}
    </div>
);

const AddProviderModal = ({ onClose, providerType, onSubmit, submitting = false }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');

    const isSport = providerType === 'sport';
    const title = isSport ? 'Add sport provider' : 'Add service provider';
    const options = isSport ? SPORT_OPTIONS : SERVICE_TYPE_OPTIONS;
    const isOtherSelected = form.options.includes('Other');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleOption = (value) => {
        setForm((prev) => ({
            ...prev,
            options: prev.options.includes(value)
                ? prev.options.filter((item) => item !== value)
                : [...prev.options, value],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.organizationName.trim()) {
            setError(isSport ? 'Organisation or coach name is required' : 'Organisation or practitioner name is required');
            return;
        }
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
            setError('A valid email address is required');
            return;
        }
        if (isOtherSelected && !form.otherOption.trim()) {
            setError(isSport ? 'Please write the other sport' : 'Please write the other service type');
            return;
        }

        const selectedOptions = isOtherSelected
            ? [...form.options.filter((item) => item !== 'Other'), form.otherOption.trim()]
            : form.options;

        setError('');
        onSubmit?.({
            role: isSport ? 'COACH' : 'PROVIDER',
            organizationName: form.organizationName.trim(),
            firstName: form.fullName.trim() || undefined,
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            postcode: form.postcode.trim() || undefined,
            aboutOrganization: form.about.trim() || undefined,
            ...(isSport ? { sportsOffered: selectedOptions } : { serviceTypes: selectedOptions }),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#0f756d] shadow-2xl">
                <div className="flex items-start justify-between border-b border-white/15 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <p className="mt-1 text-sm text-white/80">
                            We'll email them a secure link to set their password and access their account.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 rounded-full bg-white/10 p-1 text-white transition-colors hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="max-h-[55vh] flex-1 space-y-4 overflow-y-auto px-6 py-5">
                        {error && (
                            <div className="rounded-lg border border-red-300 bg-red-500/20 px-4 py-2.5 text-sm text-white">
                                {error}
                            </div>
                        )}

                        <Field label={isSport ? 'Organisation or coach name' : 'Organisation or practitioner name'}>
                            <input
                                name="organizationName"
                                value={form.organizationName}
                                onChange={handleChange}
                                placeholder={isSport ? 'e.g. Woking Warriors FC' : 'Business or practice name'}
                                className={inputClassName}
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Contact name" optional>
                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    className={inputClassName}
                                />
                            </Field>
                            <Field label="Email">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Invite will be sent here"
                                    className={inputClassName}
                                />
                            </Field>
                            <Field label="Phone number" optional>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Best contact number"
                                    className={inputClassName}
                                />
                            </Field>
                            <Field label="Main location postcode" optional>
                                <input
                                    name="postcode"
                                    value={form.postcode}
                                    onChange={handleChange}
                                    placeholder="e.g. SW1A 1AA"
                                    className={inputClassName}
                                />
                            </Field>
                        </div>

                        <Field label={isSport ? 'Sports offered' : 'Service type'} optional>
                            <div className="flex flex-wrap gap-2">
                                {options.map((option) => {
                                    const selected = form.options.includes(option);
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => toggleOption(option)}
                                            className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                                                selected
                                                    ? 'border-[#F5F1EB] bg-[#F5F1EB] font-semibold text-[#0f756d]'
                                                    : 'border-white/20 bg-white/10 text-white hover:border-white/40'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {isOtherSelected && (
                                <input
                                    name="otherOption"
                                    value={form.otherOption}
                                    onChange={handleChange}
                                    placeholder={isSport ? 'Write the other sport, e.g. Hockey' : 'Write the other service type'}
                                    className={`${inputClassName} mt-3`}
                                    autoFocus
                                />
                            )}
                        </Field>

                        <Field label={isSport ? 'About the organisation' : 'About their services'} optional>
                            <textarea
                                name="about"
                                value={form.about}
                                onChange={handleChange}
                                rows={4}
                                placeholder="You can use information from their website or social media."
                                className={`${inputClassName} resize-none`}
                            />
                        </Field>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-white/15 px-6 py-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/30 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#F5F1EB] px-5 py-2.5 text-base font-bold text-[#0f756d] transition-all hover:bg-white hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Mail className="h-4 w-4" />
                            {submitting ? 'Sending invite...' : 'Create & send invite'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProviderModal;

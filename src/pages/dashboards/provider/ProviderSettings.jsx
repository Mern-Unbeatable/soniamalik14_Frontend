import React, { useState } from 'react';
import { FiCamera, FiEye, FiEyeOff } from 'react-icons/fi';

const sportsOptions = [
    'Physiotherapy',
    'Nutrition',
    'Personal Training',
    'Sports Massage',
    'Mental Health & Wellbeing',
    'Coaching',
    'Other',
];

const ProviderSettings = () => {
    
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const inputClass =
        'form-field text-sm rounded-lg';

    return (
        <div className="min-h-screen form-shell p-4 md:p-8">
            {/* Header Section */}
            <div className="mx-auto  mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1D1D1D]">Profile</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Manage your account settings and preferences</p>
                </div>
                <button className="rounded-lg bg-[#0F766E] px-8 py-2.5 text-white font-medium hover:bg-[#0D665F] transition-colors">
                    Save
                </button>
            </div>

            {/* Main Form Card */}
            <section className=" overflow-hidden rounded-2xl border border-[#D4E3E2]  bg-[#91C0BC] p-4 shadow-sm">
                <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">Personal Details</h2>
                
                <form className="space-y-4 md:space-y-6 rounded-xl bg-white p-3.5 md:p-6">
                    {/* Profile Image */}
                    <div className="relative h-28 w-28">
                        <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-gray-200">
                            <img 
                                src="https://via.placeholder.com/150"
                                alt="Profile" 
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white shadow-md">
                            <FiCamera className="text-[#0F766E] text-sm" />
                            <input type="file" className="hidden" />
                        </label>
                    </div>

                    {/* Joining As - Checkboxes */}
                    <div>
                        <p className="mb-3 text-base font-semibold text-[#1D1D1D]">I'm joining as</p>
                        <div className="flex flex-wrap gap-2">
                            {sportsOptions.map((service) => (
                                <label key={service} className="flex items-center gap-2 rounded-full bg-[#B5D5D2] px-3 py-2 cursor-pointer border border-transparent hover:border-white/50 transition-all">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-black accent-[#0F766E]"
                                    />
                                    <span className="text-sm font-medium text-black">{service}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Organization or Practioner Name</label>
                            <input className={inputClass} placeholder="Woking Warriors FC" />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">About Business</label>
                            <textarea className={`${inputClass} min-h-[120px] resize-none`} placeholder="Write about club" />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Post Code</label>
                            <input className={inputClass} placeholder="2118 Thornridge Cir. Syracuse, Connecticut 35624" />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Service Area</label>
                            <input className={inputClass} placeholder="2118 Thornridge Cir. Syracuse, Connecticut 35624" />
                        </div>
                    </div>

                    {/* Primary Contact Section */}
                    <div className="pt-4">
                        <h3 className="mb-4 text-xl font-bold text-[#1D1D1D]">Primary Contact</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Full Name</label>
                                <input className={inputClass} placeholder="Enter Your Full Name" />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Email</label>
                                <input type="email" className={inputClass} placeholder="Write your email" />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Phone Number</label>
                                <input className={inputClass} placeholder="Enter your phone number" />
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPass ? "text" : "password"} 
                                            className={inputClass} 
                                            placeholder="•••• •••• ••••" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPass ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-[#1D1D1D]">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPass ? "text" : "password"} 
                                            className={inputClass} 
                                            placeholder="•••• •••• ••••" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showConfirmPass ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ProviderSettings;
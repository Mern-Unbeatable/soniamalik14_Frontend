import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const VerifyEmailView = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(() => localStorage.getItem('register_email') || '');
    const [otp, setOtp] = useState(() => Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (!email || !email.trim()) {
            toast.error('Please provide email');
            return;
        }
        if (code.length !== 6) {
            toast.error('Please enter the 6-digit code');
            return;
        }
        setLoading(true);
        try {
            const body = { email, code };
            const res = await POST(ENDPOINT.AUTH.VERIFY_EMAIL, body);
            const payload = res?.data || res;
            toast.success(payload?.message || 'Email verified');
            navigate('/signin');
        } catch (err) {
            const resp = err?.response?.data;
            const message = resp?.message || err.message || 'Verification failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
        const digits = pasted.split('').filter(c => /^\d$/.test(c));
        if (digits.length === 0) return;
        const next = Array(6).fill('');
        digits.forEach((d, i) => { if (i < 6) next[i] = d; });
        setOtp(next);
        const focusIndex = Math.min(digits.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-btn-primary hover:text-[#0d655d] font-medium text-base">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <h1 className="text-2xl font-bold mb-3 text-center">Verify Email</h1>
                <p className="text-base text-center text-gray-600 mb-6">Enter the code sent to your email to verify your account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-base font-medium mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
                    </div>

                    <div>
                        <label className="block text-base font-medium mb-1">Verification Code</label>
                        <div className="flex justify-center gap-3 mt-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-14 h-14 text-center text-2xl font-semibold bg-white border-2 border-[#0d655d] rounded-lg outline-none focus:ring-2 focus:ring-btn-primary focus:border-btn-primary transition-all"
                                />
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-btn-primary text-white py-2 rounded">
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailView;

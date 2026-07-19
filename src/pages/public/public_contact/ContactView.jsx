import React, { useState, useEffect } from 'react';
import Container from '../../../components/layout/Container';
import { Mail, Globe, Send, CheckCircle } from 'lucide-react';
import { POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const ContactView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const response = await POST(ENDPOINT.CONTACTS.CREATE, payload);
      const result = response?.data || response;

      toast.success(result?.message || 'Message sent successfully');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-[#0B544E] py-12 md:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(15,118,110,0.4),transparent)]" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-semibold mb-3 tracking-tight">
              Contact Us
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              Have a question, suggestion or want to get involved? We’d love to hear from you.
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-28">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-[#0B544E] mb-4">
                Get in touch
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-6">
                Send us a message and we’ll get back to you as soon as we can.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#e7f1f1] p-3 rounded-xl text-[#0f766e]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Email Us
                    </h4>
                    <a
                      href="mailto:admin@essahub.co.uk"
                      className="text-[#0f766e] hover:underline font-semibold text-base mt-1 block"
                    >
                      admin@essahub.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#e7f1f1] p-3 rounded-xl text-[#0f766e]">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Website
                    </h4>
                    <a
                      href="https://essahub.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0f766e] hover:underline font-semibold text-base mt-1 block"
                    >
                      essahub.co.uk
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                © 2026 ESSA Hub. All rights reserved.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="bg-emerald-50 p-4 rounded-full text-emerald-500 mb-4 animate-bounce">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Message Sent!</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  Thank you for reaching out to us. We have received your query and will reply shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0f766e] text-white rounded-lg hover:bg-[#0d6962] transition duration-200 font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#0f766e] focus:outline-none transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#0f766e] focus:outline-none transition duration-200"
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your message about?"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#0f766e] focus:outline-none transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us how we can help..."
                    required
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#0f766e] focus:outline-none transition duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3.5 bg-[#0f766e] text-white rounded-lg hover:bg-[#0d6962] hover:shadow-lg transition duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactView;

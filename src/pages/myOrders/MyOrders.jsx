import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { MdDateRange, MdEmail } from 'react-icons/md';
import { UploadCloud, FileText, X } from 'lucide-react';

const MyOrders = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [productFile, setProductFile] = useState(null);
    const [invoiceFile, setInvoiceFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleProductChange = (e) => {
        const f = e.target.files && e.target.files[0];
        setProductFile(f || null);
    };

    const handleInvoiceChange = (e) => {
        const f = e.target.files && e.target.files[0];
        setInvoiceFile(f || null);
    };

    const handleMarkDelivered = () => {
        if (!productFile || !invoiceFile) {
            setSubmitted('missing');
            return;
        }
        // TODO: wire to API to send files; for now show success and auto-close modal
        setSubmitted('success');
        setTimeout(() => {
            setShowModal(false);
            setProductFile(null);
            setInvoiceFile(null);
            setSubmitted(false);
        }, 1200);
    };

    const orderNumber = '#45897';
    const orderDate = 'Oct 5,2025';
    const customerEmail = 'customer@gmail.com';
    const item = { title: 'Pro Football Boots for Women', price: 320, image: '/images/productDetails/image1.png' };
    const quantity = 1;
    const subtotal = 320;
    const shipping = 0;
    const tax = 61.99;
    const total = 357.99;
    const paymentMethod = 'Online Payment';

    return (
        <div className="bg-[#F8FAFC] py-6 md:py-8 ">
            <Container>
                <div className="
             px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side - Order Details */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Order Number Card */}
                            <div className="bg-[#F8F8F8] rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-[#000000] mb-3">Order Number{orderNumber}</h2>
                                        <div className="flex flex-col gap-2 text-base text-[#626262]">
                                            <div className="flex items-center gap-2">
                                                <MdDateRange className="text-[#626262] flex-shrink-0" size={16} />
                                                <span>{orderDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MdEmail className="text-[#626262] flex-shrink-0" size={16} />
                                                <span>{customerEmail}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:max-w-[260px] bg-[#E7F1F1] border border-[#0F766E] p-3 text-base text-[#000000] ">
                                        A confirmation email has been sent to your inbox
                                    </div>
                                </div>
                            </div>

                            {/* Pickup Information Card */}
                            <div className="bg-[#F8F8F8] rounded-lg p-6 shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold text-[#000000] mb-2">Pick Up Information</h2>
                                <p className="text-base text-[#626262] mb-6">2 items in this shipment</p>

                                {/* Pickup Location */}
                                <div className="mb-6">
                                    <div className="flex items-start rounded-lg bg-[#FFFFFF] gap-3 mb-4 border border-gray-200 p-4">
                                        <FaMapMarkerAlt className="text-[#000000] mt-0.5 flex-shrink-0" size={20} />
                                        <div>
                                            <h3 className="font-semibold text-[#000000] text-base mb-1">Pickup Location</h3>
                                            <p className="text-base text-[#626262]">4517 Washington Ave. Manchester, Kentucky 39495</p>
                                        </div>
                                    </div>

                                    {/* Available Hours */}
                                    <div className="flex items-start rounded-lg bg-[#FFFFFF] gap-3 mb-4 border border-gray-200 p-4">
                                        <FaClock className="text-[#000000]  flex-shrink-0" size={20} />
                                        <div>
                                            <h3 className="font-semibold text-[#000000] text-base mb-1">Available Hours</h3>
                                            <p className="text-base text-[#626262]">Sat-Thu: 10:00 AM - 8:00 PM</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Instructions */}
                                <div className="mb-6 pt-4 rounded-lg bg-[#FFFFFF] gap-3 mb-4 border border-gray-200 p-4">
                                    <h3 className="font-medium text-[#000000] text-lg mb-2">Pickup Instructions</h3>
                                    <p className="text-base text-[#626262] leading-relaxed">Bring your order number when picking up. Show ID for verification. Located on the 2nd floor near the escalator.</p>
                                </div>

                                {/* Mark as Picked Up Button */}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full bg-[#0F766E] text-white font-semibold py-3.5 px-6 rounded-md hover:bg-[#0d5f58] transition-colors duration-200"
                                >
                                    Mark as Picked UP
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-fit lg:sticky lg:top-40">
                            <h2 className="text-lg font-medium text-[#000000] mb-4">Order Summary</h2>

                            {/* Product Item */}
                            <div className="flex gap-3 mb-4">
                                <img src={item.image || '/images/productDetails/image1.png'} alt={item.title || 'Product'} className="w-20 h-20 rounded object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-medium text-[#000000] mb-1">{item.title}</h3>
                                    <p className="text-base text-[#0F766E]">{quantity} x ${item.price}</p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 pt-4 ">
                                <div className="flex justify-between text-base">
                                    <span className="text-[#626262]">Sub-total</span>
                                    <span className="text-[#000000]">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-[#626262]">Shipping</span>
                                    <span className="text-[#000000]">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-[#626262]">Tax</span>
                                    <span className="text-[#000000]">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                                    <span className="text-[#000000]">Total</span>
                                    <span className="text-[#000000]">${total.toFixed(2)} USD</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white  p-4 text-center mt-6 border-t border-gray-200">
                                <p className="text-base font-medium text-[#0F766E]">Payment Method : {paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upload modal shown when marking as picked up */}
                {showModal && (
                    <div onClick={() => setShowModal(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto">
                        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-gray-100 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Upload Product & Invoice</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-800"><X className="w-5 h-5" /></button>
                            </div>

                            {submitted === 'missing' && (
                                <div className="mb-3 rounded-md bg-red-50 border border-red-100 text-red-700 px-3 py-2 text-base">Please upload both product photo and invoice.</div>
                            )}
                            {submitted === 'success' && (
                                <div className="mb-3 rounded-md bg-green-50 border border-green-100 text-green-700 px-3 py-2 text-base">Marked as delivered.</div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Upload Product photo*</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white p-6 text-center">
                                        <input id="product-upload" type="file" accept="image/*" onChange={handleProductChange} className="hidden" />
                                        <label htmlFor="product-upload" className="cursor-pointer inline-flex flex-col items-center gap-2">
                                            <UploadCloud className="w-8 h-8 text-[#0F766E]" />
                                            <div className="text-base font-medium text-[#0F766E]">Upload Image</div>
                                            <div className="text-xs text-gray-500">JPEG files accepted. Max 100MB</div>
                                            <div className="text-xs text-gray-600 mt-2">{productFile ? productFile.name : ''}</div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Upload Invoice*</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white p-6 text-center">
                                        <input id="invoice-upload" type="file" accept="image/*,application/pdf" onChange={handleInvoiceChange} className="hidden" />
                                        <label htmlFor="invoice-upload" className="cursor-pointer inline-flex flex-col items-center gap-2">
                                            <FileText className="w-8 h-8 text-[#0F766E]" />
                                            <div className="text-base font-medium text-[#0F766E]">Upload Image</div>
                                            <div className="text-xs text-gray-500">JPEG or PDF accepted. Max 100MB</div>
                                            <div className="text-xs text-gray-600 mt-2">{invoiceFile ? invoiceFile.name : ''}</div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button onClick={handleMarkDelivered} className="w-full bg-[#0F766E] text-white font-semibold py-2.5 rounded-md hover:bg-[#0d5f58] transition-colors">Mark as Delivered</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default MyOrders;

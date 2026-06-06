import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Star, Flag, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import BanModal from './BanModal';
import { PATCH } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';

const ActionButtons = ({ status, rowId, providerType, onActionDone }) => {
    const navigate = useNavigate();
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleViewDetails = () => {
        if (providerType === 'Sport Providers') {
            navigate(`/admin/listings/sport-provider/${rowId}`);
        } else if (providerType === 'Service Provider') {
            navigate(`/admin/listings/service-provider/${rowId}`);
        }
    };

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            const response = await PATCH(ENDPOINT.SERVICES.APPROVAL_STATUS(rowId), { action: 'approve' });
            const payload = response?.data || response;
            toast.success(payload?.message || 'Listing approved successfully');
            setIsApproveModalOpen(false);
            onActionDone?.();
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Failed to approve listing';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectSubmit = async (reason) => {
        setIsSubmitting(true);
        try {
            const response = await PATCH(ENDPOINT.SERVICES.APPROVAL_STATUS(rowId), {
                action: 'reject',
                reason,
            });
            const payload = response?.data || response;
            toast.success(payload?.message || 'Listing rejected successfully');
            setIsBanModalOpen(false);
            onActionDone?.();
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Failed to reject listing';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleViewDetails}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="View Details"
                >
                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="transition-colors" title={status === 'Featured' ? 'Unfeature' : 'Feature'}>
                    <Star className={`w-4 h-4 md:w-5 md:h-5 ${status === 'Featured' ? 'fill-amber-400 text-amber-400' : 'text-amber-500 hover:fill-amber-100'}`} />
                </button>
                <button
                    onClick={() => setIsBanModalOpen(true)}
                    className="transition-colors"
                    title="Reject Listing"
                    disabled={isSubmitting}
                >
                    <Flag className={`w-4 h-4 md:w-5 md:h-5 ${status === 'Banned' ? 'fill-red-500 text-red-500' : 'text-red-500 hover:fill-red-100'}`} />
                </button>
                {status === 'Pending' && (
                    <button
                        className="text-emerald-500 hover:text-emerald-600 transition-colors disabled:opacity-60"
                        title="Approve"
                        onClick={() => setIsApproveModalOpen(true)}
                        disabled={isSubmitting}
                    >
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                )}
            </div>

            {isApproveModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Approve Listing</h2>
                        <p className="text-sm text-gray-600 mb-5">Are you sure you want to approve this listing?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsApproveModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleApprove}
                                className="px-4 py-2 text-sm font-semibold text-white bg-btn-primary rounded-lg hover:bg-teal-800 disabled:opacity-60"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Approving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BanModal
                isOpen={isBanModalOpen}
                onClose={() => setIsBanModalOpen(false)}
                onSubmit={handleRejectSubmit}
                isSubmitting={isSubmitting}
            />
        </>
    );
};

export default ActionButtons;

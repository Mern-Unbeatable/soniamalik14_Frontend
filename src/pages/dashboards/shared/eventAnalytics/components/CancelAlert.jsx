import React from 'react';
import { AlertCircle } from 'lucide-react';

const CancelAlert = ({ item }) => {
    const isCanceled = (item?.status && String(item.status).toLowerCase().includes('cancel')) || item?.approved === false;
    if (!isCanceled) return null;

    return (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-base text-red-800">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                    <div className="font-semibold mb-1 text-red-700">This event was not approved</div>
                    <div className="text-xs text-red-600">Your event could not be published because it does not meet our community or safety guidelines. Please review the feedback below, make the required changes, and submit again.</div>
                </div>
            </div>
        </div>
    );
};

export default CancelAlert;

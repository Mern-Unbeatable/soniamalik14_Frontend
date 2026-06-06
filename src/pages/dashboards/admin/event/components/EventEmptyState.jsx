import React from 'react';

const EventEmptyState = () => {
    return (
        <tr>
            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                No events found matching your filters.
            </td>
        </tr>
    );
};

export default EventEmptyState;

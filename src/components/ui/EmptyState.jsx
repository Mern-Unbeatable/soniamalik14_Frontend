import React from 'react'
import { Search } from 'lucide-react'

const EmptyState = ({ title = 'No items found', subtitle = '', className = '' }) => {
    return (
        <div className={`w-full flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            {subtitle && <p className="text-base text-gray-500 max-w-md">{subtitle}</p>}
        </div>
    )
}

export default EmptyState

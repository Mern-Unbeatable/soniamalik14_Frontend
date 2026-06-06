import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const VenueCard = ({ item }) => {
    return (
        <aside className="max-w-md lg:col-span-1 mt-10 lg:mt-0">
            <div className="border border-[#91C0BC] rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="p-4">
                    <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-base text-gray-900">Venue:</span>
                            <span className="text-base text-gray-600">{item.venue?.name}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{item.venue?.address}</span>
                        </div>
                    </div>

                    <div className="w-full mb-2 h-40 md:h-48 bg-gray-100">
                        <img src="https://i.ibb.co.com/fY1frBX7/Rectangle-4319.png" alt="Venue map" className="w-full rounded-lg h-full object-cover" />
                    </div>

                    <div className="mb-4">
                        <h4 className="font-bold text-base text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-base text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{item.contact?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-base text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="break-all">{item.contact?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-base text-gray-900 mb-3">Organized By:</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                <img src={item.organizer?.avatar || '/api/placeholder/40/40'} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-base font-semibold text-gray-800">{item.organizer?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default VenueCard;

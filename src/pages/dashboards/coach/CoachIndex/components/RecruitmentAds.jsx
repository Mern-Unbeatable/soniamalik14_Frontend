import { Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const RecruitmentAds = ({ onPost }) => {
    const ads = [
        { id: 1, title: 'U16 Goalkeeper Wanted', applicants: 12, status: 'Active' },
        { id: 2, title: 'Senior Midfielder - Trial Days', applicants: 45, status: 'Active' },
        { id: 3, title: 'Assistant Coach (Volunteer)', applicants: 3, status: 'Pending' },
    ];

    return (
        <div className="p-2 md:p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Active Listings</h3>
                <button onClick={onPost} className="text-btn-primary font-medium">+ Post New</button>
            </div>

            <div className="space-y-4">
                {ads.map((ad) => (
                    <div key={ad.id} className="flex items-center justify-between bg-white border border-[#EDEDED] rounded-xl p-4">
                        <div>
                            <h4 className="font-medium">{ad.title}</h4>
                            <p className="text-base text-secondary-text mt-1 flex items-center gap-1">
                                <Users size={18} />
                                {ad.applicants} Applicants
                            </p>
                            <Link
                                to={`/coach/recruitment/${ad.id}`}
                                state={{ item: ad, from: 'dashboard' }}
                                className="text-btn-primary text-base mt-2 inline-block hover:underline"
                            >
                                View Listing
                            </Link>
                        </div>
                        <div className="text-base">
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${ad.status === 'Active' ? 'bg-[#E7F1F1] text-[#0F766E]' : 'bg-[#FFDAB9] text-[#FF7700]'}`}>{ad.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecruitmentAds;

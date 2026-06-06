import React from 'react';

const Revenue = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
            <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
                
                {/* Main Heading */}
                <h1 className="text-3xl md:text-[42px] leading-[1.2] font-medium text-gray-900 mb-8 tracking-tight">
                    Projected Income from <br className="hidden md:block" />
                    Approved & Upcoming <br className="hidden md:block" />
                    Sources
                </h1>
                
                {/* Coming Soon Graphic */}
                <div className="relative mt-2">
                    {/* Assuming you have this brush stroke image in your public folder */}
                    <img 
                        src="/comingSoon.png" 
                        alt="Coming Soon" 
                        className="w-64 md:w-[340px] h-auto object-contain"
                        onError={(e) => {
                            // Fallback CSS style if the exact image asset is missing
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline-block';
                        }}
                    />
                    
                    {/* CSS Fallback (Visible only if the image above fails to load) */}
                    <div 
                        className="hidden bg-[#df1b1b] text-white font-black text-3xl md:text-5xl px-8 py-3 transform -rotate-3 rounded-sm tracking-widest shadow-sm"
                        style={{ fontFamily: 'Impact, sans-serif' }}
                    >
                        COMING SOON
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Revenue;
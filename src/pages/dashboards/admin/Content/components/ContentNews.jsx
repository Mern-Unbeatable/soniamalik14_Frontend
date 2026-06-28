import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import NewsCard from './NewsCard';
import AddNewsModal from './AddNewsModal';

const ContentNews = () => {
    const [newsSearchQuery, setNewsSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });
    const imageFileRef = useRef(null);

    // NOTE: News dummy data intentionally commented as requested.
    // const newsData = [...];
    const newsData = [];

    const filteredNews = newsData.filter(news =>
        news.title.toLowerCase().includes(newsSearchQuery.toLowerCase())
    );

    // Handle image upload for modal
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result;
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));
        };
        reader.readAsDataURL(file);
    };

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({
            ...prev,
            description: value
        }));
    };

    // Handle save news
    const handleSaveNews = () => {
        if (formData.title.trim() && formData.description.trim()) {
            // Add your save logic here
            console.log('Saving news:', formData);
            // Reset form and close modal
            setFormData({ title: '', description: '', image: null });
            setIsModalOpen(false);
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setFormData({ title: '', description: '', image: null });
        setIsModalOpen(false);
    };

    // Handle upload image click
    const handleUploadImageClick = () => {
        imageFileRef.current?.click();
    };

    // Remove image from modal
    const removeModalImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
    };

    // Handle card edit
    const handleEditCard = (newsId) => {
        // Add your edit logic here
        console.log('Edit news with ID:', newsId);
    };

    // Handle card delete
    const handleDeleteCard = (newsId) => {
        // Add your delete logic here
        console.log('Delete news with ID:', newsId);
    };

    return (
        <div className="font-sans">
            {/* News Top Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                {/* Search Bar matching image styling */}
                <div className="flex items-center w-full sm:max-w-md bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#0f766e]/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={newsSearchQuery}
                        onChange={(e) => setNewsSearchQuery(e.target.value)}
                        placeholder="Search by News name"
                        className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-500"
                    />
                </div>

                {/* Add News Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-6 py-2.5 w-full sm:w-auto bg-[#0f766e] text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm whitespace-nowrap"
                >
                    Add a new News
                </button>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredNews.map((news) => (
                    <NewsCard
                        key={news.id}
                        news={news}
                        onEdit={handleEditCard}
                        onDelete={handleDeleteCard}
                    />
                ))}

                {/* Empty State Fallback */}
                {filteredNews.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 text-sm">
                        No news articles found.
                    </div>
                )}
            </div>

            {/* Add News Modal */}
            <AddNewsModal
                isOpen={isModalOpen}
                formData={formData}
                onFormChange={handleFormChange}
                onDescriptionChange={handleDescriptionChange}
                onImageUpload={handleImageUpload}
                onUploadImageClick={handleUploadImageClick}
                onRemoveImage={removeModalImage}
                onSave={handleSaveNews}
                onClose={handleCloseModal}
                imageFileRef={imageFileRef}
            />
        </div>
    );
};

export default ContentNews;
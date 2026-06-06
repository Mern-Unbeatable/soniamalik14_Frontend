import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useService } from '../../../../context/ServiceContext';
import PageHeader from '../../../../components/ui/PageHeader';
import ServiceModal from '../../../../components/ui/ServiceModal';
import ServiceCard from '../../../../components/ui/ServiceCard';
import Pagination from '../../../../components/ui/Pagination';

const ProviderService = () => {
    const { user } = useAuth();
    const {
        providerServices,
        loading,
        fetchProviderServices,
        deleteService
    } = useService();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        if (user) {
            fetchProviderServices();
        }
    }, [user, fetchProviderServices]);

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(providerServices.length / itemsPerPage));

    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return providerServices.slice(startIndex, startIndex + itemsPerPage);
    }, [providerServices, currentPage, itemsPerPage]);

    const handleEdit = (service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleDelete = async (item) => {
        await deleteService(item.id);
    };


    if (loading && providerServices.length === 0) {
        return (
            <div className='dashboardPy dashboardSpaceY'>
                <PageHeader
                    title="Manage Your Services"
                    description="This is where you manage all the services you provide to the women's sports community."
                    ctaText="Create Service"
                    onCtaClick={() => setIsModalOpen(true)}
                />
                <div className="flex justify-center items-center h-64">
                    <p className="text-cardTitle">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='dashboardPy dashboardSpaceY'>
            <PageHeader
                title="Manage Your Services"
                description="This is where you manage all the services you provide to the women's sports community."
                ctaText="Create Service"
                onCtaClick={() => setIsModalOpen(true)}
            />
            <div className="pt-6">
                {providerServices.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No services found.</p>
                      
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-6 2xl:grid-cols-4">
                        {paginatedServices.map((s, idx) => (
                            <div key={s.id || `service-${idx}`} className="relative">

                                <ServiceCard key={s.id || `service-${idx}`} item={s} onEdit={() => handleEdit(s)} onDelete={() => handleDelete(s)} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {providerServices.length > itemsPerPage && (
                <Pagination
                    page={currentPage}
                    total={totalPages}
                    onChange={(p) => setCurrentPage(p)}
                />
            )}

            <ServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingService}
                mode={editingService ? 'edit' : 'create'}
            />
        </div>
    );
};

export default ProviderService;
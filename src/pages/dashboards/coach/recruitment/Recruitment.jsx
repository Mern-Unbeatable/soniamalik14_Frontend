import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecruitmentCard from './RecruitmentCard';
import Pagination from '../../../../components/ui/Pagination';
import CreateRecruitmentModal from '../../../../components/ui/CreateRecruitmentModal';
import EventModal from '../../../../components/ui/EventModal';
import { Plus } from 'lucide-react';
import { fetchProviderServices, deleteService } from '../../../../features/service/serviceApi';
import {
  selectProviderServices,
  selectProviderServicesLoading,
} from '../../../../features/service/serviceSlice';

const Recruitment = () => {
  const dispatch = useDispatch();
  const providerServices = useSelector(selectProviderServices);
  const loading = useSelector(selectProviderServicesLoading);

  const [page, setPage] = useState(1);
  const perPage = 9;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchProviderServices());
  }, [dispatch]);

  const items = useMemo(
    () =>
      (Array.isArray(providerServices) ? providerServices : []).map((service) => ({
        ...service,
        image: service.logo || service.image || null,
        location:
          service.fullAddress || service.location || service.city || service.addressLine1 || 'N/A',
        days: service.availableDays || 'N/A',
        time: service.timeSlots || service.timeSlote || 'N/A',
      })),
    [providerServices]
  );

  const handleEdit = (it) => {
    setSelectedItem(it);
    setIsModalOpen(true);
  };

  const handleDelete = async (it) => {
    if (!it?.id) return;
    await dispatch(deleteService(it.id)).unwrap();
    dispatch(fetchProviderServices());
  };

  const handleModalSuccess = () => {
    dispatch(fetchProviderServices());
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  return (
    <div className="dashboardPy">
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0B544E] md:text-3xl">
              Manage your Listings
            </h1>
          </div>
          <div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsModalOpen(true);
              }}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#0F766E] px-4 py-3 text-base font-medium whitespace-nowrap text-white transition-colors hover:bg-[#0d655d]"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add New Listing
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.slice((page - 1) * perPage, page * perPage).map((it, index) => (
          <RecruitmentCard
            key={it?.id ? `recruitment-${it.id}` : `recruitment-${page}-${index}`}
            item={it}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
          No listing available yet. Add your first listing.
        </div>
      )}

      {items.length > perPage && (
        <Pagination page={page} total={totalPages} onChange={(p) => setPage(p)} />
      )}

      <CreateRecruitmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        initialData={selectedItem}
        mode={selectedItem ? 'edit' : 'create'}
        onSuccess={handleModalSuccess}
        onSwitchToEvent={() => setIsEventModalOpen(true)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        mode="create"
        useOrganizerApi
        onSuccess={handleModalSuccess}
        onSwitchToSession={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export default Recruitment;
